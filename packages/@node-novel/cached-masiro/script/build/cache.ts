import fs, { readJSON, writeJSON } from 'fs-extra';
import cacheFilePaths, { cacheFileInfoPath } from '../util/files';
import {
	IESJzoneRecentUpdateCache,
	IESJzoneRecentUpdateRowBook,
} from 'esjzone-api/lib/types';
import Bluebird from 'bluebird';
import { consoleDebug } from '../util';
import { zhDictCompare, getCjkName } from '@novel-segment/util';
import sortObject from'sort-object-keys2';
import { array_unique_overwrite } from 'array-hyper-unique';
import { IDiscuzForumPickThreads } from 'discuz-api/lib/types';
import { outputJSONLazy } from '@node-novel/site-cache-util/lib/fs';
import { lazyRun } from '@node-novel/site-cache-util/lib/index';

let _cache_map = {} as Record<string, string>;

export default lazyRun(async () => {

	let infoPack = await readJSON(cacheFilePaths.infoPack) as Record<string, IDiscuzForumPickThreads>;

	let idAuthors = {} as Record<string, Record<string, string>>;
	let idUpdate = [] as string[];
	let ids = [] as string[];
	let titles = [] as string[];
	let authors = [] as string[];
	let tags = [] as string[];
	let idTitles = {} as Record<string, string>;

	let id_chapters = {} as Record<string, number>;

	await Bluebird
		.resolve(Object.values(infoPack))

		.each(async (row) => {

			let { fid: id, forum_name: name } = row;

			ids.push(id);
			titles.push(name);

			idTitles[id] = name;

			row.threads.forEach(thread => {

				if (thread.author != null)
				{
					authors.push(thread.author);

					idAuthors[thread.author] = idAuthors[thread.author] || {};

					idAuthors[thread.author][id] = name;
				}

			});

			id_chapters[id] = row.threads.length;

		})
		.then(data => data.sort((a, b) => {
			return b.last_thread_time - a.last_thread_time;
		}))
		.each(row => {
			let { fid: id, forum_name: name } = row;

			idUpdate.push(id);
		})
	;

	idAuthors = sortObject(idAuthors, {
		sort: _sortFn001,
	});

	array_unique_overwrite(titles).sort(_sortFn001);
	array_unique_overwrite(authors).sort(_sortFn001);
	array_unique_overwrite(tags).sort(_sortFn001);

	await Bluebird.all([
		outputJSONLazy(cacheFilePaths.idAuthors, idAuthors),
		outputJSONLazy(cacheFilePaths.idUpdate, idUpdate),
		outputJSONLazy(cacheFilePaths.idTitles, idTitles),
		outputJSONLazy(cacheFilePaths.ids, ids),
		outputJSONLazy(cacheFilePaths.titles, titles),
		outputJSONLazy(cacheFilePaths.authors, authors),
		outputJSONLazy(cacheFilePaths.idChapters, id_chapters),
	]);

}, {
	pkgLabel: __filename
});

function _sortFn001(a: string, b: string)
{
	let aa = _cache_map[a] || (_cache_map[a] = getCjkName(a));
	let bb = _cache_map[b] || (_cache_map[b] = getCjkName(b));

	return zhDictCompare(aa, bb)
}
