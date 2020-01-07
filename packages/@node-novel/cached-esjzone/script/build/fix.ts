/**
 * Created by user on 2019/11/24.
 */
import fs, { readJSON, writeJSON } from 'fs-extra';
import cacheFilePaths, { cacheFileInfoPath } from '../util/files';
import { IESJzoneRecentUpdateCache, IESJzoneRecentUpdateDay, IESJzoneRecentUpdateRow } from 'esjzone-api/lib/types';
import Bluebird from 'bluebird';
import { consoleDebug, getApiClient } from '../util';
import { lazyRun } from '@node-novel/site-cache-util/lib/index';

export default lazyRun(async () =>
{

	const { api, saveCache } = await getApiClient();

	let recentUpdate = await readJSON(cacheFilePaths.recentUpdate) as IESJzoneRecentUpdateCache;
	let listCache = await readJSON(cacheFilePaths.task001).catch(e => {
		return {}
	}) as Record<string, number>;
	let recentUpdateDayOld = await readJSON(cacheFilePaths.recentUpdateDay).catch(e => null) as IESJzoneRecentUpdateDay;

	let recentUpdateDay = await api.recentUpdateDay();
	let ids: string[] = [];

	if (recentUpdateDayOld && recentUpdateDayOld.data && recentUpdateDayOld.summary)
	{
		Object.entries(recentUpdateDay.data)
			.forEach(([t, list]) =>
			{

				let old = recentUpdateDayOld.data[t];

				if (old)
				{
					let ls = list.concat(old);

					ls = Object.values(ls.reduce((a, v) => {

						if (!a[v.id])
						{
							a[v.id] = v;
						}

						return a;
					}, {} as Record<string | number, IESJzoneRecentUpdateRow>))

					recentUpdateDay.data[t] = ls;
				}

			})
		;

		recentUpdateDay.summary = Object.entries(recentUpdateDay.summary)
			.reduce((a, [k, v]) => {

				let old = recentUpdateDayOld.summary[k];

				if (old && old > v)
				{
					v = old;
				}

				a[k] = v;

				return a
			}, {} as IESJzoneRecentUpdateDay["summary"])
		;
	}

	Object.entries(recentUpdateDay.summary)
		.forEach(([id, timestamp]) =>
		{

			if (typeof listCache[id] === 'undefined')
			{
				ids.push(id);
			}

			if (listCache[id] != timestamp)
			{
				listCache[id] = null;
			}

		})
	;

	await Bluebird.all([
		writeJSON(cacheFilePaths.recentUpdateDay, recentUpdateDay, {
			spaces: 2,
		}),
		writeJSON(cacheFilePaths.task001, listCache, {
			spaces: 2,
		}),
	]);

}, {
	pkgLabel: __filename,
});
