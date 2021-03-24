import express, { Application } from 'express';
import { app as desktopApp } from 'electron';
import path from 'path';
import { copyFileSync, PathLike, existsSync } from 'fs';
import { Server } from 'http';
import Registry from 'winreg';
import log from 'electron-log';

export interface GSIServerConfig {
  port?: number;
  fileName?: string;
}

export default class GSIServer {
  private _port: number;
  private _cfgFileName: string;
  private _app: Application;
  private _server!: Server;

  constructor(config?: GSIServerConfig) {
    this._port = config?.port ?? 3003;
    this._cfgFileName = config?.fileName ?? 'gamestate_integration_stratbook.cfg';
    this._app = express();
  }

  public stopServer() {
    this._server.close();
  }

  public async init(recur = false) {
    if (await this._isInstalled()) {
      log.info('Config is installed. Starting server.');
      this._startServer();
    } else if (!recur) {
      await this._copyConfigToCsgo();
      this.init(true);
    }
  }

  private async _startServer() {
    this._server = this._app.listen(this._port, () => log.info(`GSIServer started on port ${this._port}`));
  }

  private async _isInstalled(): Promise<boolean> {
    const csgoPath = await this._getCsgoConfigPath();
    log.info('csgoConfigPath: ', csgoPath);
    const configPath = path.join(csgoPath as string, this._cfgFileName);
    return existsSync(configPath);
  }

  private _getCsgoConfigPath(): Promise<PathLike> {
    return new Promise<PathLike>((resolve, reject) => {
      const regkey = new Registry({
        hive: Registry.HKCU,
        key: '\\SOFTWARE\\Valve\\Steam\\',
      });

      regkey.get('SteamPath', (err, res) => {
        if (err) {
          reject(err);
        } else {
          const csgoConfigPath = path.join(res.value, '/SteamApps/common/Counter-Strike Global Offensive/csgo/cfg/');
          resolve(csgoConfigPath);
        }
      });
    });
  }

  private _getGsiConfigFilePath(): string {
    return path.join(process.resourcesPath, 'build', this._cfgFileName);
  }

  private async _copyConfigToCsgo(): Promise<void> {
    try {
      const gsiConfigPath = this._getGsiConfigFilePath();
      log.info('gsiConfigPath: ', gsiConfigPath);
      const csgoConfigPath = await this._getCsgoConfigPath();
      log.info('csgoConfigPath: ', csgoConfigPath);
      copyFileSync(gsiConfigPath, csgoConfigPath);
      log.info('_copyConfigToCsgo: ', 'Successfully copied GSI file.');
    } catch (error) {
      log.error('_copyConfigToCsgo: ', error);
    }
  }
}
