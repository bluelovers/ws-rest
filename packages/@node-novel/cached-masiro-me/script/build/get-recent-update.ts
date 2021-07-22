import { lazyRun } from '@node-novel/site-cache-util/lib/index';
import { getApiClient } from '../util';
import { cacheFilePaths } from '../util/files';
import { readJSON } from 'fs-extra';
import { IMasiroMeBookMini, IMasiroMeRecentUpdateAll } from 'masiro-me-api/lib/types';
import { outputJSONLazy } from '@node-novel/site-cache-util/lib/fs';

export default lazyRun(async () =>
{

	const { api, saveCache } = await getApiClient();

	const file_recentUpdate = cacheFilePaths.recentUpdate;
	const file_task001 = cacheFilePaths.task001;

	let recentUpdateList: IMasiroMeRecentUpdateAll = await readJSON(file_recentUpdate).catch(e => null);

	let cacheTask001: Record<string, number> = await readJSON(file_task001)
		.catch(e => ({}))
	;

	let maxPage = recentUpdateList?.end | 0;

	if (recentUpdateList)
	{
		if (recentUpdateList.end)
		{
			maxPage += 2
		}

		if (maxPage > recentUpdateList.pages)
		{
			maxPage = Math.max(maxPage, 5)
		}
	}

	await api.recentUpdateAll({
		start: 0,
		end: maxPage,
	})
		.then(async (data) => {

			if (recentUpdateList?.list?.length)
			{
				let cache = new Map<string, IMasiroMeBookMini>();

				let list = recentUpdateList.list.concat(data.list)
					.filter(novel => {

						if (cache.has(novel.id))
						{
							let old = cache.get(novel.id);

							if (old.last_update_name?.length && novel.last_update_name !== old.last_update_name)
							{
								cacheTask001[novel.id] = 0;
							}

							return false;
						}

						cache.set(novel.id, novel);

						return true;
					})
				;

				data.list = list;

			}

			recentUpdateList = data;
		})
	;

	return Promise.all([
		outputJSONLazy(file_recentUpdate, recentUpdateList),
		outputJSONLazy(file_task001, cacheTask001),
	])
}, {
	pkgLabel: __filename
})
