const jwt = require('jsonwebtoken');
const Player = require('../../models/player');

const verifyAuth = async (req, res, next) => {
  const token = req.header('Authorization');
  if (!token) return res.status(401).send({ error: 'Access denied: No token provided.' });

  try {
    const verifiedUserId = jwt.verify(token, process.env.TOKEN_SECRET);
    const player = await Player.findById(verifiedUserId);
    if (!player) {
      return res.status(404).json({ error: 'Cannot find player associated with that access token.' });
    }
    res.player = player;
    next();
  } catch (error) {
    res.status(401).send({ error: 'Access denied: Invalid token.' });
  }
};

module.exports.verifyAuth = verifyAuth;
