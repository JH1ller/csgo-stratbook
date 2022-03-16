import { Server } from 'socket.io';
import { PlayerModel } from '@/models/player';
import jwt from 'jsonwebtoken';
import { registerBoardHandler } from './boardHandler';
import { registerWatchHandler } from './watchHandler';
import { Log } from '@/utils/logger';

export const initialize = (io: Server) => {
  registerWatchHandler(io);
  (global as any).io = io;
  //* Auth middleware
  io.use(async (socket, next) => {
    const token = socket.handshake.auth.token;
    if (token) {
      try {
        const verifiedUserId = jwt.verify(token, process.env.TOKEN_SECRET!);
        const player = await PlayerModel.findById(verifiedUserId);
        if (!player) {
          next(new Error('Error during socket authorization.'));
        }
        socket.data.player = player;
      } catch (error) {
        console.warn('Socket auth middleware -> ', error.message);
        next(new Error('Error during socket authorization.'));
      }
    }
    next();
  });

  io.on('connection', (socket) => {
    Log.info(`Socket.io -> User '${socket.id}' connected. Active connections: ${io.sockets.sockets.size}`);
    registerBoardHandler(io, socket);

    socket.on('join-room', async () => {
      console.log('join room called ', socket.id, [...socket.rooms]);
      const player = socket.data.player;
      if (!player) {
        console.warn('Tried joining room without auth.');
        return;
      }
      socket.join(player.team.toString());

      try {
        if (socket.data.activeQuery) {
          await socket.data.activeQuery;
        }
        player.isOnline = true;
        socket.data.activeQuery = player.save();
        await socket.data.activeQuery;
        socket.data.activeQuery = undefined;
      } catch (error) {
        console.error(
          `Error while saving isOnline status for player: ${player.name} (#${player._id})\n`,
          error.message
        );
      }

      io.to(player.team).emit('room-joined');
    });

    socket.on('disconnect', async (reason) => {
      console.info(
        `Socket.io -> User '${socket.id}' disconnected. Active connections: ${io.sockets.sockets.size}. Disconnect reason: ${reason}`
      );
      const player = socket.data.player;
      if (!player) return;
      try {
        if (socket.data.activeQuery) {
          await socket.data.activeQuery;
        }
        player.isOnline = false;
        player.lastOnline = new Date();
        socket.data.activeQuery = player.save();
        await socket.data.activeQuery;
        socket.data.activeQuery = undefined;
        console.log(`Websocket client disconnected with id: ${socket.id}`);
      } catch (error) {
        console.log('Disconnect error ->', error.message);
      }
    });
  });
};
