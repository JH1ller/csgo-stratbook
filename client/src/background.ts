'use strict';
import { app, protocol, BrowserWindow, ipcMain, shell, screen, dialog } from 'electron';
import {
  createProtocol,
  /* installVueDevtools */
} from 'vue-cli-plugin-electron-builder/lib';
import { autoUpdater } from 'electron-updater';
import ElectronLog from 'electron-log';
//import debug from 'electron-debug';
import ElectronStore from 'electron-store';
import path from 'path';
// import GSIServer from './main_process/gsi-server';

const isDevelopment = process.env.NODE_ENV !== 'production';

const store = new ElectronStore<{
  'window-config'?: Electron.Rectangle & { maximized: boolean };
}>();
// const isDebug = !!store.get('debug') || false;

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win: BrowserWindow | null;

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([{ scheme: 'app', privileges: { secure: true, standard: true } }]);

if (process.defaultApp) {
  if (process.argv.length >= 2) {
    app.setAsDefaultProtocolClient('stratbook', process.execPath, [path.resolve(process.argv[1])]);
  }
} else {
  app.setAsDefaultProtocolClient('stratbook');
}

const gotTheLock = app.requestSingleInstanceLock();

if (gotTheLock) {
  app.on('second-instance', (_, commandLine) => {
    const rx = /^stratbook:\/\/([a-z]+)(?:\/(.+))?\//;
    const match = commandLine.at(-1)?.match(rx);
    if (!match) return;
    const [, action, token] = match;
    console.log('electron-deeplink', action, token);
    win?.webContents.send('steam-auth', { action, token });
  });
} else {
  app.quit();
}

const getWindowBounds = (): Electron.BrowserWindowConstructorOptions => {
  const primaryDisplay = screen.getPrimaryDisplay();
  const { width: displayWidth, height: displayHeight } = primaryDisplay.workArea;

  const storedBounds = store.get('window-config');

  const computedWidth = storedBounds?.width ? Math.min(storedBounds.width, displayWidth) : 1280;
  const computedHeight = storedBounds?.height ? Math.min(storedBounds.height, displayHeight) : 720;

  return {
    width: computedWidth,
    height: computedHeight,
    minWidth: 360,
    minHeight: 590,
  };
};

const init = async () => {
  createProtocol('app');

  autoUpdater.logger = ElectronLog;

  autoUpdater.autoDownload = true;

  autoUpdater.checkForUpdatesAndNotify().catch(() => showMainWindow());

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
      contextIsolation: false,
    },
    center: true,
    ...options,
  });

  if (process.env.WEBPACK_DEV_SERVER_URL) {
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

  if (store.get('window-config')?.maximized) {
    win.maximize();
  }

  win.on('close', () => {
    const { width, height } = win!.getBounds();
    // for some reason getBounds() doesn't report the correct window bounds (on Win11 at least), so they have to be adjusted.
    store.set('window-config', {
      width: width - 16,
      height: height - 16,
      maximized: win?.isMaximized(),
    });
  });

  win.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: 'deny' };
  });
};

const showLoader = () => {
  win = createWindow({ width: 300, height: 150, frame: false }, 'loader', 'loader.html');
};

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
    process.on('message', (data) => {
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
