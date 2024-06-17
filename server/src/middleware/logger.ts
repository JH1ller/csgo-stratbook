import { gray } from 'colors';
import { RequestHandler } from 'express';

import { Logger } from '@/utils/logger';

const truncate = (input: string, length: number) =>
  input.length > length ? `${input.slice(0, Math.max(0, length))}...` : input;

export const loggerMiddleware: RequestHandler = (request, _res, next) => {
  try {
    const bodyCopy = { ...request.body };
    delete bodyCopy.password;
    Logger.log(
      gray,
      `http::${request.method.toLowerCase()}->${request.url}`,
      ...Object.entries(bodyCopy).map(
        ([key, value], index) => `${index === 0 ? ' ' : '| '}${key}: ${truncate(value as string, 50)}`,
      ),
    );
  } catch {
    //
  }
  next();
};
