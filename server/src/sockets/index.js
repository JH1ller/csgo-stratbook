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
    if (data.operationType === 'delete') return;

    try {
      const strat = await Strat.findById(data.fullDocument.strat);
      switch (data.operationType) {
        case 'insert':
          io.to(strat.team).emit('created-step', { step: data.fullDocument });
          break;
        case 'update':
          data.updateDescription.updatedFields.deleted
            ? io.to(strat.team).emit('deleted-step', { stepID: data.fullDocument._id })
            : io.to(strat.team).emit('updated-step', { step: data.fullDocument });
          break;
      }
    } catch (error) {
      console.log(error);
    }
  });

  Strat.watch(null, { fullDocument: 'updateLookup' }).on('change', async (data) => {
    if (data.operationType === 'delete') return;

    console.log(data); // TODO: remove

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
          : io.to(data.fullDocument.team).emit('updated-player', { player: data.fullDocument });
        break;
    }
  });
};

exports.initWS = initWS;
