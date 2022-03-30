import { nanoid } from 'nanoid';
import { Server, Socket } from 'socket.io';
import { StratModel } from '@/models/strat';
import { Boards } from '../types';
import { Log } from '@/utils/logger';
import { Room } from './room';
import { TypedSocket, TypedServer } from './interfaces';

const boards: Boards = {};

// for debugging
(global as any).boards = boards;

export const registerBoardHandler = (io: TypedServer, socket: TypedSocket) => {
  socket.on('join-draw-room', async ({ targetRoomId, userName, stratId, map }) => {
    if (targetRoomId && typeof targetRoomId !== 'string') return;
    const roomId = targetRoomId ?? nanoid(10);
    socket.join(roomId);
    socket.data.drawRoomId = roomId;

    boards[roomId] = boards[roomId] ?? new Room(map, stratId);
    boards[roomId].addClient(socket.id, userName);

    //* only fetch drawData from db for the first user who joins
    if (stratId && Object.keys(boards[roomId].clients).length === 1) {
      const strat = await StratModel.findById(stratId);
      if (strat?.drawData) {
        boards[roomId].updateData(map, strat.drawData);
      }
    }

    Log.info(
      'sockets::join-draw-room',
      `User ${userName || socket.id} joined room ${roomId}. Map ${boards[roomId].currentMap}`
    );

    io.to(socket.id).emit('draw-room-joined', {
      roomId,
      map: boards[roomId].currentMap,
      stratName: boards[roomId].mapData.stratName ?? '',
      drawData: boards[roomId].mapData.data,
      clients: boards[roomId].clientsList,
      userName: boards[roomId].clients[socket.id].userName,
    });
    io.to(roomId).emit('client-joined', { ...boards[roomId].clients[socket.id], id: socket.id });
  });

  socket.on('leave-draw-room', () => leaveDrawRoomHandler(io, socket));

  socket.on('pointer-position', ({ x, y }) => {
    const roomId = socket.data.drawRoomId;
    if (!roomId || !boards[roomId]?.clients[socket.id]) return;
    boards[roomId].clients[socket.id].position.x = x;
    boards[roomId].clients[socket.id].position.y = y;

    io.to(roomId).emit('pointer-data', {
      ...boards[roomId].clients[socket.id].position,
      id: socket.id,
      userName: boards[roomId].clients[socket.id].userName,
    });
  });

  socket.on('update-data', ({ images, lines, texts }) => {
    const roomId = socket.data.drawRoomId;

    if (!roomId || !boards[roomId]) return;
    boards[roomId].mapData.data = { images, lines, texts };

    //Log.info('sockets::update-data', `Updated data of room ${roomId}`);

    io.to(roomId).emit('data-updated', { images, lines, texts, id: socket.id });
  });

  socket.on('update-username', (userName) => {
    const roomId = socket.data.drawRoomId;
    if (!roomId) return;

    if (!boards[roomId]?.clients[socket.id]) return;
    boards[roomId].clients[socket.id].userName = userName;

    Log.info('sockets::update-username', `Updated username of player ${socket.id} to ${userName}`);

    io.to(roomId).emit('username-updated', { userName, id: socket.id });
  });

  socket.on('update-stratname', (stratName) => {
    const roomId = socket.data.drawRoomId;
    if (!stratName || !roomId) return;

    if (!boards[roomId]) return;
    boards[roomId].mapData.stratName = stratName;

    Log.info('sockets::update-stratname', `Updated stratname of room ${roomId} to ${stratName}`);

    io.to(roomId).emit('stratname-updated', { stratName, id: socket.id });
  });

  socket.on('update-map', (map) => {
    const roomId = socket.data.drawRoomId;
    if (!map || !roomId || !boards[roomId]) return;

    boards[roomId].currentMap = map;

    Log.info('sockets::update-map', `Updated map of room ${roomId} to ${map}`);

    io.to(roomId).emit('map-updated', {
      map,
      stratName: boards[roomId].mapData.stratName,
      drawData: boards[roomId].mapData.data,
      id: socket.id,
    });
  });
};

export const leaveDrawRoomHandler = async (io: TypedServer, socket: TypedSocket) => {
  const roomId = socket.data.drawRoomId;
  if (!roomId) {
    Log.warn('sockets::leave-draw-room', `Missing roomId for user ${socket.id}`);
    return;
  }
  socket.leave(roomId);

  const stratId = boards[roomId]?.mapData.stratId;

  delete boards[roomId].clients[socket.id];

  const player = socket.data.player;

  if (stratId && player?.team) {
    const strat = await StratModel.findById(stratId);
    if (!strat) {
      Log.warn('sockets::leave-draw-room', `Strat ${stratId} not found.`);
      return;
    }
    if (!strat.team.equals(player.team)) {
      Log.warn('sockets::leave-draw-room', 'Player not part of team associated with strat.');
      return;
    }
    try {
      strat.drawData = boards[roomId].mapData.data;
      await strat.save();
      Log.debug('sockets::leave-draw-room', `Drawdata saved.`);
    } catch (error) {
      Log.error('sockets::leave-draw-room', error.message);
    }
  }

  io.to(roomId).emit('client-left', { clientId: socket.id });
  Log.info('sockets::leave-draw-room', `User ${socket.id} left room ${roomId}`);
};
