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
import { outputJSONLazy } from '@node-novel/site-cache-util/lib/fs';
import { lazyRun } from '@node-novel/site-cache-util/lib/index';

let _cache_map = {} as Record<string, string>;

export default lazyRun(async () => {

	let infoPack = await readJSON(cacheFilePaths.infoPack) as Record<string, IESJzoneRecentUpdateRowBook>;

	let idAuthors = {} as Record<string, Record<string, string>>;
	let idUpdate = [] as string[];
	let ids = [] as string[];
	let titles = [] as string[];
	let authors = [] as string[];
	let tags = [] as string[];
	let idTitles = {} as Record<string, string>;

	let id_chapters = {} as Record<string, number>;
	let idVolumes = {} as Record<string, number>;

	await Bluebird
		.resolve(Object.values(infoPack))

		.each(async (row) => {

			let { id, name, authors: rowAuthors } = row;

			rowAuthors = String(rowAuthors);

			idAuthors[rowAuthors] = idAuthors[rowAuthors] || {};
			idAuthors[rowAuthors][id] = name;

			ids.push(id);
			titles.push(name);

			if (row.titles?.length > 0)
			{
				titles.push(...row.titles);
			}

			authors.push(rowAuthors);

			idTitles[id] = name;

			tags.push(...row.tags);

			idVolumes[id] = 0;

			id_chapters[id] = row.chapters.reduce((len, vol) => {
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
	tags = array_unique_overwrite(tags).sort(_sortFn001);

	await Bluebird.all([
		outputJSONLazy(cacheFilePaths.idAuthors, idAuthors),
		outputJSONLazy(cacheFilePaths.idUpdate, idUpdate),
		outputJSONLazy(cacheFilePaths.idTitles, idTitles),
		outputJSONLazy(cacheFilePaths.ids, ids),
		outputJSONLazy(cacheFilePaths.titles, titles),
		outputJSONLazy(cacheFilePaths.authors, authors),
		outputJSONLazy(cacheFilePaths.idChapters, id_chapters),
		outputJSONLazy(cacheFilePaths.tags, tags),
		outputJSONLazy(cacheFilePaths.idVolumes, idVolumes),
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
