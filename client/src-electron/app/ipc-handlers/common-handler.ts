import { ipcMain, shell, remote } from 'electron';
import { autoUpdater } from 'electron-updater';

export function registerCommonHandler() {
  ipcMain.on('open-external-link', (_event, url: string) => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const _ = new URL(url);
    } catch (ignored) {
      // invalid url
      return;
    }

    shell.openExternal(url);
  });

  ipcMain.on('open-external-server-link', (_event, ip, password) => {
    const currentWindow = remote.getCurrentWindow();
    currentWindow.loadURL(`steam://connect/${ip}/${password}`);
  });

  ipcMain.on('install-restart-app', () => {
    autoUpdater.quitAndInstall();
  });
}
