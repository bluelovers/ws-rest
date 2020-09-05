import { console, consoleDebug, lazyRun } from '@node-novel/site-cache-util/lib/index';
import { __root, getApiClient } from '../util';
import cacheFilePaths, { cacheFileInfoPath } from '../util/files';
import fs, { readJSON } from 'fs-extra';
import { join, relative } from 'upath2';
import { IDataWithLastUpdate, IMangaData, IMangaDataMetaPop, IMangaListRowWithExtra } from 'lhscan-api/lib/types';
import Bluebird from 'bluebird';
import { outputJSONLazy } from '@node-novel/site-cache-util/lib/fs';

const file_task001 = cacheFilePaths.task001;
const file = join(cacheFilePaths.dirDataRoot, 'list-cache.json');

export default lazyRun(async () =>
{

	const { api, saveCache } = await getApiClient();

	let taskCache = await readJSON(file_task001)
		.catch(e => ({} as Record<string, number>))
	;

	let listCache = await readJSON(file)
		.catch(e => ({} as any)) as Record<string, IMangaListRowWithExtra>
	;

	let changed: boolean;
	let idx = 0;

	let list = Object.values(listCache);

	await Bluebird.resolve(list)
		.mapSeries(async (row, index) =>
		{

			let { id, id_key, last_update } = row;

			if (!id_key?.length)
			{
				consoleDebug.red.log(`[error]`, index, '/', list.length, id, id_key, row.title);
				return;
			}

			let _file = cacheFileInfoPath(id);

			consoleDebug.log(index, '/', list.length, id, id_key, row.title);

			let data: IDataWithLastUpdate<IMangaData, Pick<IMangaDataMetaPop, 'id'>> = {
				id,
				id_key,
			} as any;

			let old = await readJSON(_file).catch(err => void 0) as typeof data;

			if (last_update !== taskCache[id] || taskCache[id] === null || last_update !== old?.last_update)
			{
				console.grey.log(index, '/', list.length, id, id_key, row.title);

				consoleDebug.debug(`[update]`, id, row.title, [last_update, taskCache[id], old?.last_update])

				data = await Bluebird.props({
						ret: api.manga(id_key),
						meta: api.mangaMetaPop(row.id),
					})
					.then((result) =>
					{

						let { last_update } = result.meta

						return {
							...data,
							...result.ret,
							id,
							last_update,
						}
					})
				;

				if (data.last_update > last_update)
				{
					row.last_update = data.last_update;
					row.last_chapter = data.last_chapter;

					changed = true;
				}

				taskCache[id] = row.last_update;

				await outputJSONLazy(_file, data);

				if ((++idx % 10) === 0)
				{
					await _saveDataCache();
				}
			}
			else
			{
				console.grey.log(index, '/', list.length, id, id_key, row.title);
			}

		})
	;

	await _saveDataCache();

	await saveCache();

	function _saveDataCache()
	{
		return Bluebird.all([
			changed && outputJSONLazy(file, listCache)
				.then(e =>
				{
					consoleDebug.info(`outputJSON`, relative(__root, file));
					return e;
				})
			,
			outputJSONLazy(file_task001, taskCache)
				.then(e =>
				{
					consoleDebug.info(`outputJSON`, relative(__root, file_task001));
					return e;
				})
			,
		]);
	}

}, {
	pkgLabel: __filename,
});
