import { Server, Socket } from 'socket.io';
import { PlayerModel } from '@/models/player';
import { StratModel } from '@/models/strat';
import { TeamModel } from '@/models/team';
import { UtilityModel } from '@/models/utility';

export const registerWatchHandler = (io: Server) => {
  StratModel.watch(undefined, { fullDocument: 'updateLookup' }).on('change', async (data) => {
    if (data.operationType === 'delete') return;
    console.log(data.operationType, data.fullDocument.team.toString());
    switch (data.operationType) {
      case 'insert':
        io.to(data.fullDocument.team.toString()).emit('created-strat', { strat: data.fullDocument });
        break;
      case 'update':
        data.updateDescription?.updatedFields.deleted
          ? io.to(data.fullDocument.team.toString()).emit('deleted-strat', { stratID: data.fullDocument._id })
          : io.to(data.fullDocument.team.toString()).emit('updated-strat', { strat: data.fullDocument });
        break;
    }
  });

  UtilityModel.watch(undefined, { fullDocument: 'updateLookup' }).on('change', async (data) => {
    if (data.operationType === 'delete') return;

    switch (data.operationType) {
      case 'insert':
        io.to(data.fullDocument.team.toString()).emit('created-utility', { utility: data.fullDocument });
        break;
      case 'update':
        data.updateDescription?.updatedFields.deleted
          ? io.to(data.fullDocument.team.toString()).emit('deleted-utility', { utilityID: data.fullDocument._id })
          : io.to(data.fullDocument.team.toString()).emit('updated-utility', { utility: data.fullDocument });
        break;
    }
  });

  TeamModel.watch(undefined, { fullDocument: 'updateLookup' }).on('change', async (data) => {
    if (data.operationType === 'delete') return;

    switch (
      data.operationType // keep switch statement in case "insert" is handled here later
    ) {
      case 'update':
        data.updateDescription?.updatedFields.deleted
          ? io.to(data.fullDocument._id.toString()).emit('deleted-team')
          : io.to(data.fullDocument._id.toString()).emit('updated-team', { team: data.fullDocument });
        break;
    }
  });

  PlayerModel.watch(undefined, { fullDocument: 'updateLookup' }).on('change', async (data) => {
    if (data.operationType === 'delete') return;
    switch (
      data.operationType // keep switch statement in case "insert" is handled here later
    ) {
      case 'update':
        console.log('updated-player', data.updateDescription?.updatedFields);
        data.updateDescription?.updatedFields.deleted
          ? io.to(data.fullDocument.team.toString()).emit('deleted-player', { playerID: data.fullDocument._id })
          : io.to(data.fullDocument.team.toString()).emit('updated-player', {
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
