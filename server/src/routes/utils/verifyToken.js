const jwt = require('jsonwebtoken');

const verifyAuth = (req, res, next) => {
  const token = req.header('Authorization');
  if (!token)
    return res.status(401).send({ error: 'Access denied: No token provided.' });

  try {
    const verifiedUserId = jwt.verify(token, process.env.TOKEN_SECRET);
    req.user = verifiedUserId;
    next();
  } catch (error) {
    res.status(400).send({ error: 'Access denied: Invalid token.' });
  }
};

module.exports.verifyAuth = verifyAuth;
