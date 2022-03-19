'use strict';
import { app, protocol, BrowserWindow, ipcMain, session, dialog } from 'electron';
import os from 'os';
import path from 'path';
import {
  createProtocol,
  /* installVueDevtools */
} from 'vue-cli-plugin-electron-builder/lib';
import { autoUpdater, UpdateInfo } from 'electron-updater';
import ElectronLog from 'electron-log';
//import debug from 'electron-debug';
import ElectronStore from 'electron-store';
// import GSIServer from './main_process/gsi-server';

const isDevelopment = process.env.NODE_ENV !== 'production';

const store = new ElectronStore();
// const isDebug = !!store.get('debug') || false;

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win: BrowserWindow | null;

// let gsiServer: GSIServer;

//debug({ isEnabled: isDebug || isDevelopment });

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([{ scheme: 'app', privileges: { secure: true, standard: true } }]);

const getWindowBounds = () => {
  const storedBounds = store.get('window-config') as Electron.Rectangle;

  return {
    width: storedBounds?.width ?? 1280,
    height: storedBounds?.height ?? 720,
    minWidth: 360,
    minHeight: 590,
    x: storedBounds?.x,
    y: storedBounds?.y,
  };
};

const init = async () => {
  createProtocol('app');

  autoUpdater.logger = ElectronLog;

  autoUpdater.autoDownload = true;

  autoUpdater.checkForUpdatesAndNotify().catch(err => showMainWindow());

  if (isDevelopment) {
    showMainWindow();
  }

  autoUpdater.on('update-available', () => {
    showLoader();
  });

  autoUpdater.on('download-progress', ({ percent }: { percent: number }) => {
    win?.webContents.send('progress', percent);
  });

  autoUpdater.on('update-not-available', () => {
    showMainWindow();
  });

  autoUpdater.on('update-downloaded', () => {
    autoUpdater.quitAndInstall();
  });
};

const createWindow = (options: Electron.BrowserWindowConstructorOptions, devPath: string, prodPath: string) => {
  const window = new BrowserWindow({
    title: 'Stratbook',
    useContentSize: true,
    webPreferences: {
      nodeIntegration: true,
    },
    ...options,
  });

  if (process.env.WEBPACK_DEV_SERVER_URL) {
    try {
      // * Attempt to load locally installed Vue Dev Tools extension
      session.defaultSession.loadExtension(
        path.join(
          os.homedir(),
          '/AppData/Local/Google/Chrome/User Data/Default/Extensions/nhdogjmejiglipccpnnnanhbledajbpd/5.3.4_0',
        ),
      );
    } catch (error) {
      console.log(error.message);
    }

    // Load the url of the dev server if in development mode
    window.loadURL(process.env.WEBPACK_DEV_SERVER_URL + devPath);
    if (!process.env.IS_TEST) window.webContents.openDevTools();
  } else {
    window.setMenu(null);
    // Load the index.html when not in development
    window.loadURL(`app://./${prodPath}`);
  }

  return window;
};

const showMainWindow = () => {
  win = createWindow(getWindowBounds(), '', 'index.html');

  win.on('closed', () => {
    win = null;
  });

  win.on('close', () => {
    store.set('window-config', win?.getBounds());
  });
};

const showLoader = () => {
  win = createWindow({ width: 300, height: 150, frame: false }, 'loader', 'loader.html');
};

app.allowRendererProcessReuse = true;
// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (win === null) {
    init();
  }
});

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', async () => {
  init();
});

// ipcMain.on('start-game-mode', () => {
//   gsiServer = new GSIServer();
//   gsiServer.init();
// });

// ipcMain.on('exit-game-mode', () => {
//   gsiServer?.stopServer();
// });

ipcMain.on('restart-app', () => {
  autoUpdater.quitAndInstall();
});

// process.on('unhandledRejection', (reason, promise) => {
//   console.log('Unhandled Rejection at:', promise, 'reason:', reason);
//   if (isDevelopment) {
//     dialog.showMessageBoxSync(win!, {
//       message: `Unhandled Rejection at: ${promise} reason: ${reason}`,
//       type: 'error',
//     });
//   }
// });

// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
  if (process.platform === 'win32') {
    process.on('message', data => {
      if (data === 'graceful-exit') {
        app.quit();
      }
    });
  } else {
    process.on('SIGTERM', () => {
      app.quit();
    });
  }
}
