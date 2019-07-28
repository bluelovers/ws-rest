/**
 * Created by user on 2019/7/28.
 */

import { __root, console, consoleDebug, getDmzjClient, trim } from '../util';
import path from "path";
import fs from 'fs-extra';
import Bluebird from 'bluebird';
import { IDmzjNovelInfo, IDmzjNovelInfoWithChapters } from 'dmzj-api/lib/types';
import moment from 'moment';

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

	const updatedList: Record<number, IDmzjNovelInfoWithChapters> = {};

	let _do = true;

	await Bluebird
		.resolve(novelList.list)
		.mapSeries(async (v) => {

			if (_do && !taskList[v.id])
			{
				let info = await api.novelInfoWithChapters(v.id).catch(e => {

					_do = false;

					consoleDebug.error(v.id, v.name, (e as Error).message);

					return null as IDmzjNovelInfoWithChapters
				});

				if (info && info.id == v.id)
				{
					consoleDebug.success(v.id, trim(v.name), moment.unix(v.last_update_time).format(), trim(v.last_update_volume_name), trim(v.last_update_chapter_name));

					let _file = path.join(__root, 'data', 'novel/info', `${v.id}.json`);

					await fs.outputJSON(_file, info, {
						spaces: 2,
					});

					updatedList[v.id] = info;

					taskList[v.id] = Math.max(v.last_update_time, info.last_update_time);
				}
				else
				{
					_do = false;
				}
			}

		})
		.catch(e => null)
		.tap(v => {
			consoleDebug.info(`結束抓取小說資料`);
		})
	;

	await Bluebird
		.resolve(Object.entries(updatedList))
		.each(([novel_id, v]) => {

			console.info(novel_id.toString().padStart(4, '0'), trim(v.name), moment.unix(v.last_update_time).format(), trim(v.last_update_volume_name), trim(v.last_update_chapter_name))

		})
		.tap(ls => {
			console.info(`本次總共更新`, ls.length)
		})
	;

	await fs.outputJSON(file2, taskList, {
		spaces: 2,
	});

})();

