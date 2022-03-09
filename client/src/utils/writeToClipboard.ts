import { Log } from './logger';

export const writeToClipboard = async (value: string): Promise<void> => {
  if (!navigator.clipboard) {
    Log.warn('writeToClipboard', 'Clipboard not supported by browser');
    return;
  }
  try {
    await navigator.clipboard?.writeText(value);
    Log.info('writeToClipboard', `Wrote value to clipboard: ${value}`);
  } catch (error) {
    Log.error('writeToClipboard', `Writing to clipboard failed -> ${error.message}`);
  }
};
