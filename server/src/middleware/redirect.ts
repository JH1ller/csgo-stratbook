import { RequestHandler } from 'express';

export const secureRedirect: RequestHandler = (request, res, next) => {
  if (request.secure) {
    next();
  } else {
    res.redirect(301, 'https://' + request.headers.host + request.url);
  }
};

export const hostRedirect: RequestHandler = (request, res, next) => {
  const host = request.headers.host;
  // shouldn't happen, but still check to prevent DOS
  if (!host) return next();

  if (host === 'map.stratbook.pro') {
    return res.redirect('https://stratbook.pro/map');
  }

  if (host.startsWith('www.')) {
    return res.redirect(301, 'https://stratbook.pro');
  }

  const redirectTlds = ['.live', '.app'];

  const matchingTld = redirectTlds.find((tld) => request.headers.host?.endsWith(tld));
  if (!matchingTld) return next();

  const [hostWithoutTld] = host.split(matchingTld);

  const targetUrl = 'https://' + hostWithoutTld + '.pro' + request.url;

  return res.redirect(301, targetUrl);
};
