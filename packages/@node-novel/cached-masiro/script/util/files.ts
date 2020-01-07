import path from 'path';
import { createPkgPath, createPkgCachePath } from '@node-novel/site-cache-util/lib/files';

export const __path = createPkgCachePath(path.join(__dirname, '..', '..'), {
	map: {
		infoPack: ['data', 'forum.pack.json'],
	},
	fn: {
		cacheFileInfoPath(this, id: string | number)
		{
			return this.join('data', 'fid', `${id}.json`)
		},
	}
});

export const { cacheFilePaths, __root } = __path;
export const { cacheFileInfoPath } = __path.fn;

export default cacheFilePaths
