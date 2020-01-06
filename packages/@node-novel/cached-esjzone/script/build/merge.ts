import fs, { readJSON, writeJSON } from 'fs-extra';
import cacheFilePaths, { cacheFileInfoPath } from '../util/files';
import { IESJzoneRecentUpdateCache, IESJzoneRecentUpdateRowBook } from 'esjzone-api/lib/types';
import Bluebird from 'bluebird';
import { consoleDebug, __root } from '../util';
import FastGlob, { Options, EntryItem } from '@bluelovers/fast-glob/bluebird';
import path from 'upath2';
import { zhDictCompare, getCjkName } from '@novel-segment/util';
import sortObject from'sort-object-keys2';
import { lazyRun } from '@node-novel/site-cache-util/lib/index';

let _cache_map = {} as Record<string, string>;

export default lazyRun(async () => {

	let data = await FastGlob
		.async<string>([
			'*.json',
		], {
			cwd: path.join(__root, 'data', 'novel/info'),
			absolute: true,
		})
		.reduce(async (a, file) => {

			let info = await readJSON(file) as IESJzoneRecentUpdateRowBook;

			a[info.id] = info;

			return a;
		}, {} as Record<string, IESJzoneRecentUpdateRowBook>)
	;

	await writeJSON(cacheFilePaths.infoPack, data);

}, {
	pkgLabel: __filename
});

function _sortFn001(a: string, b: string)
{
	let aa = _cache_map[a] || (_cache_map[a] = getCjkName(a));
	let bb = _cache_map[b] || (_cache_map[b] = getCjkName(b));

	return zhDictCompare(aa, bb)
}
