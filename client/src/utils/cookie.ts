export function getCookie(name: string) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts?.pop()?.split(';')?.shift();
}

export function setCookie(key: string, value: string) {
  document.cookie = `${key}=${value}; domain=${window.location.hostname}; max-age=31536000; path=/`;
}

export function removeCookie(key: string) {
  document.cookie = `${key}=; domain=${window.location.hostname}; max-age=0; path=/`;
}
