const Strat = require('../models/strat');
const Player = require('../models/player');
const Team = require('../models/team');

const clients = new Map();

const initWS = (io) => {
  io.on('connection', (socket) => {
    console.log('Websocket client connected with id: ', socket.conn.id);

    socket.on('join-room', async (data) => {
      socket.join(data.teamID);
      clients.set(socket.id, { playerID: data.playerID, teamID: data.teamID });

      try {
        const player = await Player.findById(data.playerID);
        player.isOnline = true;
        player.save();
      } catch (error) {
        console.log(error);
      }

      io.to(data.teamID).emit('room-joined', { roomID: data.teamID });
    });

    socket.on('disconnecting', async (data) => {
      try {
        const player = await Player.findById(clients.get(socket.id).playerID);
        player.isOnline = false;
        player.lastOnline = Date.now();
        player.save();
        clients.delete(socket.id);
      } catch (error) {
        console.log(error);
      }
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
          : io.to(data.fullDocument.team).emit('updated-player', 
          { 
            player: {
              _id: data.fullDocument._id,
              name: data.fullDocument.name,
              role: data.fullDocument.role,
              avatar: data.fullDocument.avatar,
              team: data.fullDocument.team,
              createdAt: data.fullDocument.createdAt,
              isOnline: data.fullDocument.isOnline,
              lastOnline: data.fullDocument.lastOnline
            }
          });
        break;
    }
  });
};

exports.initWS = initWS;
