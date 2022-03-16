import { Server } from 'socket.io';
import { PlayerModel } from '../models/player';
import jwt from 'jsonwebtoken';
import { registerBoardHandler } from './boardHandler';
import { registerWatchHandler } from './watchHandler';

export const initialize = (io: Server) => {
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
    console.log('new connection', socket.id);
    registerBoardHandler(io, socket);
    registerWatchHandler(io, socket);

    socket.on('join-room', async () => {
      console.log('join room called ', socket.id, [...socket.rooms]);
      const player = socket.data.player;
      if (!player) {
        console.warn('Tried joining room without auth.');
        return;
      }
      socket.join(player.team.toString());

      try {
        player.isOnline = true;
        await player.save();
      } catch (error) {
        console.error(
          `Error while saving isOnline status for player: ${player.name} (#${player._id})\n`,
          error.message
        );
      }

      io.to(player.team).emit('room-joined');
    });

    socket.on('disconnecting', async () => {
      const player = socket.data.player;
      if (!player) return;
      //const player = await PlayerModel.findById(client.playerID);
      try {
        player.isOnline = false;
        player.lastOnline = new Date();
        await player.save();
        console.log(`Websocket client disconnected with id: ${socket.id}`);
      } catch (error) {
        console.log('Disconnect error ->', error.message);
      }
    });
  });
};
