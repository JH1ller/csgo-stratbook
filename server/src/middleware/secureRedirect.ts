import { RequestHandler } from 'express';

export const secureRedirect: RequestHandler = (req, res, next) => {
  if (req.secure) {
    next();
  } else {
    res.redirect(301, 'https://' + req.headers.host + req.url);
  }
};
