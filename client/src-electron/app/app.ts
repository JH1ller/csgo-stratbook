import { protocol, app } from 'electron';
import { createProtocol } from 'vue-cli-plugin-electron-builder/lib';

import { windowManager } from './window-manager';
import { checkForUpdates } from './auto-updater';

import { registerCommonHandler } from './ipc-handlers/common-handler';
import { registerStorageHandlers } from './ipc-handlers/storage-handler';

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([
  {
    scheme: 'app',
    privileges: {
      secure: true,
      standard: true,
    },
  },
]);

class Application {
  public initialize() {
    app.allowRendererProcessReuse = true;

    // Prevent multiple instances
    const firstInstance = app.requestSingleInstanceLock();
    if (!firstInstance) {
      app.quit();
    }

    this.registerElectronHandlers();
    registerCommonHandler();
    registerStorageHandlers();
  }

  private registerElectronHandlers() {
    app.on('ready', async () => {
      createProtocol('app');

      try {
        const result = await checkForUpdates();
        if (result) {
          console.log(result);
        }
      } catch (error) {
        console.log(error);
      }

      await windowManager.showMainWindow();
    });

    app.on('second-instance', async () => {
      await windowManager.showMainWindow();
    });

    app.on('window-all-closed', () => {
      // On macOS it is common for applications and their menu bar
      // to stay active until the user quits explicitly with Cmd + Q
      if (process.platform !== 'darwin') {
        app.quit();
      }
    });

    app.on('activate', async () => {
      // On macOS it's common to re-create a window in the app when the
      // dock icon is clicked and there are no other windows open.
      await windowManager.showMainWindow();
    });
  }
}

export const application = new Application();

// let gsiServer: GSIServer;

// ipcMain.on('start-game-mode', () => {
//   gsiServer = new GSIServer();
//   gsiServer.init();
// });

// ipcMain.on('exit-game-mode', () => {
//   gsiServer?.stopServer();
// });
