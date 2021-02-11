import { isDesktop } from '@/utils/isDesktop';
import { Log } from '@/utils/logger';
import ElectronStore from 'electron-store';

export default class StorageService {
  private static instance: StorageService;

  private _isDesktop: boolean;
  // * untyped because we can't import type from electron-store when in browser context.
  // * accessed through getter to get typing back
  private _store: any;

  private constructor() {
    this._isDesktop = window.desktopMode ?? isDesktop();
    if (this._isDesktop) {
      const ElectronStore = require('electron-store');
      this._store = new ElectronStore();
    }
  }

  static getInstance(): StorageService {
    if (!StorageService.instance) {
      StorageService.instance = new StorageService();
    }
    return StorageService.instance;
  }

  private get store(): ElectronStore {
    return this._store as ElectronStore;
  }

  get<T = any>(key: string): T | undefined | null {
    let value = this._isDesktop ? this.store.get(key) : localStorage.getItem(key);
    if (value == null) {
      Log.warn('StorageService', `No value found for '${key}'.`);
    } else if (!this._isDesktop) {
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
      if (this._isDesktop) {
        this.store.set(key, value);
      } else {
        localStorage.setItem(key, typeof value === 'string' ? value : JSON.stringify(value));
      }
      Log.info('StorageService', `Saved value to key '${key}'`, value);
    } catch (error) {
      Log.error('StorageService', error);
    }
  }

  remove(key: string): void {
    if (this._isDesktop) {
      this.store.delete(key);
    } else {
      localStorage.removeItem(key);
    }
  }

  clear(): void {
    if (this._isDesktop) {
      this.store.clear();
    } else {
      localStorage.clear();
    }
  }
}
