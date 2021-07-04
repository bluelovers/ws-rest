import { __root, getApiClient, console, consoleDebug } from '../util';
import { readJSON, pathExistsSync, outputJSON } from 'fs-extra';
import { IWenku8RecentUpdateCache } from 'wenku8-api/lib/types';
import Bluebird from 'bluebird';
import { moment, toMoment, unixMoment } from '@node-novel/site-cache-util/lib/moment';
import path from 'upath2';
import cacheFilePaths, { cacheFileInfoPath } from '../util/files';
import { lazyRun } from '@node-novel/site-cache-util/lib/index';
import { freeGC } from 'free-gc';

const file = cacheFilePaths.recentUpdate;
const file1 = cacheFilePaths.task001;
const file_copyright_remove = cacheFilePaths.copyrightRemove;

export default lazyRun(async () => {

	const { api, saveCache } = await getApiClient();

	api.cookiesRemoveTrack();

	let listCache = await readJSON(file1)
		.catch(e => ({} as Record<string, number>))
	;

	let novelList = await (readJSON(file) as PromiseLike<IWenku8RecentUpdateCache>)
	;

	let _cache = {} as Record<'copyright_remove', Record<string, string>>;

	_cache.copyright_remove = await readJSON(file_copyright_remove).catch(e => {}) || {};

	let index = 1;

	await Bluebird
		.resolve(novelList.data)
		.mapSeries(async (row) =>
		{
			let { id, last_update_time } = row;

			if (listCache[id] != last_update_time || listCache[id] == null)
			{
				let _file = cacheFileInfoPath(id);

				if (_cache.copyright_remove[id] && listCache[id] != null && pathExistsSync(_file))
				{
					consoleDebug.info(`[SKIP]`, index, id, row.name, moment.unix(last_update_time).format());
				}

				freeGC();

				return api.bookInfoWithChapters(id)
					.tap(async (data) =>
					{
						consoleDebug.debug(index, id, row.name, moment.unix(last_update_time).format(), row.last_update_chapter_name);

						index++;

						listCache[id] = Math.max(data.last_update_time, last_update_time, 0);

						if (data.copyright_remove)
						{
							_cache.copyright_remove[id] = data.name;

							consoleDebug.red.info(`[copyright remove]`, id, row.name, );
						}

						if (!data.last_update_time && listCache[id])
						{
							data.last_update_time = listCache[id];
						}

						return Bluebird.all([
							outputJSON(_file, data, {
								spaces: 2,
							}),
						])
					})
					.tap(async (r) => {

						if ((index % 10) == 0)
						{
							await _saveDataCache();

							api.cookiesRemoveTrack();
						}

						if ((index % 100) == 0)
						{
							await saveCache();
						}

					})
					;
			}
		})
		.catch(e => console.error(e))
	;

	await _saveDataCache();

	await saveCache();

	function _saveDataCache()
	{
		return Bluebird.all([
			outputJSON(file1, listCache, {
				spaces: 2,
			})
				.then(e => {
					consoleDebug.info(`outputJSON`, path.relative(__root, file1));
					return e;
				})
			,
			outputJSON(file_copyright_remove, _cache.copyright_remove, {
				spaces: 2,
			})
				.then(e => {
					consoleDebug.info(`outputJSON`, path.relative(__root, file_copyright_remove));
					return e;
				})
		]);
	}

}, {
	pkgLabel: __filename
});

