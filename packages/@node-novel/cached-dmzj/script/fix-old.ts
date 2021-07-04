import path from "path";
import { consoleDebug, __root, getDmzjClient } from './util';
import { readJSON, outputJSON, writeJSON } from 'fs-extra';
import Bluebird from 'bluebird-cancellation';
import {
	IDmzjClientNovelRecentUpdateAll,
	IDmzjNovelInfo,
	IDmzjNovelInfoRecentUpdateRow,
	IDmzjNovelInfoWithChapters,
} from 'dmzj-api/lib/types';
import { fixDmzjNovelInfo, fixDmzjNovelTags, trimUnsafe } from 'dmzj-api/lib/util';
import FastGlob from '@bluelovers/fast-glob/bluebird';
import { array_unique_overwrite } from 'array-hyper-unique';
import sortObject from 'sort-object-keys2';
import cacheFilePaths from './util/files';

export default (async () =>
{
	const file = cacheFilePaths.recentUpdate;
	const file2 = cacheFilePaths.task001;

	const recentUpdate = await Bluebird
		.resolve<IDmzjClientNovelRecentUpdateAll>(readJSON(file))
		.then(async (data: IDmzjClientNovelRecentUpdateAll) =>
		{

			data.list = data.list.map(fixDmzjNovelInfo);

			await outputJSON(file, data, {
				spaces: 2,
			});

			return data.list
				.reduce((a, b) => {

					a[b.id] = b;

					return a
				}, {} as Record<number, IDmzjNovelInfoRecentUpdateRow>)
		})
	;

	const taskList: Record<number, number> = await (readJSON(file2)
		.catch(e => {})) || {}
	;

	await FastGlob.async([
			'*.json',
		], {
			cwd: path.join(__root, 'data', 'novel/info'),
			absolute: true,
		})
		.each(async (file) => {

			let v: IDmzjNovelInfoWithChapters = await readJSON(file).then(fixDmzjNovelInfo);

			const { id, last_update_time } = v;

			if (!taskList[id])
			{
				if (recentUpdate[id]?.last_update_time === last_update_time)
				{
					consoleDebug.debug(`taskList:update`, id, taskList[id], '=>', last_update_time, v.name)
					taskList[id] = last_update_time
				}
			}

			return writeJSON(file, v, {
				spaces: 2,
			})

		})
	;

	await writeJSON(file2, taskList, {
		spaces: 2,
	})

})();

