import { consoleDebug, lazyRun } from '@node-novel/site-cache-util/lib/index';
import { __root, getApiClient } from '../util';
import { cacheFileInfoPath, cacheFilePaths } from '../util/files';
import { readJSON, pathExists } from 'fs-extra';
import { IMasiroMeBookMini, IMasiroMeBookWithChapters, IMasiroMeRecentUpdateAll } from 'masiro-me-api/lib/types';
import { outputJSONLazy } from '@node-novel/site-cache-util/lib/fs';
import Bluebird from 'bluebird';
import { basename, dirname, join, relative } from 'path';
import { freeGC } from 'free-gc';
import { moment } from '@node-novel/site-cache-util/lib/moment';
import { isResponseFromAxiosCache } from '@bluelovers/axios-util/lib/index';
import { printIndexLabel } from '../util/util';
import FastGlob from '@bluelovers/fast-glob/bluebird';
import { array_unique_overwrite } from 'array-hyper-unique';
import { zhDictCompare, getCjkName } from '@novel-segment/util';
import sortObject from'sort-object-keys2';

let _cache_map = {} as Record<string, string>;

export default lazyRun(async () =>
{

	const { api, saveCache } = await getApiClient();

	const file_recentUpdate = cacheFilePaths.recentUpdate;

	let recentUpdateList: IMasiroMeRecentUpdateAll = await readJSON(file_recentUpdate);

	let _cacheMap = {
		idAuthors: {} as Record<string, Record<string, string>>,
		idUpdate: {} as Record<string, number>,
		ids: [] as string[],
		titles: [] as string[],
		authors: [] as string[],
		tags: [] as string[],
		idTitles: {} as Record<string, string>,

		idChapters: {} as Record<string, number>,
		idVolumes: {} as Record<string, number>,

		infoPack: {} as Record<string, IMasiroMeBookWithChapters>,
	}

	await FastGlob.async([
			'*.json',
		], {
			cwd: dirname(cacheFileInfoPath(1)),
			absolute: true,
		})
		.mapSeries(async (_file, index, length) =>
		{
			const novel: IMasiroMeBookWithChapters = await readJSON(_file)

			const { id, title } = novel;

			if (!title)
			{
				console.warn(`${id} 不存在或者已刪除`, novel, basename(_file))

				return;
			}

			_cacheMap.infoPack[novel.id] = novel;

			novel.authors?.length && _cacheMap.authors.push(...novel.authors);
			_cacheMap.ids.push(novel.id);
			novel.tags?.length && _cacheMap.tags.push(...novel.tags);
			_cacheMap.titles.push(title);

			let author = novel.authors?.[0] ?? '';

			_cacheMap.idTitles[id] = title;

			if (typeof author === 'string')
			{
				_cacheMap.idAuthors[author] ??= {} as null;
				_cacheMap.idAuthors[author][id] = title;
			}

			_cacheMap.idVolumes[id] = 0;
			_cacheMap.idChapters[id] = 0;

			if (novel.chapters?.length)
			{
				_cacheMap.idChapters[id] = novel.chapters.reduce((len, vol) => {
					_cacheMap.idVolumes[id]++;
					return len + vol.chapters.length;
				}, 0);
			}

			_cacheMap.idUpdate[id] = novel.updated;

			return novel
		})
		/*
		.then(data => data.sort((a, b) => {
			return b.updated - a.updated;
		}))
		.each(row => {
			let { id } = row;

			_cacheMap.idUpdate.push(id);
		})
		 */
	;

	_cacheMap.idAuthors = sortObject(_cacheMap.idAuthors, {
		sort: _sortFn001,
	});

	([
		'authors',
		'ids',
		'tags',
		'titles',
	] as const).forEach(key =>
	{
		array_unique_overwrite(_cacheMap[key]).sort(_sortFn001)
	});

	return Promise.all([

		...(Object.keys(_cacheMap) as (keyof typeof _cacheMap)[])
			.map((key) =>
			{

				if (!cacheFilePaths[key]?.length)
				{
					throw new Error(`${key} not exists in cacheFilePaths`);
				}

				return outputJSONLazy(cacheFilePaths[key], _cacheMap[key as keyof typeof _cacheMap]) as any
			}),
		saveCache(),
	])
}, {
	pkgLabel: __filename,
});

function _sortFn001(a: string, b: string)
{
	let aa = _cache_map[a] ??= getCjkName(a);
	let bb = _cache_map[b] ??= getCjkName(b);

	return zhDictCompare(aa, bb)
}
