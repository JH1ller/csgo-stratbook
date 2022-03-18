import { Server, Socket } from 'socket.io';
import { PlayerModel } from '@/models/player';
import jwt from 'jsonwebtoken';
import { registerBoardHandler } from './boardHandler';
import { registerWatchHandler } from './watchHandler';
import { Log } from '@/utils/logger';

const handleConnection = async (socket: Socket) => {
  const player = socket.data.player;
  (global as any).socket = socket;
  if (player) {
    socket.join(player.team.toString());

    try {
      if (socket.data.activeQuery) {
        await socket.data.activeQuery;
      }
      Log.debug('sockets::handleConnection', 'player.isOnline -> true');
      player.$locals.skipModified = true;
      player.isOnline = true;

      socket.data.activeQuery = player.save();
      await socket.data.activeQuery;
      socket.data.activeQuery = undefined;
    } catch (error) {
      Log.error(
        'sockets::handleConnection',
        `Error while saving isOnline status for player: ${player.name} (#${player._id})\n`,
        error.message
      );
    }
  }
};

export const initialize = (io: Server) => {
  registerWatchHandler(io);

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
        Log.error('sockets::auth-middleware', error.message);
        next(new Error('Error during socket authorization.'));
      }
    }
    next();
  });

  io.on('connection', (socket) => {
    Log.info('sockets::onconnection', `User '${socket.id}' connected. Active connections: ${io.sockets.sockets.size}`);
    registerBoardHandler(io, socket);

    handleConnection(socket);

    socket.on('disconnecting', async (reason) => {
      Log.info(
        'sockets::ondisconnect',
        `User '${socket.id}' disconnected. Active connections: ${io.sockets.sockets.size}. Disconnect reason: ${reason}`
      );
      const player = socket.data.player;
      if (!player) return;
      try {
        if (socket.data.activeQuery) {
          await socket.data.activeQuery;
        }

        Log.debug('sockets::ondisconnect', 'player.isOnline -> false');
        player.$locals.skipModified = true;
        player.isOnline = false;
        player.lastOnline = new Date();
        socket.data.activeQuery = player.save();
        await socket.data.activeQuery;
        socket.data.activeQuery = undefined;
      } catch (error) {
        Log.debug('sockets::ondisconnect', 'Failed to update online status', error.message);
      }
    });
  });
};
