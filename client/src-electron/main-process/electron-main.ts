import { app, nativeTheme } from 'electron';
import fs from 'fs';
import path from 'path';

import 'reflect-metadata';

import { application } from 'src-electron/app/app';

try {
  if (process.platform === 'win32' && nativeTheme.shouldUseDarkColors === true) {
    fs.unlinkSync(path.join(app.getPath('userData'), 'DevTools Extensions'));
  }
} catch (_) {}

application.initialize();
