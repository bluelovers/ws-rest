/**
 * Created by user on 2019/11/24.
 */
import fs, { readJSON, writeJSON } from 'fs-extra';
import cacheFilePaths, { cacheFileInfoPath } from '../util/files';
import { IWenku8RecentUpdateCache, IWenku8RecentUpdateRowBookWithChapters } from 'wenku8-api/lib/types';
import Bluebird from 'bluebird';
import { consoleDebug } from '../util';
import { lazyRun } from '@node-novel/site-cache-util/lib/index';
import path from 'path';
import FastGlob from '@bluelovers/fast-glob/bluebird';
import { trimWithZeroWidth } from 'zero-width';

export default lazyRun(async () => {

	let recentUpdate = await readJSON(cacheFilePaths.recentUpdate) as IWenku8RecentUpdateCache;
	let task001 = await readJSON(cacheFilePaths.task001) as Record<string, number>;

	let max_last_update_time = recentUpdate.last_update_time;

	await Bluebird
		.resolve(recentUpdate.data)
		.each(async (row) => {

			let { last_update_time, id, cid, last_update_chapter_name } = row;

			let _file = cacheFileInfoPath(id);

			let info = await readJSON(_file).catch(e => null) as IWenku8RecentUpdateRowBookWithChapters;

			if (info == null) return;

			let _changed = false;

			if (!info.last_update_time && !info.copyright_remove)
			{
				info.copyright_remove = true;
				_changed = true;
			}

			last_update_time = Math.max(last_update_time, info.last_update_time);

			if (last_update_time != info.last_update_time)
			{
				info.last_update_time = last_update_time;
				_changed = true;
			}
			else
			{
				task001[id] = last_update_time;
			}

			row.last_update_time = last_update_time;

			max_last_update_time = Math.max(max_last_update_time, last_update_time);

			if (last_update_chapter_name != info.last_update_chapter_name)
			{
				if (!info.last_update_chapter_name)
				{
					info.last_update_chapter_name = last_update_chapter_name;
					_changed = true;
				}

				if (!last_update_chapter_name)
				{
					row.last_update_chapter_name = last_update_chapter_name;
				}
			}

			if (_changed)
			{
				consoleDebug.info(`[fix]`, id, info.name);

				await writeJSON(_file, info, {
					spaces: 2,
				})
			}
		})
	;

	await FastGlob.async([
			'*.json',
		], {
			cwd: path.join(cacheFilePaths.dirDataRoot, 'novel/info'),
			absolute: true,
		})
		.each(async (file) =>
		{
			let novel: IWenku8RecentUpdateRowBookWithChapters = await readJSON(file);

			let old = novel.desc;

			novel.desc = trimWithZeroWidth(old);

			if (novel.desc !== old)
			{
				console.log(`fix`, novel.id, novel.name)

				return writeJSON(file, novel, {
					spaces: 2,
				})
			}
		})
	;

	await writeJSON(cacheFilePaths.recentUpdate, recentUpdate, {
		spaces: 2,
	});

	await writeJSON(cacheFilePaths.task001, task001, {
		spaces: 2,
	});

}, {
	pkgLabel: __filename
});
