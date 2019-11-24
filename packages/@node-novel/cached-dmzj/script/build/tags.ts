/**
 * Created by user on 2019/7/28.
 */

import { getDmzjClient, __root, console, consoleDebug, trim } from '../util';
import path from "path";
import fs from 'fs-extra';
import Bluebird from 'bluebird';
import { IDmzjNovelInfo, IDmzjNovelInfoRecentUpdateRow } from 'dmzj-api/lib/types';
import moment from 'moment';
import FastGlob from '@bluelovers/fast-glob/bluebird';
import { array_unique_overwrite } from 'array-hyper-unique';
import { fixDmzjNovelTags, trimUnsafe } from 'dmzj-api/lib/util';
import { defaultSortCallback, createSortCallback } from '@node-novel/sort';
import sortObject from'sort-object-keys2';
import { zhDictCompare, getCjkName } from '@novel-segment/util';

let _cache_map = {} as Record<string, string>;

export default (async () =>
{
	const { api, saveCache } = await getDmzjClient();

	let ids: number[] = [];
	let tags: string[] = [];
	let authors: string[] = [];
	let zone: string[] = [];
	let titles: string[] = [];
	let id_titles: Record<number, string> = {};
	let id_authors: Record<string, Record<number, string>> = {};
	let info_pack: Record<number, IDmzjNovelInfo> = {};

	await FastGlob.async([
		'*.json',
	], {
		cwd: path.join(__root, 'data', 'novel/info'),
		absolute: true,
	})
		.each(async (file) => {

			let v: IDmzjNovelInfo = await fs.readJSON(file);

			info_pack[v.id] = v;

			ids.push(v.id);

			tags.push(...fixDmzjNovelTags(v.types));

			authors.push(trimUnsafe(v.authors));

			zone.push(trimUnsafe(v.zone));

			titles.push(trimUnsafe(v.name));

			id_titles[v.id] = trimUnsafe(v.name);

			id_authors[trimUnsafe(v.authors)] = id_authors[trimUnsafe(v.authors)] || {};

			id_authors[trimUnsafe(v.authors)][v.id] = trimUnsafe(v.name);

		})
	;

	array_unique_overwrite(tags).sort(_sortFn001);
	array_unique_overwrite(authors).sort(_sortFn001);
	array_unique_overwrite(zone).sort(_sortFn001);
	array_unique_overwrite(titles).sort(_sortFn001);
	ids.sort((a, b) => a - b);

	id_authors = sortObject(id_authors, {
		sort: _sortFn001,
	});

	await Bluebird.all([
		fs.outputJSON(path.join(__root, 'data', 'novel', `tags.json`), tags, {
			spaces: 2,
		}),
		fs.outputJSON(path.join(__root, 'data', 'novel', `zone.json`), zone, {
			spaces: 2,
		}),
		fs.outputJSON(path.join(__root, 'data', 'novel', `authors.json`), authors, {
			spaces: 2,
		}),
		fs.outputJSON(path.join(__root, 'data', 'novel', `titles.json`), titles, {
			spaces: 2,
		}),
		fs.outputJSON(path.join(__root, 'data', 'novel', `id_titles.json`), id_titles, {
			spaces: 2,
		}),
		fs.outputJSON(path.join(__root, 'data', 'novel', `id_authors.json`), id_authors, {
			spaces: 2,
		}),
		fs.outputJSON(path.join(__root, 'data', 'novel', `ids.json`), ids, {
			spaces: 2,
		}),
		fs.outputJSON(path.join(__root, 'data', 'novel', `info.pack.json`), info_pack, {
			spaces: 2,
		}),
	]);

})();

function _sortFn001(a: string, b: string)
{
	let aa = _cache_map[a] || (_cache_map[a] = getCjkName(a));
	let bb = _cache_map[b] || (_cache_map[b] = getCjkName(b));

	return zhDictCompare(aa, bb)
}
