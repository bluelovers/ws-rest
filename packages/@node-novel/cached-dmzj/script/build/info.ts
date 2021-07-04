/**
 * Created by user on 2019/7/28.
 */

import {
	AxiosAdapter,
	AxiosError,
	AxiosInstance,
	AxiosPromise,
	AxiosRequestConfig,
	AxiosResponse,
	AxiosStatic,
} from 'axios';
import { DmzjClient } from 'dmzj-api';
import { __root, console, consoleDebug, getDmzjClient, trim } from '../util';
import path from "upath2";
import { outputJSON, readJSON } from 'fs-extra';
import Bluebird from 'bluebird';
import { IDmzjNovelInfo, IDmzjNovelInfoWithChapters } from 'dmzj-api/lib/types';
import { moment, toMoment, unixMoment } from '@node-novel/site-cache-util/lib/moment';
import { SymSelf } from 'restful-decorator/lib/helper/symbol';
import { isResponseFromAxiosCache } from '@bluelovers/axios-util';
import { lazyRun } from '@node-novel/site-cache-util/lib/index';
import cacheFilePaths from '../util/files';
import { freeGC } from 'free-gc';

export default lazyRun(async () => {

	const { api, saveCache } = await getDmzjClient();

	const file = cacheFilePaths.recentUpdate;
	const file2 = cacheFilePaths.task001;

	let novelList = await (readJSON(file)
		.catch(e => null) as ReturnType<typeof api.novelRecentUpdateAll>)
	;

	const taskList: Record<number, number> = await (readJSON(file2)
		.catch(e => {})) || {}
	;

	const updatedList: Record<number, IDmzjNovelInfoWithChapters> = {};

	let jjj = 0;
	let delay_i = 0;

	let _do = true;

	await Bluebird
		.resolve(novelList.list)
		.filter(v => !taskList[v.id])
		.tap(list => {
			consoleDebug.info(`發現`, list.length, `個小說待處理`);
		})
		.mapSeries(async (v, index, length) =>
		{

			if (_do && !taskList[v.id])
			{
				freeGC();

				let fromCache: boolean;

				consoleDebug.debug(`novelInfoWithChapters`, v.id, v.name);

				let info = await api.novelInfoWithChapters(v.id)
					.catch((e: AxiosError) =>
					{

						_do = false;

						consoleDebug.error(v.id, v.name, e.message);

						console.dir(e.request);
						console.dir(e.config);

						return null as IDmzjNovelInfoWithChapters
					})
					.tap(function (this: DmzjClient, data)
					{
						if (isResponseFromAxiosCache(data[SymSelf].$response) || isResponseFromAxiosCache(this.$response))
						{
							fromCache = true;
						}
					})
				;

				if (info && info.id == v.id)
				{
					(fromCache ? consoleDebug.gray : consoleDebug).success('[' + String(++jjj)
						.padStart(4, '0') + '/' + String(length)
						.padStart(4, '0') + ']', v.id, trim(v.name), moment.unix(v.last_update_time)
						.format(), trim(v.last_update_volume_name), trim(v.last_update_chapter_name));

					let _file = path.join(__root, 'data', 'novel/info', `${v.id}.json`);

					await outputJSON(_file, info, {
						spaces: 2,
					});

					updatedList[v.id] = info;

					taskList[v.id] = Math.max(v.last_update_time, info.last_update_time);

					if (!fromCache)
					{
						if (!(index % 5))
						{
							await _saveCache();
						}
						else
						{
							await _saveCacheTaskList();
						}

						//let delay = Math.min(10000 + Math.min(index, 15) * 1000 * Math.random(), 20 * 1000);
						let delay = Math.min(Math.min(++delay_i, 15) * 1000 * Math.random(), 5 * 1000);

						consoleDebug.debug(`delay:`, delay);
						await Bluebird.delay(delay);
					}
				}
				else
				{
					_do = false;
				}
			}

		})
		.catch(e => null)
		.tap(v =>
		{
			consoleDebug.info(`結束抓取小說資料`);
		})
	;

	await Bluebird
		.resolve(Object.entries(updatedList))
		.each(([novel_id, v]) =>
		{

			console.info(novel_id.toString().padStart(4, '0'), trim(v.name), moment.unix(v.last_update_time)
				.format(), trim(v.last_update_volume_name), trim(v.last_update_chapter_name))

		})
		.tap(ls =>
		{
			console.info(`本次總共更新`, ls.length)
		})
	;

	await _saveCache();

	function _saveCacheTaskList()
	{
		return outputJSON(file2, taskList, {
			spaces: 2,
		})
	}

	function _saveCache()
	{
		return Promise.all([
			_saveCacheTaskList(),
			saveCache(),
		])
	}

}, {
	pkgLabel: __filename
});

