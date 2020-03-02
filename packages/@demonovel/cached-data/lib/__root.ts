import { join } from "path";

export const __root = join(__dirname, '..');
export const __rootCache = join(__root, 'cache');

export const __rootCacheSource = join(__rootCache, 'source');

export const __rootCacheBuild = join(__rootCache, 'build');
