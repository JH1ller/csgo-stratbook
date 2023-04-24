import Store from 'electron-store';

export const appConfig = new Store({
  name: 'app',
  clearInvalidConfig: true,
});
