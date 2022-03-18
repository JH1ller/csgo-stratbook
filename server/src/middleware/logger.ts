import { Log } from '@/utils/logger';
import { RequestHandler } from 'express';

const truncate = (input: string, length: number) =>
  input.length > length ? `${input.substring(0, length)}...` : input;

export const logger: RequestHandler = (req, _res, next) => {
  try {
    const bodyCopy = { ...req.body };
    delete bodyCopy.password;
    Log.info(
      `http::${req.method.toLowerCase()}->${req.url}`,
      ...Object.entries(bodyCopy).map(
        ([key, value], index) => `${index !== 0 ? '| ' : ' '}${key}: ${truncate(value as string, 50)}`
      )
    );
  } catch (error) {}
  next();
};
