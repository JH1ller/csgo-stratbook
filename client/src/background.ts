'use strict';
import { app, protocol, BrowserWindow, ipcMain } from 'electron';
import os from 'os';
import path from 'path';
import {
  createProtocol,
  /* installVueDevtools */
} from 'vue-cli-plugin-electron-builder/lib';
import { autoUpdater, UpdateInfo } from 'electron-updater';
import ElectronLog from 'electron-log';
import debug from 'electron-debug';
import ElectronStore from 'electron-store';

const isDevelopment = process.env.NODE_ENV !== 'production';

const store = new ElectronStore();
const isDebug = !!store.get('debug') || false;

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win: BrowserWindow | null;

debug({ isEnabled: isDebug || isDevelopment });

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([{ scheme: 'app', privileges: { secure: true, standard: true } }]);

function createWindow() {
  if (isDevelopment && !process.env.IS_TEST) {
    console.log('installing Vue dev tools extension');
    try {
      BrowserWindow.addDevToolsExtension(
        path.join(
          os.homedir(),
          '/AppData/Local/Google/Chrome/User Data/Default/Extensions/nhdogjmejiglipccpnnnanhbledajbpd/5.3.4_0'
        )
      );
    } catch (error) {
      console.log(error.message);
    }
  }
  // Create the browser window.
  win = new BrowserWindow({
    width: 1280,
    height: 720,
    minHeight: 670,
    minWidth: 941,
    title: 'Stratbook',
    useContentSize: true,
    webPreferences: {
      nodeIntegration: true,
    },
  });

  if (process.env.WEBPACK_DEV_SERVER_URL) {
    //win.maximize();
    // Load the url of the dev server if in development mode
    win.loadURL(process.env.WEBPACK_DEV_SERVER_URL as string);
    if (!process.env.IS_TEST) {
      win.webContents.openDevTools();
    }
  } else {
    //win.setFullScreen(true);
    win.setMenu(null);
    createProtocol('app');
    // Load the index.html when not in development
    win.loadURL('app://./index.html');
  }

  win.on('closed', () => {
    win = null;
  });

  autoUpdater.logger = ElectronLog;

  autoUpdater.autoDownload = true;

  autoUpdater.on('update-downloaded', (info: UpdateInfo) => {
    win!.webContents.send('update-downloaded', info.version);
  });
}

ipcMain.on('app-ready', () => {
  autoUpdater.checkForUpdatesAndNotify();
});

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
    createWindow();
  }
});

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', async () => {
  createWindow();
});

ipcMain.on('restart-app', () => {
  autoUpdater.quitAndInstall();
});
// app.on('open-url', function(event, data) {
//   event.preventDefault();
//   logEverywhere(data);
// });

// app.setAsDefaultProtocolClient('csgostratbook');

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
