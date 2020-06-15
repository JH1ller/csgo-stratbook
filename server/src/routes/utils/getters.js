const Map = require('../../models/map');
const Strat = require('../../models/strat');
const Player = require('../../models/player');
const { stepSchema: Step } = require('../../models/step');
const Team = require('../../models/team');

async function getStrat(req, res, next) {
  let strat;
  try {
    strat = await Strat.findById(req.params.strat_id);
    if (!strat) {
      return res.status(404).json({ error: 'Cannot find strat' });
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }

  res.strat = strat;
  next();
}

async function getStep(req, res, next) {
  let step;
  try {
    step = await Step.findById(req.params.step_id);
    if (!step) {
      return res.status(404).json({ error: 'Cannot find step' });
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }

  res.step = step;
  next();
}

async function getMap(req, res, next) {
  let map;
  try {
    map = await Map.findById(req.params.map_id);
    if (!map) {
      return res.status(404).json({ error: 'Cannot find map' });
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }

  res.map = map;
  next();
}

async function getTeam(req, res, next) {
  let team;
  try {
    team = await Team.findById(req.params.team_id);
    if (!team) {
      return res.status(404).json({ error: 'Cannot find team' });
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }

  res.team = team;
  next();
}

async function getPlayer(req, res, next) {
  let player;
  try {
    player = req.params.player_id
      ? await Player.findById(req.params.player_id)
      : await Player.findById(req.user._id);

    if (!player) {
      return res.status(404).json({ error: 'Cannot find player' });
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }

  res.player = player;
  next();
}

exports.getMap = getMap;
exports.getStrat = getStrat;
exports.getStep = getStep;
exports.getPlayer = getPlayer;
exports.getTeam = getTeam;
