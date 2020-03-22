/**
 * Created by user on 2019/7/7.
 */

import fs, { WriteOptions as IJSONWriteOptions, readJSON } from 'fs-extra';
import path from 'upath2';
import { IDmzjNovelInfoRecentUpdateRow, IDmzjNovelInfoWithChapters } from 'dmzj-api/lib/types';
import { exportCache, importCache, processExitHook } from 'axios-cache-adapter-util';
import { getAxiosCacheAdapter } from 'restful-decorator/lib/decorators/config/cache';
import { IBaseCacheStore } from 'axios-cache-adapter-util';
import Bluebird from 'bluebird';
import { getApiClient, __root, console, consoleDebug } from '../util';
import { ITSUnpackedPromiseLike } from 'ts-type';
import { array_unique } from 'array-hyper-unique';
// @ts-ignore
import naturalCompare from "string-natural-compare";
import { IDiscuzForum, IDzParamForumdisplay } from 'discuz-api/lib/types';
import cacheFilePaths from '../util/files';
import { outputJSONLazy } from '@node-novel/site-cache-util/lib/fs';

import { lazyRun } from '@node-novel/site-cache-util/lib/index';
import { default as ApiClient } from 'discuz-api/lib';
import { getResponseUrl, isResponseFromAxiosCache } from '@bluelovers/axios-util/lib';

export default lazyRun(async () => {

	const { api, saveCache } = await getApiClient();

	let listCache = await readJSON(cacheFilePaths.task001)
		.catch(e => ({} as Record<string, number>))
	;

	await _fn_forums([
		36,
		162,
		164,
		165,
		316,
		317,
		69,
		321,
		324,
	])
		.then(async (ls) => {

			let fids = ls.reduce((a, data) => {

				data.subforums.forEach(data => {
					a.push(data.fid);
				});

				return a;
			}, [] as IDzParamForumdisplay["fid"][]);

			fids.sort((a, b) => {
				// @ts-ignore
				return b - a
			});

			consoleDebug.debug(`[subforums]`, 'length:', fids.length);

			await _fn_forums(array_unique(fids))
				.tap(async (ls2) => {

					ls.push(...ls2);

				})
			;

			return ls;
		})
	;

	function _fn_forums(fids: IDzParamForumdisplay["fid"][])
	{
		return Bluebird.resolve(fids)
			.mapSeries(async (fid) => {

				consoleDebug.gray.debug(`[forum:start]`, fid, listCache[fid]);

				let data = await api.forum({
					fid,
				})
					.finally(function (this: ApiClient)
					{
						if (!isResponseFromAxiosCache(this.$response))
						{
							consoleDebug.debug(`[forum:fetch]`, fid);
						}
					})
				;

				let old = listCache[fid];

				if (listCache[fid] == null)
				{
					listCache[fid] = null;
				}

				if (data.last_thread_time && data.last_thread_time > listCache[fid])
				{
					listCache[fid] = null;
				}
				else if (!data.last_thread_time && data.subforums.length)
				{
					listCache[fid] = null;
				}

				if (old !== listCache[fid])
				{
					consoleDebug.magenta.info(`[update]`, fid, data.forum_name);
				}

				//await fs.outputJSON(path.join(__root, 'data/fid', `${fid}.json`), data, outputJSONOptions);

				return data
			})
		;
	}

	await outputJSONLazy(cacheFilePaths.task001, listCache);

}, {
	pkgLabel: __filename
});
