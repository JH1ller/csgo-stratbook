import colors from 'colors';
import { RequestHandler } from 'express';

const truncate = (input: string, length: number) =>
  input.length > length ? `${input.substring(0, length)}...` : input;

export const logger: RequestHandler = (req, _res, next) => {
  try {
    const bodyCopy = { ...req.body };
    delete bodyCopy.password;
    console.log(
      `HTTP ${req.method} ${req.url}`.green,
      ...Object.entries(bodyCopy).map(
        ([key, value], index) => `${index !== 0 ? '| ' : ' '}${key}: ${truncate(value as string, 50)}`.blue
      )
    );
  } catch (error) {}
  next();
};
