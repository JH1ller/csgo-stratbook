const Strat = require('../models/strat');
const Utility = require('../models/utility');
const Player = require('../models/player');
const Team = require('../models/team');
const { nanoid } = require('nanoid');

const clients = new Map();

/**
 * boards object holding all boards in memory.
 * {
 *    [room_id]: {
 *      [client_id]: {
 *        position: {
 *          x,
 *          y
 *        }
 *      }
 *    }
 * }
 */
const boards = {};
global.boards = boards;

const initWS = (io) => {
  io.on('connection', (socket) => {
    //console.log('Websocket client connected with id: ', socket.conn.id);

    socket.on('join-room', async (data) => {
      socket.join(data.teamID);
      clients.set(socket.id, { playerID: data.playerID, teamID: data.teamID });

      try {
        const player = await Player.findById(data.playerID);
        player.isOnline = true;
        player.save();
      } catch (error) {
        console.error(`Could not find player with ID: ${data.playerID}`);
      }

      io.to(data.teamID).emit('room-joined', { roomID: data.teamID });
    });

    socket.on('join-draw-room', ({ targetRoomId }) => {
      if (targetRoomId && typeof targetRoomId !== 'string') return;
      const roomId = targetRoomId ?? nanoid(10);
      socket.join(roomId);
      console.log('Joined draw room, target id', roomId);

      boards[roomId] = boards[roomId] ?? {};
      boards[roomId][socket.id] = boards[roomId][socket.id] ?? { position: { x: 0, y: 0 } };

      io.to(socket.id).emit('draw-room-joined', { roomId, clientId: socket.id });
    });

    socket.on('pointer-position', ({ x, y }) => {
      //* First room is always the clientId, therefore we grab the second
      const room = Object.values(socket.rooms)[1];

      if (!boards[room]) return;
      boards[room][socket.id].position.x = x;
      boards[room][socket.id].position.y = y;

      io.to(room).emit('pointer-data', { ...boards[room][socket.id].position, id: socket.id });
    });

    socket.on('update-data', ({ images, lines, texts }) => {
      console.log('updatedata', images.length, lines.length, texts.length);
      //* First room is always the clientId, therefore we grab the second
      const room = Object.values(socket.rooms)[1];

      if (!boards[room]) return;
      boards[room].images = images;
      boards[room].lines = lines;
      boards[room].texts = texts;

      io.to(room).emit('data-updated', { images, lines, texts, id: socket.id });
    });

    socket.on('disconnecting', async () => {
      // try {
      //   const playerID = clients.get(socket.id).playerID;
      //   clients.delete(socket.id);
      //   const playerInClientList = [...clients].find(([_key, value]) => value.playerID === playerID);
      //   if (!playerInClientList) {
      //     const player = await Player.findById(playerID);
      //     player.isOnline = false;
      //     player.lastOnline = Date.now();
      //     player.save();
      //     console.log(`Websocket client disconnected with id: ${socket.id}`);
      //   }
      // } catch (error) {
      //   console.log(error);
      // }
    });
  });

  Strat.watch(null, { fullDocument: 'updateLookup' }).on('change', async (data) => {
    if (data.operationType === 'delete') return;

    switch (data.operationType) {
      case 'insert':
        io.to(data.fullDocument.team).emit('created-strat', { strat: data.fullDocument });
        break;
      case 'update':
        data.updateDescription.updatedFields.deleted
          ? io.to(data.fullDocument.team).emit('deleted-strat', { stratID: data.fullDocument._id })
          : io.to(data.fullDocument.team).emit('updated-strat', { strat: data.fullDocument });
        break;
    }
  });

  Utility.watch(null, { fullDocument: 'updateLookup' }).on('change', async (data) => {
    if (data.operationType === 'delete') return;

    switch (data.operationType) {
      case 'insert':
        io.to(data.fullDocument.team).emit('created-utility', { utility: data.fullDocument });
        break;
      case 'update':
        data.updateDescription.updatedFields.deleted
          ? io.to(data.fullDocument.team).emit('deleted-utility', { utilityID: data.fullDocument._id })
          : io.to(data.fullDocument.team).emit('updated-utility', { utility: data.fullDocument });
        break;
    }
  });

  Team.watch(null, { fullDocument: 'updateLookup' }).on('change', async (data) => {
    if (data.operationType === 'delete') return;

    switch (
      data.operationType // keep switch statement in case "insert" is handled here later
    ) {
      case 'update':
        data.updateDescription.updatedFields.deleted
          ? io.to(data.fullDocument._id).emit('deleted-team')
          : io.to(data.fullDocument._id).emit('updated-team', { team: data.fullDocument });
        break;
    }
  });

  Player.watch(null, { fullDocument: 'updateLookup' }).on('change', async (data) => {
    if (data.operationType === 'delete') return;

    switch (
      data.operationType // keep switch statement in case "insert" is handled here later
    ) {
      case 'update':
        data.updateDescription.updatedFields.deleted
          ? io.to(data.fullDocument.team).emit('deleted-player', { playerID: data.fullDocument._id })
          : io.to(data.fullDocument.team).emit('updated-player', {
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

exports.initWS = initWS;
