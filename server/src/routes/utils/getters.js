const Map = require('../../models/map');
const Strat = require('../../models/strat');
const Player = require('../../models/player');
const Team = require('../../models/team');

async function getStrat(req, res, next) {
  const stratID = req.params.strat_id || req.body._id;
  try {
    const strat = await Strat.findById(stratID);
    if (!strat) {
      return res.status(404).json({ error: 'Cannot find strat' });
    }
    res.strat = strat;
    next();
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

async function getMap(req, res, next) {
  const mapID = req.params.map_id || req.body._id;
  try {
    const map = await Map.findById(mapID);
    if (!map) {
      return res.status(404).json({ error: 'Cannot find map' });
    }
    res.map = map;
    next();
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

async function getTeam(req, res, next) {
  const teamID = req.params.team_id || req.body._id;
  try {
    const team = await Team.findById(teamID);
    if (!team) {
      return res.status(404).json({ error: 'Cannot find team' });
    }
    res.team = team;
    next();
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

async function getPlayer(req, res, next) {
  if (res.player) next();
  const playerID = req.params.player_id;
  try {
    const player = await Player.findById(playerID);
    if (!player) {
      return res.status(404).json({ error: 'Cannot find player' });
    }
    res.player = player;
    next();
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

exports.getMap = getMap;
exports.getStrat = getStrat;
exports.getPlayer = getPlayer;
exports.getTeam = getTeam;
