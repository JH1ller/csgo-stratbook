import { Logger } from './logger';

const logger = new Logger('PANIC');

export const panic = (message: string): never => {
  return logger.error(message) as never;
};
