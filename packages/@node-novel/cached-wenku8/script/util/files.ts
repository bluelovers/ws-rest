import path from 'upath2';
import { __root } from '../util';

export const cacheFilePaths = {

	recentUpdate: path.join(__root, 'data', 'novel/recentUpdate.json'),

	task001: path.join(__root, 'test/temp', 'task001.json'),

	copyrightRemove: path.join(__root, 'data/novel', 'copyright_remove.json'),

};

export function cacheFileInfoPath(id: string | number)
{
	return path.join(__root, 'data', `novel/info/${id}.json`)
}

export default cacheFilePaths
