import { __root, getApiClient, console, consoleDebug } from '../util';
import fs, { readJSON } from 'fs-extra';
import { IESJzoneRecentUpdateCache } from 'esjzone-api/lib/types';
import Bluebird from 'bluebird';
import { moment, toMoment, unixMoment } from '@node-novel/site-cache-util/lib/moment';
import path from 'upath2';
import cacheFilePaths, { cacheFileInfoPath, __path } from '../util/files';
import { isResponseFromAxiosCache } from '@bluelovers/axios-util/lib';
import { outputJSONLazy } from '@node-novel/site-cache-util/lib/fs';
import { IDiscuzForumThread } from 'discuz-api/lib/types';
import { _getForumLastThreadSubject } from 'discuz-api/lib/util';

import { lazyRun } from '@node-novel/site-cache-util/lib/index';
import getThreadsByFid from '../util/getThreads';

export default lazyRun(async () => {

	const { api, saveCache } = await getApiClient();

	let listCache = await readJSON(cacheFilePaths.task001)
		.catch(e => ({} as Record<string, number>))
	;

	let index = 1;

	let boolCache: boolean;

	await Bluebird
		.resolve(Object.entries(listCache) as [string, number][])
		.mapSeries(async (row) =>
		{
			let [ fid, last_update_time ] = row;

			if (listCache[fid] == null)
			{
				let _file = cacheFileInfoPath(fid);

				return getThreadsByFid(api, {
						fid
					}, {
					cacheFileInfoPath,
				})
					.tap(async (data) =>
					{
						listCache[fid] = Math.max(data.last_thread_time | 0, last_update_time | 0, 0);

						let thread_subject = _getForumLastThreadSubject(data).thread_subject_full;

						if (data.last_thread_id)
						{
							let thread: IDiscuzForumThread;

							data.threads.some(v => {
								if (v.tid == data.last_thread_id)
								{
									thread = v;

									return true;
								}
							});

							if (thread && thread.typeid)
							{
								thread_subject = data.thread_types[thread.typeid] + ' ' + thread_subject;
							}
						}

						consoleDebug.info(index, fid, data.forum_name, moment.unix(listCache[fid]).format(), thread_subject, 'threads:', data.threads.length);

						index++;

						return Bluebird.all([
							outputJSONLazy(_file, data),
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

							await Bluebird.delay(3000);
						}

					})
					;
			}
			else
			{
				//consoleDebug.gray.debug(`[SKIP]`, fid, moment.unix(last_update_time).format());
			}

		})
		.catch(e => console.error(e))
	;

	await _saveDataCache();

	await saveCache();

	function _saveDataCache()
	{
		return Bluebird.all([
			outputJSONLazy(cacheFilePaths.task001, listCache, {
				spaces: 2,
			})
				.then(e => {
					consoleDebug.info(`outputJSON`, __path.relative(cacheFilePaths.task001));
					return e;
				})
			,
		]);
	}

}, {
	pkgLabel: __filename
});

