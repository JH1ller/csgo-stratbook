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
      clients.set(socket.id, data.playerID);
      const player = await Player.findById(data.playerID);
      player.isOnline = true;
      player.save();
      io.to(data.teamID).emit('room-joined', { roomID: data.teamID });
    });

    socket.on('disconnecting', async (data) => {
      const player = await Player.findById(clients.get(socket.id));
      player.isOnline = false;
      player.lastOnline = Date.now();
      player.save();
      clients.delete(socket.id);
    });
  });

  Step.watch(null, { fullDocument: 'updateLookup' }).on('change', async (data) => {
    if (data.operationType !== 'delete') {
      const strat = await Strat.findById(data.fullDocument.strat);
      io.to(strat.team).emit('changed-step', { stratID: strat._id });
    }
  });

  Strat.watch(null, { fullDocument: 'updateLookup' }).on('change', async (data) => {
    if (data.operationType !== 'delete') {
      io.to(data.fullDocument.team).emit('changed-strat', { mapID: data.fullDocument.map });
    }
  });
};

exports.initWS = initWS;
