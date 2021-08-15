import { app, BrowserWindow } from 'electron';
import electronDebug from 'electron-debug';
import log from 'electron-log';
import process from 'process';
import installExtension, { VUEJS_DEVTOOLS } from 'electron-devtools-installer';

app
  .whenReady()
  .then(() => {
    // allow for a small delay for mainWindow to be created
    setTimeout(() => {
      // Install `electron-debug` with `devtron`
      electronDebug({ showDevTools: false });

      // Install vuejs devtools
      installExtension(VUEJS_DEVTOOLS)
        .then((name) => {
          console.log(`Added Extension: ${name}`);

          // get main window
          const win = BrowserWindow.getFocusedWindow();
          if (win) {
            win.webContents.on('did-frame-finish-load', () => {
              win.webContents.once('devtools-opened', () => {
                win.webContents.focus();
              });

              // open electron debug
              console.log('Opening dev tools');
              win.webContents.openDevTools();
            });
          }
        })
        .catch((err) => {
          log.error('An error occurred: ', err);
        });
    }, 250);
  })
  .catch((error) => {
    log.error(`failed to start app. ${error as string}`);
  });

process.on('unhandledRejection', (error) => {
  console.error(error);
});

import './electron-main.ts';
