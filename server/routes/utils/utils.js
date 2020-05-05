const Map = require('../../models/map');
const Strat = require('../../models/strat');
const Player = require('../../models/player');
const Step = require('../../models/step');

async function getStrat(req, res, next) {
    let strat;
    try {
        strat = await Strat.findById(req.params.strat_id)
        if (!strat) {
            return res.status(404).json({ message: 'Cannot find strat' });
        }
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }

    res.strat = strat;
    next();
}

async function getMap(req, res, next) {
    let map;
    try {
        map = await Map.findById(req.params.map_id)
        if (!map) {
            return res.status(404).json({ message: 'Cannot find map' });
        }
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }

    res.map = map;
    next();
}

async function getPlayer(req, res, next) {
    let player;
    try {
        player = await Player.findById(req.params.player_id)
        if (!player) {
            return res.status(404).json({ message: 'Cannot find player' });
        }
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }

    res.player = player;
    next();
}

exports.getMap = getMap;
exports.getStrat = getStrat;
exports.getPlayer = getPlayer;