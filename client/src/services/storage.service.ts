import { isDesktop } from '@/utils/isDesktop';
import { Log } from '@/utils/logger';
import ElectronStore from 'electron-store';

export default class StorageService {
  private static instance: StorageService;

  private useNativeStore: boolean;
  private store: ElectronStore | undefined;

  private constructor() {
    this.useNativeStore = (window.desktopMode ?? isDesktop()) && process.env.NODE_ENV === 'production';
    if (this.useNativeStore) {
      const ElectronStore = require('electron-store');
      this.store = new ElectronStore();
    }
  }

  static getInstance(): StorageService {
    if (!StorageService.instance) {
      StorageService.instance = new StorageService();
    }
    return StorageService.instance;
  }

  get<T = any>(key: string): T | undefined | null {
    let value = this.useNativeStore ? this.store?.get(key) : localStorage.getItem(key);
    if (value == null) {
      Log.warn(`StorageService (${this.useNativeStore ? 'native' : 'browser'})`, `No value found for '${key}'.`);
    } else if (!this.useNativeStore) {
      try {
        const parsed = JSON.parse(value as string);
        value = parsed;
      } catch (error) {
        //
      }
    }

    return value as T | undefined | null;
  }

  set(key: string, value: unknown): void {
    try {
      if (this.useNativeStore) {
        this.store?.set(key, value);
      } else {
        localStorage.setItem(key, typeof value === 'string' ? value : JSON.stringify(value));
      }
      Log.info(`StorageService (${this.useNativeStore ? 'native' : 'browser'})`, `Saved value to key '${key}':`, value);
    } catch (error) {
      Log.error(`StorageService (${this.useNativeStore ? 'native' : 'browser'})`, error);
    }
  }

  remove(key: string): void {
    if (this.useNativeStore) {
      this.store?.delete(key);
    } else {
      localStorage.removeItem(key);
    }
    Log.info(`StorageService (${this.useNativeStore ? 'native' : 'browser'})`, `Removed value for '${key}'.`);
  }

  clear(): void {
    if (this.useNativeStore) {
      this.store?.clear();
    } else {
      localStorage.clear();
    }
    Log.info(`StorageService (${this.useNativeStore ? 'native' : 'browser'})`, 'Store cleared.');
  }
}
