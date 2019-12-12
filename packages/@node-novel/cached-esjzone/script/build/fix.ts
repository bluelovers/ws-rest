/**
 * Created by user on 2019/11/24.
 */
import fs, { readJSON, writeJSON } from 'fs-extra';
import cacheFilePaths, { cacheFileInfoPath } from '../util/files';
import { IESJzoneRecentUpdateCache } from 'esjzone-api/lib/types';
import Bluebird from 'bluebird';
import { consoleDebug, getApiClient } from '../util';

export default (async () =>
{
	const { api, saveCache } = await getApiClient();

	let recentUpdate = await readJSON(cacheFilePaths.recentUpdate) as IESJzoneRecentUpdateCache;
	let listCache = await readJSON(cacheFilePaths.task001) as Record<string, number>;

	let recentUpdateDay = await api.recentUpdateDay();
	let ids: string[] = [];

	Object.entries(recentUpdateDay.summary)
		.forEach(([id, timestamp]) => {

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

})();
