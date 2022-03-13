import { nanoid } from 'nanoid';
import { Server } from 'socket.io';
import { PlayerModel } from '../models/player';
import { StratModel } from '../models/strat';
import { TeamModel } from '../models/team';
import { UtilityModel } from '../models/utility';
import { Boards } from './types/index';

const clients = new Map();

const boards: Boards = {};

// for debugging
(global as any).boards = boards;
(global as any).clients = clients;

export const initialize = (io: Server) => {
  io.on('connection', (socket) => {
    //console.log('Websocket client connected with id: ', socket.conn.id);
    socket.on('join-room', async (data) => {
      socket.join(data.teamID);
      clients.set(socket.id, { playerID: data.playerID, teamID: data.teamID });

      try {
        const player = await PlayerModel.findById(data.playerID);
        if (player) {
          player.isOnline = true;
          player.save();
        }
      } catch (error) {
        console.error(`Could not find player with ID: ${data.playerID}`);
      }

      io.to(data.teamID).emit('room-joined', { roomID: data.teamID });
    });

    socket.on('join-draw-room', async ({ targetRoomId, userName, stratId }) => {
      if (targetRoomId && typeof targetRoomId !== 'string') return;
      const roomId = targetRoomId ?? nanoid(10);
      socket.join(roomId);
      console.log('Joined draw room, target id', roomId);

      boards[roomId] = boards[roomId] ?? { stratId, clients: {}, data: {} };
      boards[roomId].clients[socket.id] = boards[roomId].clients[socket.id] ?? { position: { x: 0, y: 0 } };

      if (stratId) {
        const strat = await StratModel.findById(stratId);
        if (strat?.drawData) {
          boards[roomId].data = strat.drawData;
        }
      }
      if (userName) {
        boards[roomId].clients[socket.id].userName = userName;
      }

      io.to(socket.id).emit('draw-room-joined', {
        roomId,
        clientId: socket.id,
        stratName: boards[roomId].stratName,
        drawData: boards[roomId].data,
      });
    });

    socket.on('leave-draw-room', async ({ roomId }) => {
      if (!roomId) {
        console.warn('leave-draw-room -> Missing roomId');
        return;
      }
      socket.leave(roomId);

      console.log(`Socket with ID: ${socket.id} left draw room with id: ${roomId}`);

      const stratId = boards[roomId].stratId;

      delete boards[roomId].clients[socket.id];

      if (stratId) {
        const strat = await StratModel.findById(stratId);
        if (!strat) {
          console.warn(`leave-draw-room -> Strat with ID ${stratId} not found.`);
          return;
        }
        strat.drawData = { ...boards[roomId].data };
        console.log('leave-draw-room -> successfully saved data');
        strat.save();
      }
    });

    socket.on('pointer-position', ({ x, y }) => {
      //* First room is always the clientId, therefore we grab the second
      const room = [...socket.rooms.values()][1];

      if (!boards[room]) return;
      boards[room].clients[socket.id].position.x = x;
      boards[room].clients[socket.id].position.y = y;

      io.to(room).emit('pointer-data', {
        ...boards[room].clients[socket.id].position,
        id: socket.id,
        userName: boards[room].clients[socket.id].userName,
      });
    });

    socket.on('update-data', ({ images, lines, texts }) => {
      //* First room is always the clientId, therefore we grab the second
      const room = [...socket.rooms.values()][1];

      if (!boards[room]) return;
      boards[room].data.images = images;
      boards[room].data.lines = lines;
      boards[room].data.texts = texts;

      io.to(room).emit('data-updated', { images, lines, texts, id: socket.id });
    });

    socket.on('update-username', (userName) => {
      console.log('update username', userName);
      //* First room is always the clientId, therefore we grab the second
      const room = [...socket.rooms.values()][1];

      if (!boards[room]) return;
      boards[room].clients[socket.id].userName = userName;

      io.to(room).emit('username-updated', { userName, id: socket.id });
    });

    socket.on('update-stratname', (stratName) => {
      console.log('update stratname', stratName);

      if (!stratName) return;
      //* First room is always the clientId, therefore we grab the second
      const room = [...socket.rooms.values()][1];

      if (!boards[room]) return;
      boards[room].stratName = stratName;

      io.to(room).emit('stratname-updated', { stratName, id: socket.id });
    });

    socket.on('disconnecting', async () => {
      try {
        const client = clients.get(socket.id);
        if (!client) return;
        clients.delete(socket.id);
        const playerInClientList = [...clients].find(([_key, value]) => value.playerID === client.playerID);
        if (!playerInClientList) {
          const player = await PlayerModel.findById(client.playerID);
          if (!player) return;
          player.isOnline = false;
          player.lastOnline = new Date();
          player.save();
          console.log(`Websocket client disconnected with id: ${socket.id}`);
        }
      } catch (error) {
        console.log(error);
      }
    });
  });

  StratModel.watch(undefined, { fullDocument: 'updateLookup' }).on('change', async (data) => {
    if (data.operationType === 'delete') return;

    switch (data.operationType) {
      case 'insert':
        io.to(data.fullDocument.team.toString()).emit('created-strat', { strat: data.fullDocument });
        break;
      case 'update':
        data.updateDescription?.updatedFields.deleted
          ? io.to(data.fullDocument.team.toString()).emit('deleted-strat', { stratID: data.fullDocument._id })
          : io.to(data.fullDocument.team.toString()).emit('updated-strat', { strat: data.fullDocument });
        break;
    }
  });

  UtilityModel.watch(undefined, { fullDocument: 'updateLookup' }).on('change', async (data) => {
    if (data.operationType === 'delete') return;

    switch (data.operationType) {
      case 'insert':
        io.to(data.fullDocument.team.toString()).emit('created-utility', { utility: data.fullDocument });
        break;
      case 'update':
        data.updateDescription?.updatedFields.deleted
          ? io.to(data.fullDocument.team.toString()).emit('deleted-utility', { utilityID: data.fullDocument._id })
          : io.to(data.fullDocument.team.toString()).emit('updated-utility', { utility: data.fullDocument });
        break;
    }
  });

  TeamModel.watch(undefined, { fullDocument: 'updateLookup' }).on('change', async (data) => {
    if (data.operationType === 'delete') return;

    switch (
      data.operationType // keep switch statement in case "insert" is handled here later
    ) {
      case 'update':
        data.updateDescription?.updatedFields.deleted
          ? io.to(data.fullDocument._id.toString()).emit('deleted-team')
          : io.to(data.fullDocument._id.toString()).emit('updated-team', { team: data.fullDocument });
        break;
    }
  });

  PlayerModel.watch(undefined, { fullDocument: 'updateLookup' }).on('change', async (data) => {
    if (data.operationType === 'delete') return;

    switch (
      data.operationType // keep switch statement in case "insert" is handled here later
    ) {
      case 'update':
        data.updateDescription?.updatedFields.deleted
          ? io.to(data.fullDocument.team.toString()).emit('deleted-player', { playerID: data.fullDocument._id })
          : io.to(data.fullDocument.team.toString()).emit('updated-player', {
              player: {
                _id: data.fullDocument._id,
                name: data.fullDocument.name,
                role: data.fullDocument.role,
                avatar: data.fullDocument.avatar,
                team: data.fullDocument.team,
                createdAt: data.fullDocument.createdAt,
                isOnline: data.fullDocument.isOnline,
                lastOnline: data.fullDocument.lastOnline,
              },
            });
        break;
    }
  });
};
