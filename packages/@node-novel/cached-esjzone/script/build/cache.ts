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

let _cache_map = {} as Record<string, string>;

(async () =>
{

	let infoPack = await readJSON(cacheFilePaths.infoPack) as Record<string, IESJzoneRecentUpdateRowBook>;

	let idAuthors = {} as Record<string, Record<string, string>>;
	let idUpdate = [] as string[];
	let ids = [] as string[];
	let titles = [] as string[];
	let authors = [] as string[];
	let tags = [] as string[];
	let idTitles = {} as Record<string, string>;

	await Bluebird
		.resolve(Object.values(infoPack))

		.each(async (row) => {

			let { id, name, authors: rowAuthors } = row;

			rowAuthors = String(rowAuthors);

			idAuthors[rowAuthors] = idAuthors[rowAuthors] || {};
			idAuthors[rowAuthors][id] = name;

			ids.push(id);
			titles.push(name);
			authors.push(rowAuthors);

			idTitles[id] = name;

			tags.push(...row.tags);

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

	array_unique_overwrite(titles).sort(_sortFn001);
	array_unique_overwrite(authors).sort(_sortFn001);
	array_unique_overwrite(tags).sort(_sortFn001);

	await writeJSON(cacheFilePaths.idAuthors, idAuthors, {
		spaces: 2,
	});

	await writeJSON(cacheFilePaths.idUpdate, idUpdate, {
		spaces: 2,
	});

	await writeJSON(cacheFilePaths.idTitles, idTitles, {
		spaces: 2,
	});

	await writeJSON(cacheFilePaths.ids, ids, {
		spaces: 2,
	});

	await writeJSON(cacheFilePaths.titles, titles, {
		spaces: 2,
	});

	await writeJSON(cacheFilePaths.authors, authors, {
		spaces: 2,
	});

	await writeJSON(cacheFilePaths.tags, tags, {
		spaces: 2,
	});

})();

function _sortFn001(a: string, b: string)
{
	let aa = _cache_map[a] || (_cache_map[a] = getCjkName(a));
	let bb = _cache_map[b] || (_cache_map[b] = getCjkName(b));

	return zhDictCompare(aa, bb)
}
