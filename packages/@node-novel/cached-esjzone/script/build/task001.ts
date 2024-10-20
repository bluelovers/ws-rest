import { __root, getApiClient, console, consoleDebug } from '../util';
import fs, { readJSON } from 'fs-extra';
import { IESJzoneRecentUpdateCache, IESJzoneRecentUpdateRowBook } from 'esjzone-api/lib/types';
import Bluebird from 'bluebird';
import { moment, toMoment, unixMoment } from '@node-novel/site-cache-util/lib/moment';
import path from 'upath2';
import cacheFilePaths, { cacheFileInfoPath } from '../util/files';
import { isResponseFromAxiosCache } from '@bluelovers/axios-util/lib';
import { lazyRun } from '@node-novel/site-cache-util/lib/index';
import { freeGC } from 'free-gc';

const file = cacheFilePaths.recentUpdate;
const file1 = cacheFilePaths.task001;

export default lazyRun(async () => {

	const { api, saveCache } = await getApiClient();

	api.cookiesRemoveTrack();

	let listCache = await readJSON(file1)
		.catch(e => ({} as Record<string, number>))
	;

	let novelList = await (fs.readJSON(file) as PromiseLike<IESJzoneRecentUpdateCache>)
	;

	let index = 1;

	let boolCache: boolean;

	await Bluebird
		.resolve(novelList.data)
		.mapSeries(async (row) =>
		{
			let { id, last_update_time } = row;

			if (listCache[id] == null)
			{
				let _file = cacheFileInfoPath(id);

				freeGC();

				return api.bookInfo(id)
					.tap(async (data) =>
					{
						let old: IESJzoneRecentUpdateRowBook = await readJSON(_file).catch(e => null);

						if (!data.last_update_time && data.name === '' && old?.name)
						{
							// 保留被刪除的書籍資料
							data = old;
						}

						if (data.last_update_time < row.last_update_time)
						{
							consoleDebug.error(index, id, row.name, moment.unix(listCache[id]).format(), data.last_update_chapter_name);

							return;
						}

						listCache[id] = Math.max(data.last_update_time | 0, last_update_time | 0, 0);

						if (!data.last_update_time && listCache[id])
						{
							data.last_update_time = listCache[id];
						}

						consoleDebug.info(index, id, row.name, moment.unix(listCache[id]).format(), data.last_update_chapter_name);

						index++;

						return Bluebird.all([
							fs.outputJSON(_file, data, {
								spaces: 2,
							}),
						])
					})
					.tap(async function (r)
					{
						if (boolCache != false)
						{
							// @ts-ignore
							boolCache = isResponseFromAxiosCache(this.$response)
						}

						if (!boolCache)
						{
							if ((index % 10) == 0)
							{
								await _saveDataCache();
								boolCache = null;
							}

							if ((index % 100) == 0)
							{
								await saveCache();
								boolCache = null;
							}
						}

					})
					;
			}
			else
			{
				//consoleDebug.gray.debug(`[SKIP]`, index, id, row.name, moment.unix(listCache[id]).format());
			}

		})
		.catch(e => console.error(e))
	;

	await _saveDataCache();

	await saveCache();

	function _saveDataCache()
	{
		return Bluebird.all([
			fs.outputJSON(file1, listCache, {
				spaces: 2,
			})
				.then(e => {
					consoleDebug.info(`outputJSON`, path.relative(__root, file1));
					return e;
				})
			,
		]);
	}

}, {
	pkgLabel: __filename
});

