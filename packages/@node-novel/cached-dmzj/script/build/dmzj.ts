/**
 * Created by user on 2019/7/2.
 */
import { DmzjClient } from 'dmzj-api';
import fs from 'fs-extra';
import path from 'path';
import { IDmzjNovelRecentUpdateRow } from 'dmzj-api/lib/types';
import { exportCache, importCache, processExitHook } from 'axios-cache-adapter-util';
import { getAxiosCacheAdapter } from 'restful-decorator/lib/decorators/config/cache';
import { IBaseCacheStore } from 'axios-cache-adapter-util';
import { getDmzjClient, __root } from '../util';

(async () => {

	const { api, saveCache } = await getDmzjClient();

	const file = path.join(__root, 'data', 'novel/recentUpdate.json');

	let novelList = await (fs.readJSON(file)
		.catch(e => null) as ReturnType<typeof api.novelRecentUpdateAll>)
	;

	let n = Infinity;
	let old_len = novelList.list!.length | 0;

	if (novelList && novelList.list && novelList.list!.length > 20 * 10)
	{
		//n = 5;
	}

	api.novelRecentUpdateAll(0, n)
		.then(data => {

			if (data == null)
			{
				return novelList
			}
			else if (novelList != null && (novelList.last_update_time != data.last_update_time || novelList.list.length != data.list.length))
			{
				let ls = (data.list || []).reduce((a, v: IDmzjNovelRecentUpdateRow) => {
					a[v.id] = v;

					return a;
				}, {} as Record<IDmzjNovelRecentUpdateRow["id"], IDmzjNovelRecentUpdateRow>);

				novelList.list
					.forEach(v => {
						if (!(v.id in ls))
						{
							data.list.push(v)
						}
				});
			}

			return data;
		})
		.tap((data) => {

			data.list.sort((a: IDmzjNovelRecentUpdateRow, b: IDmzjNovelRecentUpdateRow) => {
				return b.id - a.id
			});

			data.end = Math.max(data.end | 0, novelList.end | 0);
			data.last_update_time = Math.max(data.last_update_time | 0, novelList.last_update_time | 0);

			let length = data.list.length;

			console.dir({
				length,
				add: length - old_len,
			});

			return fs.outputJSON(file, data, {
				spaces: 2,
			})
		})
	;

})();
