import { __root, getApiClient, console, consoleDebug } from '../util';
import fs, { readJSON } from 'fs-extra';
import { IESJzoneRecentUpdateCache } from 'esjzone-api/lib/types';
import Bluebird from 'bluebird';
import moment from 'moment';
import path from 'upath2';
import cacheFilePaths, { cacheFileInfoPath } from '../util/files';

const file = cacheFilePaths.recentUpdate;
const file1 = cacheFilePaths.task001;

(async () =>
{

	const { api, saveCache } = await getApiClient();

	api.cookiesRemoveTrack();

	let listCache = await readJSON(file1)
		.catch(e => ({} as Record<string, number>))
	;

	let novelList = await (fs.readJSON(file) as PromiseLike<IESJzoneRecentUpdateCache>)
	;

	let _cache = {} as Record<'copyright_remove', Record<string, string>>;

	let index = 1;

	await Bluebird
		.resolve(novelList.data)
		.mapSeries(async (row) =>
		{
			let { id, last_update_time } = row;

			if (listCache[id] != last_update_time || listCache[id] == null)
			{
				let _file = cacheFileInfoPath(id);

				consoleDebug.debug(index, id, row.name, moment.unix(last_update_time).format());

				return api.bookInfo(id)
					.tap(async (data) =>
					{

						index++;

						listCache[id] = Math.max(data.last_update_time, last_update_time, 0);

						if (!data.last_update_time && listCache[id])
						{
							data.last_update_time = listCache[id];
						}

						return Bluebird.all([
							fs.outputJSON(_file, data, {
								spaces: 2,
							}),
						])
					})
					.tap(async (r) => {

						if ((index % 10) == 0)
						{
							await _saveDataCache();

							api.cookiesRemoveTrack();
						}

						if ((index % 100) == 0)
						{
							await saveCache();
						}

					})
					;
			}
		})
		.catch(e => console.error(e))
	;

	await _saveDataCache();

	await saveCache();

	function _saveDataCache()
	{
		return Bluebird.all([
			fs.outputJSON(file1, listCache, {
				spaces: 2,
			})
				.then(e => {
					consoleDebug.info(`outputJSON`, path.relative(__root, file1));
					return e;
				})
			,
		]);
	}

})();

