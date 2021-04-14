import path from 'path';
import fs from 'fs';

/**
 * Safety check, so that we don't accidentally modify files outside of our cwd.
 */
function isPathRelative(parent: string, dir: string) {
  const relative = path.relative(parent, dir);
  return relative && !relative.startsWith('..') && !path.isAbsolute(relative);
}

export function testTempDir(cwd: string, tempDir: string) {
  if (!isPathRelative(cwd, tempDir)) {
    throw new Error('tempDir path is outside of our cwd!');
  }

  let stats: fs.Stats;

  try {
    stats = fs.lstatSync(tempDir);
  } catch (error) {
    // directory does not exist
    return false;
  }

  if (stats.isDirectory()) {
    return true;
  }

  throw new Error(`The specified path points to a file: ${tempDir}`);
}
