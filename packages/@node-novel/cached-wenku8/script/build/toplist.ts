/**
 * Created by user on 2019/7/7.
 */

import fs from 'fs-extra';
import path from 'upath2';
import { IDmzjNovelInfoRecentUpdateRow, IDmzjNovelInfoWithChapters } from 'dmzj-api/lib/types';
import { exportCache, importCache, processExitHook } from 'axios-cache-adapter-util';
import { getAxiosCacheAdapter } from 'restful-decorator/lib/decorators/config/cache';
import { IBaseCacheStore } from 'axios-cache-adapter-util';
import Bluebird from 'bluebird';
import { getApiClient, __root, console, consoleDebug } from '../util';
import { ITSUnpackedPromiseLike } from 'ts-type';
import { IWenku8RecentUpdateCache, IWenku8RecentUpdateRow } from 'wenku8-api/lib/types';
import { lazyRun } from '@node-novel/site-cache-util/lib/index';
import cacheFilePaths from '../util/files';
import { freeGC } from 'free-gc';

export default lazyRun(async () => {

	const { api, saveCache } = await getApiClient();

	const file = cacheFilePaths.recentUpdate;

	let novelList = await (fs.readJSON(file)
		.catch(e => null) as PromiseLike<IWenku8RecentUpdateCache>)
	;

	let page = 0;
	let pageTo = 0;
	let maxPage = novelList && novelList.end || 0;

	let API_METHOD: 'articleToplist' | 'articleList' = 'articleToplist';
	//API_METHOD = 'articleList';

	let data = await api[API_METHOD](++page);
	maxPage = data.end;

	let pageFrom = data.page;

	let { last_update_time } = data;
	let lastPage = page;

	let ids = [] as string[];

	let list: IWenku8RecentUpdateCache["data"] = data.data.slice();

	list.forEach(row => {
		ids.push(row.id);
	});

	let _do = true;

	while (_do)
	{
		lastPage = page++;

		consoleDebug.debug('page:', page);

		let ret = await api[API_METHOD](page)
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

		freeGC();

		if (!ret || lastPage == page || page == maxPage)
		{
			console.dir({
				ret,
				page,
				lastPage,
				maxPage,
			});

			_do = false;

			break;
		}

		if ((page - pageFrom) >= 5)
		{
			_do = false;
		}

	}

	let dataNewList = (novelList && novelList.data || [])
		.concat(list)
		.reduce((list, row) => {

			let old = list[row.id];

			if (!old || row.last_update_time > old.last_update_time)
			{
				list[row.id] = row;
			}

			last_update_time = Math.max(last_update_time, row.last_update_time);

			return list;
		}, {} as Record<string, IWenku8RecentUpdateRow>)
	;

	let listNew: IWenku8RecentUpdateCache["data"] = Object
		.values(dataNewList)
		.sort((a, b) => {
			//return b.last_update_time - a.last_update_time
			// @ts-ignore
			return b.id - a.id
		})
	;

	let dataNew: IWenku8RecentUpdateCache = {
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

}, {
	pkgLabel: __filename
});
