/**
 * Created by user on 2019/7/2.
 */
import { DmzjClient } from 'dmzj-api';
import fs from 'fs-extra';
import path from 'path';
import { IDmzjNovelInfoRecentUpdateRow, IDmzjNovelInfoWithChapters } from 'dmzj-api/lib/types';
import { exportCache, importCache, processExitHook } from 'axios-cache-adapter-util';
import { getAxiosCacheAdapter } from 'restful-decorator/lib/decorators/config/cache';
import { IBaseCacheStore } from 'axios-cache-adapter-util';
import Bluebird from 'bluebird';
import { getDmzjClient, __root, console, consoleDebug } from '../util';

export default (async () =>
{

	const { api, saveCache } = await getDmzjClient();

	const file = path.join(__root, 'data', 'novel/recentUpdate.json');
	const file2 = path.join(__root, 'test/temp', 'task001.json');

	let novelList = await (fs.readJSON(file)
		.catch(e => null) as ReturnType<typeof api.novelRecentUpdateAll>)
	;

	const taskList: Record<number, number> = await (fs.readJSON(file2)
		.catch(e => {})) || {}
	;

	let n = Infinity;
	let old_len = novelList && novelList.list && novelList.list!.length | 0 || 0;

	if (novelList && novelList.list && novelList.list!.length > 20 * 10)
	{
		n = 10;
	}

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

					if (!taskList[v.id])
					{
						taskList[v.id] = 0;
					}
					else if (taskList[v.id] && taskList[v.id] != v.last_update_time)
					{

						if (taskList[v.id] > v.last_update_time)
						{
							let _file = path.join(__root, 'data', 'novel/info', `${v.id}.json`);

							let json = await fs.readJSON(_file) as IDmzjNovelInfoWithChapters;

							if (json.last_update_time == taskList[v.id])
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
							}
							else
							{
								taskList[v.id] = 0;
							}
						}
						else
						{
							taskList[v.id] = 0;
						}
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

			console.dir({
				length,
				add: length - old_len,
			});

			return Bluebird.all([
				fs.outputJSON(file, data, {
					spaces: 2,
				}),
				fs.outputJSON(file2, taskList, {
					spaces: 2,
				}),
			])
		})
	;

})();
