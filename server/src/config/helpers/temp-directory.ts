import { Logger } from '@nestjs/common';

import path from 'path';
import fs from 'fs';

/**
 * Safety check, so that we don't accidentally modify files outside of our cwd.
 */
function isPathRelative(parent: string, dir: string) {
  const relative = path.relative(parent, dir);
  return relative && !relative.startsWith('..') && !path.isAbsolute(relative);
}

function isDirectory(dir: string) {
  let stats: fs.Stats;

  try {
    stats = fs.lstatSync(dir);
  } catch (error) {
    // directory does not exist
    return false;
  }

  if (stats.isDirectory()) {
    return true;
  }

  throw new Error(`The specified path points to a file: ${dir}`);
}

/**
 * Resolves, verifies the location and prepares to directory pointed at by @name dir
 * @param dir relative path to temp directory
 * @returns resolved, absolute path to prepare directory
 */
export function resolvePrepareDirectory(dir: string) {
  const resolved = path.resolve(dir);

  if (!isPathRelative(process.cwd(), resolved)) {
    throw new Error('path is outside of our cwd!');
  }

  if (!isDirectory(resolved)) {
    // directory doesn't exist, create one
    fs.mkdirSync(resolved, { recursive: true });
  } else {
    Logger.debug(`Deleting files in temp directory: ${resolved}`, 'TempDirectory');

    // delete single files instead of deleting the whole directory,
    // to prevent double reloading of webpack in watch mode.
    fs.readdirSync(resolved).forEach((file) => {
      const filePath = path.join(resolved, file);

      if (!isDirectory(filePath)) {
        fs.unlinkSync(filePath);
      }
    });
  }

  return resolved;
}
