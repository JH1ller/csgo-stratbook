import store from '@/store';
import { Log } from './logger';

export const writeToClipboard = async (value: string): Promise<void | true> => {
  if (!navigator.clipboard) {
    Log.warn('writeToClipboard', 'Clipboard not supported by browser');
    store.dispatch('app/showToast', { id: 'writeToClipboard', text: 'Clipboard not supported by browser' });
    return;
  }
  try {
    await navigator.clipboard?.writeText(value);
    Log.info('writeToClipboard', `Wrote value to clipboard: ${value}`);
    return true;
  } catch (error) {
    store.dispatch('app/showToast', { id: 'writeToClipboard', text: 'Clipboard not supported by browser' });
    if (error instanceof Error) {
      Log.error('writeToClipboard', `Writing to clipboard failed -> ${error.message}`);
    }
  }
};
