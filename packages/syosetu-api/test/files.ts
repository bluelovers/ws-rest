import path from 'path';
import { createPkgPath, createPkgCachePath } from '@node-novel/site-cache-util/lib/files';

export const __path = createPkgCachePath(path.join(__dirname, '..'), {
	map: {
		//copyrightRemove: ['data/novel', 'copyright_remove.json'],
	},
});

export const { cacheFilePaths, __root } = __path;
export const { cacheFileInfoPath } = __path.fn;

export default cacheFilePaths
