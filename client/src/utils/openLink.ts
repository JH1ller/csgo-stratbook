export function openLink(url: string) {
  if (window.desktopMode) {
    window.ipcService.openExternalLink(url);
  } else {
    window.open(url, '_blank');
  }
};
