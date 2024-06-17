import { RequestHandler } from 'express';

import { PlayerModel } from '@/models/player';
import { StratModel } from '@/models/strat';
import { StratDocument } from '@/models/strat';
import { TeamModel } from '@/models/team';
import { UtilityModel } from '@/models/utility';

import { getErrorMessage } from './errors/parseError';

export const getStrats: RequestHandler = async (request, res, next) => {
  const stratIDs = request.body.map((payload: Partial<StratDocument>) => payload._id);
  try {
    const strats = await StratModel.find().where('_id').in(stratIDs).exec();
    if (strats.length === 0) {
      return res.status(404).json({ error: 'Cannot find any strats' });
    }
    res.locals.strats = strats;
    next();
  } catch (error) {
    return res.status(500).json({ error: getErrorMessage(error) });
  }
};

export const getStrat: RequestHandler = async (request, res, next) => {
  const stratID = request.params.strat_id || request.body._id;
  try {
    const strat = await StratModel.findById(stratID);
    if (!strat) {
      return res.status(404).json({ error: 'Cannot find strat' });
    }
    res.locals.strat = strat;
    next();
  } catch (error) {
    return res.status(500).json({ error: getErrorMessage(error) });
  }
};

export const getTeam: RequestHandler = async (request, res, next) => {
  const teamID = request.params.team_id || request.body._id;
  try {
    const team = await TeamModel.findById(teamID);
    if (!team) {
      return res.status(404).json({ error: 'Cannot find team' });
    }
    res.locals.team = team;
    next();
  } catch (error) {
    return res.status(500).json({ error: getErrorMessage(error) });
  }
};

export const getUtility: RequestHandler = async (request, res, next) => {
  const utilityID = request.params.utility_id || request.body._id;
  try {
    const utility = await UtilityModel.findById(utilityID);
    if (!utility) {
      return res.status(404).json({ error: 'Cannot find utility' });
    }
    res.locals.utility = utility;
    next();
  } catch (error) {
    return res.status(500).json({ error: getErrorMessage(error) });
  }
};

export const getPlayer: RequestHandler = async (request, res, next) => {
  if (res.locals.player) next();
  const playerID = request.params.player_id;
  try {
    const player = await PlayerModel.findById(playerID);
    if (!player) {
      return res.status(404).json({ error: 'Cannot find player' });
    }
    res.locals.player = player;
    next();
  } catch (error) {
    return res.status(500).json({ error: getErrorMessage(error) });
  }
};
