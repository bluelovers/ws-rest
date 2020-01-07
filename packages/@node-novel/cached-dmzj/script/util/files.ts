import path from 'path';
import { createPkgPath, createPkgCachePath } from '@node-novel/site-cache-util/lib/files';

export const __path = createPkgCachePath(path.join(__dirname, '..', '..'), {
});

export const { cacheFilePaths, __root } = __path;
export const { cacheFileInfoPath } = __path.fn;

export default cacheFilePaths
