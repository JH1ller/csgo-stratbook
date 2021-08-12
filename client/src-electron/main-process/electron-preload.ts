console.log('Running preload script ...');

// eslint-disable-next-line @typescript-eslint/no-var-requires
import { contextBridge, ipcRenderer } from 'electron';

import { IpcService } from 'src/browser';

// With electron 12 we manually have to create glue code between the renderer and the ipc renderer.
// Therefore, we feed all glue apis into our 'ipcService' object which is later exposed
// under window.ipcService (Keep the APIs in sync with /src/browser.d.ts)
// see more: https://www.electronjs.org/docs/tutorial/context-isolation

const api: IpcService = {
  configGetValue: (key) => ipcRenderer.invoke('config-get-value', key),
  configSetValue: (key, value) => ipcRenderer.send('config-set-value', key, value),
  configRemoveKey: (key) => ipcRenderer.send('config-remove-key', key),
  configClear: () => ipcRenderer.send('config-clear'),

  openExternalLink: (url) => ipcRenderer.send('open-external-link', url),
  openExternalServerLink: (ip, password) => ipcRenderer.send('open-external-server-link', ip, password),

  installRestartApp: () => ipcRenderer.send('install-restart-app'),

  registerUpdateDownloadedHandler: (handler) => {
    ipcRenderer.addListener('update-downloaded', (_event, version) => {
      handler(version);
    });
  },

  registerUpdateProgressHandler: (handler) => {
    ipcRenderer.addListener('update-progress', (_event, progress) => {
      handler(progress);
    });
  },
};

contextBridge.exposeInMainWorld('ipcService', api);
