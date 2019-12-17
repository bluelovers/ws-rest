import fs, { readJSON, writeJSON } from 'fs-extra';
import cacheFilePaths, { cacheFileInfoPath } from '../util/files';
import { IESJzoneRecentUpdateCache, IESJzoneRecentUpdateRowBook } from 'esjzone-api/lib/types';
import Bluebird from 'bluebird';
import { consoleDebug, __root } from '../util';
import FastGlob, { Options, EntryItem } from '@bluelovers/fast-glob/bluebird';
import path from 'upath2';
import { zhDictCompare, getCjkName } from '@novel-segment/util';
import sortObject from'sort-object-keys2';

let _cache_map = {} as Record<string, string>;

export default (async () =>
{

	let data = await FastGlob
		.async<string>([
			'*.json',
		], {
			cwd: path.join(__root, 'data', 'fid'),
			absolute: true,
		})
		.reduce(async (a, file) => {

			let info = await readJSON(file);

			a[info.fid] = info;

			return a;
		}, {} as Record<string, any>)
	;

	await writeJSON(cacheFilePaths.infoPack, data);

})();

function _sortFn001(a: string, b: string)
{
	let aa = _cache_map[a] || (_cache_map[a] = getCjkName(a));
	let bb = _cache_map[b] || (_cache_map[b] = getCjkName(b));

	return zhDictCompare(aa, bb)
}
