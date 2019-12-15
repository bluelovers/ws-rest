/**
 * Created by user on 2019/7/7.
 */

import fs, { WriteOptions as IJSONWriteOptions } from 'fs-extra';
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

export default (async () =>
{
	const { api, saveCache } = await getApiClient();

	const file = path.join(__root, 'data', 'novel/recentUpdate.json');

	let novelList = await (fs.readJSON(file)
		.catch(e => null))
	;

	let outputJSONOptions: IJSONWriteOptions = {
		spaces: 2,
	};

	await _fn_forums([
		36,
		162,
		164,
		165,
	])
		.then(async (ls) => {

			let fids = ls.reduce((a, data) => {

				data.subforums.forEach(data => {
					a.push(data.fid);
				});

				return a;
			}, [] as number[]);

			fids.sort((a, b) => {
				return b - a
			});

			consoleDebug.debug(`[subforums]`, 'length:', fids.length);

			await _fn_forums(array_unique(fids))
				.tap(async (ls2) => {

					await fs.outputJSON(path.join(__root, 'data', `topforums.json`), ls.reduce((a, b) => {

						a[b.fid] = b;

						return a
					}, {} as any), outputJSONOptions);

					await fs.outputJSON(path.join(__root, 'data', `subforums.json`), ls2.reduce((a, b) => {

						a[b.fid] = b;

						return a
					}, {} as any), outputJSONOptions);

					ls.push(...ls2);

				})
			;

			return ls;
		})
	;

	function _fn_forums(fids: number[])
	{
		return Bluebird.resolve(fids)
			.mapSeries(async (fid) => {

				consoleDebug.debug(`[forum]`, fid);

				let data = await api.forum({
					fid,
				});

				await fs.outputJSON(path.join(__root, 'data/fid', `${fid}.json`), data, outputJSONOptions);

				return data
			})
		;
	}

	//await fs.outputJSON(file, dataNew, outputJSONOptions);

})();
