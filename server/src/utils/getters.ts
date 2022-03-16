import { StratModel } from '@/models/strat';
import { PlayerModel } from '@/models/player';
import { TeamModel } from '@/models/team';
import { UtilityModel } from '@/models/utility';
import { RequestHandler } from 'express';

export const getStrat: RequestHandler = async (req, res, next) => {
  const stratID = req.params.strat_id || req.body._id;
  try {
    const strat = await StratModel.findById(stratID);
    if (!strat) {
      return res.status(404).json({ error: 'Cannot find strat' });
    }
    res.locals.strat = strat;
    next();
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const getTeam: RequestHandler = async (req, res, next) => {
  const teamID = req.params.team_id || req.body._id;
  try {
    const team = await TeamModel.findById(teamID);
    if (!team) {
      return res.status(404).json({ error: 'Cannot find team' });
    }
    res.locals.team = team;
    next();
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const getUtility: RequestHandler = async (req, res, next) => {
  const utilityID = req.params.utility_id || req.body._id;
  try {
    const utility = await UtilityModel.findById(utilityID);
    if (!utility) {
      return res.status(404).json({ error: 'Cannot find utility' });
    }
    res.locals.utility = utility;
    next();
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const getPlayer: RequestHandler = async (req, res, next) => {
  if (res.locals.player) next();
  const playerID = req.params.player_id;
  try {
    const player = await PlayerModel.findById(playerID);
    if (!player) {
      return res.status(404).json({ error: 'Cannot find player' });
    }
    res.locals.player = player;
    next();
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
