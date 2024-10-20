import fs, { readJSON, writeJSON } from 'fs-extra';
import cacheFilePaths, { cacheFileInfoPath } from '../util/files';
import { IWenku8RecentUpdateCache, IWenku8RecentUpdateRowBookWithChapters } from 'wenku8-api/lib/types';
import Bluebird from 'bluebird';
import { consoleDebug } from '../util';
import { zhDictCompare, getCjkName } from '@novel-segment/util';
import sortObject from'sort-object-keys2';
import { array_unique_overwrite } from 'array-hyper-unique';
import { outputJSONLazy } from '@node-novel/site-cache-util/lib/fs';
import { lazyRun } from '@node-novel/site-cache-util/lib/index';

let _cache_map = {} as Record<string, string>;

export default lazyRun(async () => {

	let recentUpdate = await readJSON(cacheFilePaths.recentUpdate) as IWenku8RecentUpdateCache;

	let idAuthors = {} as Record<string, Record<string, string>>;
	let idUpdate = [] as string[];
	let ids = [] as string[];
	let titles = [] as string[];
	let authors = [] as string[];
	let idTitles = {} as Record<string, string>;
	let copyrightRemove = {} as Record<string, string>;

	let id_chapters = {} as Record<string, number>;
	let idVolumes = {} as Record<string, number>;

	await Bluebird
		.resolve(recentUpdate.data)

		.each(async (row) => {

			let { id, name } = row;

			idAuthors[row.authors] = idAuthors[row.authors] || {};
			idAuthors[row.authors][id] = name;

			ids.push(id);
			titles.push(name);
			authors.push(row.authors);

			idTitles[id] = name;

			let _file = cacheFileInfoPath(id);

			let info = await readJSON(_file) as IWenku8RecentUpdateRowBookWithChapters;

			if (info.copyright_remove)
			{
				copyrightRemove[id] = name;
			}

			idVolumes[id] = 0;

			id_chapters[id] = info.chapters.reduce((len, vol) => {
				idVolumes[id]++;
				return len += vol.chapters.length;
			}, 0)

		})
		.then(data => data.sort((a, b) => {
			return b.last_update_time - a.last_update_time;
		}))
		.each(row => {
			let { id, name, authors } = row;

			idUpdate.push(id);
		})
	;

	idAuthors = sortObject(idAuthors, {
		sort: _sortFn001,
	});

	titles = array_unique_overwrite(titles).sort(_sortFn001);
	authors = array_unique_overwrite(authors).sort(_sortFn001);

	await Bluebird.all([

		writeJSON(cacheFilePaths.idAuthors, idAuthors, {
			spaces: 2,
		}),

		writeJSON(cacheFilePaths.idUpdate, idUpdate, {
			spaces: 2,
		}),

		writeJSON(cacheFilePaths.idTitles, idTitles, {
			spaces: 2,
		}),

		writeJSON(cacheFilePaths.ids, ids, {
			spaces: 2,
		}),

		writeJSON(cacheFilePaths.titles, titles, {
			spaces: 2,
		}),

		writeJSON(cacheFilePaths.authors, authors, {
			spaces: 2,
		}),

		writeJSON(cacheFilePaths.copyrightRemove, copyrightRemove, {
			spaces: 2,
		}),

		writeJSON(cacheFilePaths.idChapters, id_chapters, {
			spaces: 2,
		}),

		writeJSON(cacheFilePaths.idVolumes, idVolumes, {
			spaces: 2,
		}),

	]);

}, {
	pkgLabel: __filename
});

function _sortFn001(a: string, b: string)
{
	let aa = _cache_map[a] ??= getCjkName(a);
	let bb = _cache_map[b] ??= getCjkName(b);

	return zhDictCompare(aa, bb)
}
