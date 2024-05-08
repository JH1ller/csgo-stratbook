import { Logger } from '../logger';

const logger = new Logger('ImageProcessError');

export default class ImageProcessError extends Error {
  constructor(message: string) {
    super(message);
    logger.error(message);
  }
}
