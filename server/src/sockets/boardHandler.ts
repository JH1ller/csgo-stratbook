import { nanoid } from 'nanoid';
import { Server, Socket } from 'socket.io';
import { StratModel } from '@/models/strat';
import { Boards } from './types';
import { Log } from '@/utils/logger';

const boards: Boards = {};

// for debugging
(global as any).boards = boards;

export const registerBoardHandler = (io: Server, socket: Socket) => {
  socket.on('join-draw-room', async ({ targetRoomId, userName, stratId }) => {
    if (targetRoomId && typeof targetRoomId !== 'string') return;
    const roomId = targetRoomId ?? nanoid(10);
    socket.join(roomId);
    socket.data.drawRoomId = roomId;

    boards[roomId] = boards[roomId] ?? { stratId, clients: {}, data: {} };
    boards[roomId].clients[socket.id] = boards[roomId].clients[socket.id] ?? { position: { x: 0, y: 0 } };

    //* only fetch drawData from db for the first user who joins
    if (stratId && Object.keys(boards[roomId].clients).length === 1) {
      const strat = await StratModel.findById(stratId);
      if (strat?.drawData) {
        boards[roomId].data = strat.drawData;
      }
    }
    if (userName) {
      boards[roomId].clients[socket.id].userName = userName;
    }

    Log.info('sockets::join-draw-room', `User ${socket.id} joined room ${roomId}`);

    io.to(socket.id).emit('draw-room-joined', {
      roomId,
      stratName: boards[roomId].stratName ?? '',
      drawData: boards[roomId].data,
    });
  });

  socket.on('leave-draw-room', async () => {
    const roomId = socket.data.drawRoomId;
    if (!roomId) {
      Log.warn('sockets::leave-draw-room', `Missing roomId for user ${socket.id}`);
      return;
    }
    socket.leave(roomId);

    const stratId = boards[roomId]?.stratId;

    delete boards[roomId].clients[socket.id];

    const player = socket.data.player;

    if (stratId && player) {
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
        strat.drawData = boards[roomId].data;
        await strat.save();
        Log.debug('sockets::leave-draw-room', `Drawdata saved.`);
      } catch (error) {
        Log.error('sockets::leave-draw-room', error.message);
      }
    }
    Log.info('sockets::leave-draw-room', `User ${socket.id} left room ${roomId}`);
  });

  socket.on('pointer-position', ({ x, y }) => {
    const roomId = socket.data.drawRoomId;
    if (!boards[roomId]?.clients[socket.id]) return;
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

    if (!boards[roomId]) return;
    boards[roomId].data.images = images;
    boards[roomId].data.lines = lines;
    boards[roomId].data.texts = texts;

    Log.info('sockets::update-data', `Updated data of room ${roomId}`);

    io.to(roomId).emit('data-updated', { images, lines, texts, id: socket.id });
  });

  socket.on('update-username', (userName) => {
    const roomId = socket.data.drawRoomId;

    if (!boards[roomId]?.clients[socket.id]) return;
    boards[roomId].clients[socket.id].userName = userName;

    Log.info('sockets::update-username', `Updated username of player ${socket.id} to ${userName}`);

    io.to(roomId).emit('username-updated', { userName, id: socket.id });
  });

  socket.on('update-stratname', (stratName) => {
    if (!stratName) return;

    const roomId = socket.data.drawRoomId;

    if (!boards[roomId]) return;
    boards[roomId].stratName = stratName;

    Log.info('sockets::update-stratname', `Updated stratname of room ${roomId} to ${stratName}`);

    io.to(roomId).emit('stratname-updated', { stratName, id: socket.id });
  });
};
