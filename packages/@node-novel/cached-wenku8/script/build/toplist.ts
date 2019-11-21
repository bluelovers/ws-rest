/**
 * Created by user on 2019/7/7.
 */

import fs from 'fs-extra';
import path from 'path';
import { IDmzjNovelInfoRecentUpdateRow, IDmzjNovelInfoWithChapters } from 'dmzj-api/lib/types';
import { exportCache, importCache, processExitHook } from 'axios-cache-adapter-util';
import { getAxiosCacheAdapter } from 'restful-decorator/lib/decorators/config/cache';
import { IBaseCacheStore } from 'axios-cache-adapter-util';
import Bluebird from 'bluebird';
import { getApiClient, __root, console, consoleDebug } from '../util';
import { ITSUnpackedPromiseLike } from 'ts-type';

export default (async () =>
{
	const { api, saveCache } = await getApiClient();

	const file = path.join(__root, 'data', 'novel/recentUpdate.json');

	let novelList = await (fs.readJSON(file)
		.catch(e => null) as ReturnType<typeof api.articleToplist>)
	;


	let page = 0;
	let pageTo = 0;
	let maxPage = 0;

	let data = await api.articleToplist(++page);
	maxPage = data.end;

	let pageFrom = data.page;

	let { last_update_time } = data;
	let lastPage = page;

	let ids = [] as string[];

	let list: ITSUnpackedPromiseLike<ReturnType<typeof api.articleToplist>>["data"] = data.data.slice();

	list.forEach(row => {
		ids.push(row.id);
	});

	while (true)
	{
		lastPage = page++;

		consoleDebug.debug('page:', page);

		let ret = await api.articleToplist(page)
			.tap(data => {

				last_update_time = Math.max(last_update_time, data.last_update_time);

				page = data.page;

				data.data.forEach(row => {

					if (!ids.includes(row.id))
					{
						ids.push(row.id);

						list.push(row);
					}

				});

			})
			.catch(e => null)
		;

		if (!ret || lastPage == page || page == maxPage)
		{
			console.dir({
				ret,
				page,
				lastPage,
				maxPage,
			});

			break;
		}

	}

	let dataNewList = (novelList && novelList.data || [])
		.concat(list)
		.reduce((list, row) => {

			list[row.id] = row;

			last_update_time = Math.max(last_update_time, row.last_update_time);

			return list;
		}, {} as Record<string, any>)
	;

	let listNew = Object
		.values(dataNewList)
		.sort((a, b) => {
			return b.last_update_time - a.last_update_time
		})
	;

	let dataNew = {
		from: pageFrom,
		to: page,
		end: maxPage,
		last_update_time,
		size: listNew.length,
		data: listNew,
	};

	await fs.outputJSON(file, dataNew, {
		spaces: 2,
	});

})();
