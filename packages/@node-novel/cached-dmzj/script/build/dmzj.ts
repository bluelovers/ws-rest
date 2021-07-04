/**
 * Created by user on 2019/7/2.
 */
import { DmzjClient } from 'dmzj-api';
import { outputJSON, readJSON } from 'fs-extra';
import path from 'path';
import { IDmzjNovelInfoRecentUpdateRow, IDmzjNovelInfoWithChapters } from 'dmzj-api/lib/types';
import { exportCache, importCache, processExitHook } from 'axios-cache-adapter-util';
import { getAxiosCacheAdapter } from 'restful-decorator/lib/decorators/config/cache';
import { IBaseCacheStore } from 'axios-cache-adapter-util';
import Bluebird from 'bluebird';
import { getDmzjClient, __root, console, consoleDebug } from '../util';
import { lazyRun } from '@node-novel/site-cache-util/lib/index';
import cacheFilePaths from '../util/files';

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

	let n = Infinity;
	let old_len = novelList?.list?.length | 0 || 0;

	if (novelList?.list?.length > 20 * 10)
	{
		n = 10;
	}

	consoleDebug.info(`novelRecentUpdateAll`, n);

	await api.novelRecentUpdateAll(0, n, {
			delay: 3000,
		})
		.then(async (data) =>
		{

			if (data == null)
			{
				return novelList
			}
			else if (novelList != null && (novelList.last_update_time != data.last_update_time || novelList.list.length != data.list.length))
			{

				let ls = await Bluebird
					.resolve(data.list || [])
					.reduce((a, v: IDmzjNovelInfoRecentUpdateRow) =>
					{
						a[v.id] = v;

						return a;
					}, {} as Record<IDmzjNovelInfoRecentUpdateRow["id"], IDmzjNovelInfoRecentUpdateRow>);

				novelList.list
					.forEach(v =>
					{
						if (!(v.id in ls))
						{
							data.list.push(v)
						}
					})
				;
			}

			return data;
		})
		.tap(async (data) => {

			data.list = await Bluebird
				.resolve(data.list)
				.map(async (v) => {

					if (taskList[v.id] > v.last_update_time)
					{
						let _file = path.join(__root, 'data', 'novel/info', `${v.id}.json`);

						let json = await readJSON(_file).catch(e => null) as IDmzjNovelInfoWithChapters;

						if (json && json.last_update_time == taskList[v.id])
						{
							Object
								.keys(v)
								.forEach((k) => {

									if (k in json)
									{
										// @ts-ignore
										v[k] = json[k];
									}

								})
							;

							return v;
						}
					}

					if (!taskList[v.id] || taskList[v.id] != v.last_update_time)
					{
						consoleDebug.debug(`taskList:add`, v.id, taskList[v.id], 'vs', v.last_update_time, v.name)
						taskList[v.id] = 0;
					}

					return v;
				})
			;

		})
		.tap((data) =>
		{

			data.list.sort((a: IDmzjNovelInfoRecentUpdateRow, b: IDmzjNovelInfoRecentUpdateRow) =>
			{
				return b.id - a.id
			});

			novelList = novelList || {} as any;

			data.end = Math.max(data.end | 0, novelList.end | 0);
			data.last_update_time = Math.max(data.last_update_time | 0, novelList.last_update_time | 0);

			let length = data.list.length;

			consoleDebug.dir({
				length,
				add: length - old_len,
			});

			return Bluebird.all([
				outputJSON(file, data, {
					spaces: 2,
				}),
				outputJSON(file2, taskList, {
					spaces: 2,
				}),
			])
		})
	;

}, {
	pkgLabel: __filename
});
