import path from 'path';
import fs from 'fs-extra';
import dotenv from 'dotenv';

let cachedEnvPath;

export async function loadProjectEnv({
  rootDir = process.cwd(),
  logger = console,
} = {}) {
  if (cachedEnvPath !== undefined) {
    return cachedEnvPath;
  }

  for (const filename of ['.env', 'env']) {
    const envPath = path.join(rootDir, filename);
    if (await fs.pathExists(envPath)) {
      dotenv.config({ path: envPath });
      logger.debug?.(`[env] Loaded ${filename}`);
      cachedEnvPath = envPath;
      return envPath;
    }
  }

  cachedEnvPath = null;
  logger.debug?.('[env] No .env or env file found');
  return null;
}
