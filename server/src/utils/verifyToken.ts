import { RequestHandler } from 'express';
import jwt from 'jsonwebtoken';

import { PlayerModel } from '@/models/player';

export const verifyAuth: RequestHandler = async (request, res, next) => {
  const token = request.header('Authorization');
  if (!token) return res.status(401).send({ error: 'Access denied: No token provided.' });

  try {
    const verifiedUserId = jwt.verify(token, process.env.TOKEN_SECRET!);
    const player = await PlayerModel.findById(verifiedUserId);
    if (!player) {
      return res.status(404).json({ error: 'Cannot find player associated with that access token.' });
    }
    res.locals.player = player;
    next();
  } catch {
    return res.status(401).send({ error: 'Access denied: Invalid token.' });
  }
};

export const verifyAuthOptional: RequestHandler = async (request, res, next) => {
  const token = request.header('Authorization');
  if (!token) {
    return next();
  }
  try {
    const verifiedUserId = jwt.verify(token, process.env.TOKEN_SECRET!);
    const player = await PlayerModel.findById(verifiedUserId);
    if (!player) {
      return res.status(404).json({ error: 'Cannot find player associated with that access token.' });
    }
    res.locals.player = player;
    return next();
  } catch {
    return res.status(401).send({ error: 'Access denied: Invalid token.' });
  }
};
