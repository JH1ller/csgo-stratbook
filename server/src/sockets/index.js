const { stepSchema: Step } = require('../models/step');
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

  Step.watch(null, { fullDocument: 'updateLookup' }).on('change', async (data) => {
    if (data.operationType !== 'delete') {
      try {
        const strat = await Strat.findById(data.fullDocument.strat);
        io.to(strat.team).emit('changed-step', { stratID: strat._id });
      } catch (error) {
        console.log(error);
      }
    }
  });

  Strat.watch(null, { fullDocument: 'updateLookup' }).on('change', async (data) => {
    if (data.operationType !== 'delete') {
      io.to(data.fullDocument.team).emit('changed-strat', { mapID: data.fullDocument.map });
    }
  });

  Player.watch(null, { fullDocument: 'updateLookup' }).on('change', async (data) => {
    if (data.operationType !== 'delete') {
      io.to(data.fullDocument.team).emit('changed-player', { playerID: data.fullDocument._id });
    }
  });
};

exports.initWS = initWS;
