import { consoleDebug, lazyRun } from '@node-novel/site-cache-util/lib/index';
import { __root, getApiClient } from '../util';
import { cacheFileInfoPath, cacheFilePaths } from '../util/files';
import { readJSON, pathExists } from 'fs-extra';
import { IMasiroMeBookMini, IMasiroMeRecentUpdateAll } from 'masiro-me-api/lib/types';
import { outputJSONLazy } from '@node-novel/site-cache-util/lib/fs';
import Bluebird from 'bluebird';
import { relative } from 'path';
import { freeGC } from 'free-gc';
import { moment } from '@node-novel/site-cache-util/lib/moment';
import { isResponseFromAxiosCache } from '@bluelovers/axios-util/lib/index';
import { printIndexLabel } from '../util/util';

export default lazyRun(async () =>
{

	const { api, saveCache } = await getApiClient();

	const file_recentUpdate = cacheFilePaths.recentUpdate;
	const file_task001 = cacheFilePaths.task001;

	let recentUpdateList: IMasiroMeRecentUpdateAll = await readJSON(file_recentUpdate);

	let cacheTask001: Record<string, number> = await readJSON(file_task001)
		.catch(e => ({}))
	;

	let boolCache: boolean = null;

	const date_now = Date.now();

	await Bluebird
		.resolve(recentUpdateList.list)
		.mapSeries(async (row, index, length) =>
		{
			const { id } = row;
			const _file = cacheFileInfoPath(id);

			if (await pathExists(_file) && cacheTask001[id])
			{
				consoleDebug.gray.debug(`[SKIP]`, printIndexLabel(index, length), id, row.title, moment(cacheTask001[id])
					.format(), row.last_update_name);

				return;
			}

			await api.bookInfo(id)
				.catchReturn(null as null)
				.tap(novel =>
				{
					if (!novel)
					{
						consoleDebug.warn(printIndexLabel(index + 1, length), id, `不存在或沒有權限`);

						cacheTask001[id] ||= date_now;

						return;
					}

					consoleDebug.info(printIndexLabel(index + 1, length), id, novel.title, moment(novel.updated)
						.format(), novel.last_update_name);

					cacheTask001[id] = novel.updated || date_now;

					return outputJSONLazy(_file, novel)
				})
				.tap(async function (this: typeof api)
				{
					if (boolCache === null || boolCache === true)
					{
						boolCache = isResponseFromAxiosCache(this.$response)
					}

					if (boolCache !== true)
					{
						if ((index % 10) === 0)
						{
							await _saveDataCache();
							boolCache = null;
						}

						if ((index % 30) === 0)
						{
							await saveCache();
							boolCache = null;
						}
					}
				})
			;

			freeGC();
		})
	;

	function _saveDataCache()
	{
		return Bluebird.all([
			outputJSONLazy(file_task001, cacheTask001)
				.then(e =>
				{
					consoleDebug.info(`outputJSON`, relative(__root, file_task001));
					return e;
				})
			,
		]);
	}

	return Promise.all([
		_saveDataCache(),
		saveCache(),
	])
}, {
	pkgLabel: __filename,
});
