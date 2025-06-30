import { Server } from 'node:http';

import jwt from 'jsonwebtoken';
import { Server as SocketServer } from 'socket.io';

import { PlayerModel } from '@/models/player';
import { StratModel } from '@/models/strat';
import { Room } from '@/sockets/room';
import { AccessRole } from '@/types/enums';
import {
  ClientToServerEvents,
  InterServerEvents,
  ServerToClientEvents,
  SocketData,
  TypedSocket,
} from '@/types/sockets';
import { getErrorMessage } from '@/utils/errors/parseError';
import { Logger } from '@/utils/logger';

import { configService } from './config.service';

const logger = new Logger('SocketService');

const CLIENT_INACTIVITY_THRESHOLD = 15 * 60 * 1000; // 15 minutes
const ROOM_INACTIVITY_THRESHOLD = 60 * 60 * 1000; // 60 minutes
const CLEANUP_INTERVAL = 10 * 60 * 1000; // 10 minutes

export class SocketService extends SocketServer<
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData
> {
  private rooms: Map<string, Room>;
  private cleanupInterval?: NodeJS.Timeout;

  constructor() {
    super({
      pingInterval: 10_000,
      cors: {
        origin: configService.allowedOrigins,
        methods: ['GET', 'POST'],
        credentials: true,
      },
    });

    this.rooms = new Map();
    this.startCleanup();
  }

  getRoom(roomId?: string) {
    if (!roomId) return;
    return this.rooms.get(roomId);
  }

  initialize(httpServer: Server) {
    this.attach(httpServer);

    logger.success('Successfully attached.');

    this.use(async (socket, next) => {
      const token = socket.handshake.auth.token;
      if (token) {
        try {
          const verifiedUserId = jwt.verify(token, configService.env.TOKEN_SECRET);
          const player = await PlayerModel.findById(verifiedUserId);
          if (!player) {
            next(new Error('Error during socket authorization.'));
            return;
          }
          socket.data.player = player;
        } catch (error) {
          logger.error(getErrorMessage(error));
          next(new Error('Error during socket authorization.'));
        }
      }
      next();
    });

    this.on('connection', (socket) => {
      logger.info(`User '${socket.id}' connected. Active connections: ${this.sockets.sockets.size}`);
      this.registerBoardHandler(socket);

      this.handleConnection(socket);

      socket.on('ping', () => {
        this.to(socket.id).emit('pong');
      });

      socket.on('disconnecting', async (reason) => {
        const player = socket.data.player;

        logger.info(
          `User '${player?.name ?? socket.id}' disconnected. Active connections: ${
            this.sockets.sockets.size
          }. Disconnect reason: ${reason}`,
        );

        this.leaveDrawRoomHandler(socket);

        if (!player || !player.team) return;
        try {
          if (socket.data.activeQuery) {
            await socket.data.activeQuery;
          }

          player.$locals.skipModified = true;
          player.isOnline = false;
          player.lastOnline = new Date();
          socket.data.activeQuery = player.save();
          await socket.data.activeQuery;
          socket.data.activeQuery = undefined;
          this.to(player.team.toString()).emit('updated-player', { player: player.toObject() });
        } catch (error) {
          logger.error('Failed to update online status', getErrorMessage(error));
        }
      });
    });
  }

  async handleConnection(socket: TypedSocket) {
    const player = socket.data.player;
    if (player && player.team) {
      socket.join(player.team.toString());

      try {
        if (socket.data.activeQuery) {
          await socket.data.activeQuery;
        }
        logger.debug('player.isOnline -> true');
        player.$locals.skipModified = true;
        player.isOnline = true;

        socket.data.activeQuery = player.save();
        await socket.data.activeQuery;
        socket.data.activeQuery = undefined;
        this.to(player.team.toString()).emit('updated-player', { player: player.toObject() });
      } catch (error) {
        logger.error(
          `Error while saving isOnline status for player: ${player.name} (#${player._id})\n`,
          getErrorMessage(error),
        );
      }
    }
  }

  startCleanup() {
    this.cleanupInterval = setInterval(() => {
      for (const [roomId, room] of this.rooms.entries()) {
        room.removeInactiveClients(CLIENT_INACTIVITY_THRESHOLD);
        if (room.isInactive(ROOM_INACTIVITY_THRESHOLD)) {
          this.rooms.delete(roomId);
          logger.info(`Room ${roomId} deleted due to inactivity.`);
        }
      }
    }, CLEANUP_INTERVAL);
  }

  stopCleanup() {
    if (this.cleanupInterval) clearInterval(this.cleanupInterval);
  }

  registerBoardHandler(socket: TypedSocket) {
    socket.on('join-draw-room', async ({ targetRoomId, userName, stratId, map }) => {
      if (targetRoomId && typeof targetRoomId !== 'string') return;

      // create room if it doesn't exist yet
      const room = this.getRoom(targetRoomId) ?? new Room({ map, stratId, roomId: targetRoomId });

      if (!this.rooms.has(room.id)) {
        this.rooms.set(room.id, room);
      }

      socket.join(room.id);

      socket.data.drawRoomId = room.id;

      const client = room.addClient(socket.id, userName, socket.data.player?.color);

      //* only fetch drawData from db for the first user who joins
      if (stratId && room.clients.size === 1) {
        const strat = await StratModel.findById(stratId);
        if (strat?.drawData) {
          // update playeritem color incase it was changed
          for (const playerItem of strat.drawData.players ?? []) {
            if (playerItem.playerId) {
              const player = await PlayerModel.findById(playerItem.playerId);
              if (!player || !player.team?.equals(strat.team)) continue;
              playerItem.color = player.color;
            }
          }
          room.updateData(map, strat.drawData);
        }
      }

      // update color data of joining player
      if (socket.data.player) {
        const updatedPlayerDocument = await PlayerModel.findById(socket.data.player._id);
        if (updatedPlayerDocument) {
          client.color = updatedPlayerDocument.color;
        }
      }

      logger.info(`User ${userName || socket.id} joined room ${room.id}. Map ${room.currentMap}`);

      this.to(socket.id).emit('draw-room-joined', {
        roomId: room.id,
        map: room.currentMap,
        stratName: room.mapData.stratName ?? '',
        drawData: room.mapData.data,
        clients: room.clientsList,
        userName: client.userName,
        color: client.color,
      });
      this.to(room.id).emit('client-joined', client);
    });

    socket.on('leave-draw-room', () => this.leaveDrawRoomHandler(socket));

    socket.on('pointer-position', ({ x, y }) => {
      const room = this.getRoom(socket.data.drawRoomId);
      if (!room) return;

      const client = room.getClient(socket.id);
      if (!client) return;

      client.position.x = x;
      client.position.y = y;
      room.touch(socket.id);

      //TODO: replace pointer-data event with client-updated
      this.to(room.id).emit('pointer-data', {
        ...client.position,
        id: socket.id,
        userName: client.userName,
      });
    });

    socket.on('update-data', (boardData) => {
      const room = this.getRoom(socket.data.drawRoomId);
      if (!room) return;

      // don't allow non-editors to update data
      if (socket.data.player && socket.data.player.role !== AccessRole.EDITOR) return;

      room.updateData(room.currentMap, boardData, socket.id);

      this.to(room.id).emit('data-updated', { ...boardData, id: socket.id });
    });

    socket.on('update-username', (userName) => {
      const room = this.getRoom(socket.data.drawRoomId);
      if (!room) return;
      const client = room.getClient(socket.id);
      if (!client) return;
      client.userName = userName;
      room.touch(socket.id);

      logger.info(`Updated username of player ${socket.id} to ${userName}`);

      this.to(room.id).emit('username-updated', { userName, id: socket.id });
    });

    socket.on('update-stratname', (stratName) => {
      const room = this.getRoom(socket.data.drawRoomId);
      if (!room || !stratName) return;
      room.mapData.stratName = stratName;
      room.touch(socket.id);

      logger.info(`Updated stratname of room ${room.id} to ${stratName}`);

      this.to(room.id).emit('stratname-updated', { stratName, id: socket.id });
    });

    socket.on('update-map', (map) => {
      const room = this.getRoom(socket.data.drawRoomId);
      if (!room) return;
      room.currentMap = map;
      room.touch(socket.id);

      logger.info(`Updated map of room ${room.id} to ${map}`);

      this.to(room.id).emit('map-updated', {
        map,
        stratName: room.mapData.stratName,
        drawData: room.mapData.data,
        id: socket.id,
      });
    });
  }

  async leaveDrawRoomHandler(socket: TypedSocket) {
    const room = this.getRoom(socket.data.drawRoomId);

    if (!room || !socket.data.player) return;

    socket.leave(room.id);

    const stratId = room.mapData.stratId;

    room.clients.delete(socket.id);

    const player = socket.data.player;

    if (stratId && player.team) {
      const strat = await StratModel.findById(stratId);
      if (!strat) {
        logger.warn(`Strat ${stratId} not found.`);
        return;
      }
      if (!strat.team.equals(player.team)) {
        logger.warn('Player not part of team associated with strat.');
        return;
      }
      try {
        strat.drawData = room.mapData.data;
        // TODO: only update strat when last user leaves sketchtool
        const updatedStrat = await strat.save();
        // TODO: currently only updates correctly on the client when we use the batch event instead of 'update-strat'
        this.to(player.team.toString()).emit('updated-strats', { strats: [updatedStrat.toObject()] });
      } catch (error) {
        logger.error(getErrorMessage(error));
      }
    }

    this.to(room.id).emit('client-left', { clientId: socket.id });
    logger.info(`User ${socket.id} left room ${room.id}`);
  }
}

const socketService = new SocketService();

export { socketService };
