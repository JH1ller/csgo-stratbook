export const openLink = (url: string): void => {
  if (window.desktopMode) {
    const { shell } = require('electron').remote;
    shell.openExternal(url);
  } else {
    window.open(url, '_blank');
  }
};
