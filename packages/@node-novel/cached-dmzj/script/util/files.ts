import path from 'upath2';
import { __root } from '../util';

export const cacheFilePaths = {

	recentUpdate: path.join(__root, 'data', 'novel/recentUpdate.json'),

	recentUpdateDay: path.join(__root, 'data', 'novel/recentUpdateDay.json'),

	task001: path.join(__root, 'test/temp', 'task001.json'),

	infoPack: path.join(__root, 'data', 'novel/info.pack.json'),

	idAuthors: path.join(__root, 'data/novel', 'id_authors.json'),

	idTitles: path.join(__root, 'data/novel', 'id_titles.json'),

	idUpdate: path.join(__root, 'data/novel', 'id_update.json'),

	idChapters: path.join(__root, 'data/novel', 'id_chapters.json'),

	ids: path.join(__root, 'data/novel', 'ids.json'),

	titles: path.join(__root, 'data/novel', 'titles.json'),

	authors: path.join(__root, 'data/novel', 'authors.json'),

	tags: path.join(__root, 'data/novel', 'tags.json'),

};

export function cacheFileInfoPath(id: string | number)
{
	return path.join(__root, 'data', `novel/info/${id}.json`)
}

export default cacheFilePaths
