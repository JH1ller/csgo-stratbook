import { nanoid } from 'nanoid';
import { Server, Socket } from 'socket.io';
import { StratModel } from '@/models/strat';
import { Boards } from './types';

const boards: Boards = {};

// for debugging
(global as any).boards = boards;

export const registerBoardHandler = (io: Server, socket: Socket) => {
  socket.on('join-draw-room', async ({ targetRoomId, userName, stratId }) => {
    if (targetRoomId && typeof targetRoomId !== 'string') return;
    const roomId = targetRoomId ?? nanoid(10);
    socket.join(roomId);
    socket.data.drawRoomId = roomId;
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
      stratName: boards[roomId].stratName ?? '',
      drawData: boards[roomId].data,
    });
  });

  socket.on('leave-draw-room', async () => {
    const roomId = socket.data.drawRoomId;
    if (!roomId) {
      console.warn('leave-draw-room -> Missing roomId');
      return;
    }
    socket.leave(roomId);

    console.log(`Socket with ID: ${socket.id} left draw room with id: ${roomId}`);

    const stratId = boards[roomId]?.stratId;

    delete boards[roomId].clients[socket.id];

    const player = socket.data.player;

    if (stratId && player) {
      const strat = await StratModel.findById(stratId);
      if (!strat) {
        console.warn(`leave-draw-room -> Strat with ID ${stratId} not found.`);
        return;
      }
      if (!strat.team.equals(player.team)) {
        console.warn(`leave-draw-room -> Player not part of team associated with strat.`);
        return;
      }
      strat.drawData = { ...boards[roomId].data };
      console.log('leave-draw-room -> successfully saved data');
      strat.save();
    }
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

    io.to(roomId).emit('data-updated', { images, lines, texts, id: socket.id });
  });

  socket.on('update-username', (userName) => {
    console.log('update username', userName);
    const roomId = socket.data.drawRoomId;

    if (!boards[roomId]?.clients[socket.id]) return;
    boards[roomId].clients[socket.id].userName = userName;

    io.to(roomId).emit('username-updated', { userName, id: socket.id });
  });

  socket.on('update-stratname', (stratName) => {
    console.log('update stratname', stratName);

    if (!stratName) return;

    const roomId = socket.data.drawRoomId;

    if (!boards[roomId]) return;
    boards[roomId].stratName = stratName;

    io.to(roomId).emit('stratname-updated', { stratName, id: socket.id });
  });
};
