import { Log } from './logger';

export const handleUnknownError = (error: unknown) => {
  if (error instanceof Error) {
    Log.error('unknown-error', error.message);
  }
};
