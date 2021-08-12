import { ipcMain } from 'electron';

import { appConfig } from 'src-electron/config';

export function registerStorageHandlers() {
  ipcMain.handle('config-get-value', (_event, key: string) => {
    return appConfig.get(key);
  });

  ipcMain.on('config-set-value', (_event, key: string, value: unknown) => {
    appConfig.set(key, value);
  });

  ipcMain.on('config-remove-key', (_event, key: string) => {
    appConfig.delete(key);
  });

  ipcMain.on('config-clear', () => {
    appConfig.clear();
  });
}
