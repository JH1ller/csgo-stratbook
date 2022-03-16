import { nanoid } from 'nanoid';
import { Server, Socket } from 'socket.io';
import { StratModel } from '../models/strat';
import { Boards } from './types';

const boards: Boards = {};

// for debugging
(global as any).boards = boards;

export const registerBoardHandler = (io: Server, socket: Socket) => {
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

    const player = socket.data.player;

    if (stratId && player) {
      const strat = await StratModel.findById(stratId);
      if (!strat) {
        console.warn(`leave-draw-room -> Strat with ID ${stratId} not found.`);
        return;
      }
      if (strat.team !== player.team) {
        console.warn(`leave-draw-room -> Player not part of team associated with strat.`);
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
};
