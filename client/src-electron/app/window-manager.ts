import { ipcMain, BrowserWindow, Rectangle } from 'electron';
import path from 'path';

import { appConfig } from 'src-electron/config';

class WindowManager {
  private mainWindow?: BrowserWindow;

  constructor() {
    this.registerIpcEventHandler();
  }

  public getMainWindow() {
    if (!this.mainWindow) {
      return null;
    }

    return this.mainWindow;
  }

  public async toggleMainWindow() {
    const win = this.mainWindow;

    if (!win) {
      await this.showMainWindow();
    } else {
      if (win.isVisible() && !win.isMinimized()) {
        win.hide();
      } else {
        win.show();
      }
    }
  }

  public async showMainWindow(bounds?: Rectangle) {
    if (!this.mainWindow) {
      // Create main window, if it doesn't exist
      this.mainWindow = await this.createMainWindow();
    }

    if (bounds) {
      this.mainWindow.setBounds(bounds);
    }

    this.mainWindow.show();
  }

  public async createLoaderWindow() {
    const win = new BrowserWindow({
      width: 300,
      height: 150,

      useContentSize: true,
      frame: true,

      webPreferences: {
        nodeIntegration: true,
        nodeIntegrationInWorker: false,
        preload: path.join(__dirname, 'preload.js'),
      },
    });

    if (process.env.WEBPACK_DEV_SERVER_URL) {
      await win.loadURL(`${process.env.WEBPACK_DEV_SERVER_URL}/loader`);
    } else {
      await win.loadURL('app://./loader.html');
    }

    return win;
  }

  /**
   * Creates a new main window
   * @returns BrowserWindow instance
   */
  private async createMainWindow() {
    const storedBounds = (appConfig.get('window-config') as Rectangle) || {
      width: null,
      height: null,
    };

    const win = new BrowserWindow({
      width: storedBounds.width || 1280,
      height: storedBounds.height || 720,
      x: storedBounds.x,
      y: storedBounds.y,

      minWidth: 360,
      minHeight: 590,

      useContentSize: true,
      frame: true,

      webPreferences: {
        nodeIntegration: true,
        nodeIntegrationInWorker: false,
        preload: path.join(__dirname, 'preload.js'),
      },
    });

    win.on('close', () => {
      appConfig.set('window-config', win.getBounds());

      // close all detached child windows
      for (const window of BrowserWindow.getAllWindows()) {
        if (window !== win) {
          window.close();
        }
      }

      console.log('emit: close - done');
    });

    if (process.env.WEBPACK_DEV_SERVER_URL) {
      await win.loadURL(process.env.WEBPACK_DEV_SERVER_URL);
    } else {
      // Remove menu from window
      win.removeMenu();
      await win.loadURL('app://./index.html');
    }

    return win;
  }

  private registerIpcEventHandler() {
    ipcMain.on('minimize-window', (event) => {
      const win = BrowserWindow.fromWebContents(event.sender);
      win?.minimize();
    });

    ipcMain.on('maximize-window', (event) => {
      const win = BrowserWindow.fromWebContents(event.sender);
      if (!win) {
        return;
      }

      if (win.isMaximized()) {
        win.unmaximize();
      } else {
        win.maximize();
      }
    });

    ipcMain.on('hide-window', (event) => {
      const win = BrowserWindow.fromWebContents(event.sender);
      win?.hide();
    });

    ipcMain.on('close-window', (event) => {
      const win = BrowserWindow.fromWebContents(event.sender);
      win?.close();
    });
  }
}

export const windowManager = new WindowManager();
