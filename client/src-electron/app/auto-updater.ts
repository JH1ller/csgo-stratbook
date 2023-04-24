import { BrowserWindow } from 'electron';
import log from 'electron-log';
import { autoUpdater } from 'electron-updater';

import { windowManager } from 'src-electron/app/window-manager';

let loaderWin: BrowserWindow;

autoUpdater.logger = log;
autoUpdater.autoDownload = true;

autoUpdater.on('update-available', async (_ev, info) => {
  log.debug('Update available:');
  log.debug(info);

  loaderWin = await windowManager.createLoaderWindow();
});

autoUpdater.on('error', (_ev, error) => {
  log.debug('Error in auto-updater:');
  log.debug(error);
});

autoUpdater.on('download-progress', ({ percent }: { percent: number }) => {
  log.debug('Download progress...');

  loaderWin?.webContents.send('update-progress', percent);
});

autoUpdater.on('update-not-available', () => {
  windowManager.showMainWindow();
});

autoUpdater.on('update-downloaded', (_ev, info) => {
  log.debug('Update downloaded:');
  log.debug(info);

  const mainWindow = windowManager.getMainWindow();
  if (!mainWindow) {
    autoUpdater.quitAndInstall();
  } else {
    mainWindow.webContents.send('update-downloaded', info);
  }
});

export function checkForUpdates() {
  return autoUpdater.checkForUpdatesAndNotify();
}
