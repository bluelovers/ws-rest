/**
 * Created by user on 2019/11/24.
 */
import fs, { readJSON, writeJSON } from 'fs-extra';
import cacheFilePaths, { cacheFileInfoPath } from '../util/files';
import {
	IESJzoneRecentUpdateCache,
	IESJzoneRecentUpdateDay,
	IESJzoneRecentUpdateRow,
	IESJzoneRecentUpdateRowBook,
} from 'esjzone-api/lib/types';
import Bluebird from 'bluebird';
import { consoleDebug, getApiClient } from '../util';
import { lazyRun } from '@node-novel/site-cache-util/lib/index';
import orderBy from 'lodash/orderBy';
import FastGlob from '@bluelovers/fast-glob/bluebird';
import { join } from 'path';
import { dirname } from 'path';
import { outputJSONLazy } from '@node-novel/site-cache-util/lib/fs';
import { basename } from 'upath2';
import { _fixCoverUrl } from 'esjzone-api/lib/util/site';

export default lazyRun(async () =>
{

	const { api, saveCache } = await getApiClient();

	let recentUpdate = await readJSON(cacheFilePaths.recentUpdate) as IESJzoneRecentUpdateCache;
	let listCache = await readJSON(cacheFilePaths.task001).catch(e =>
	{
		return {}
	}) as Record<string, number>;
	let recentUpdateDayOld = await readJSON(cacheFilePaths.recentUpdateDay).catch(e => null) as IESJzoneRecentUpdateDay;

	let recentUpdateDay: IESJzoneRecentUpdateDay = await api.recentUpdateDay();
	let ids: string[] = [];

	if (recentUpdateDayOld && recentUpdateDayOld.data && recentUpdateDayOld.summary)
	{
		Object.entries(recentUpdateDay.data)
			.forEach(([t, list]) =>
			{

				let old = recentUpdateDayOld.data[t];

				if (old)
				{
					// @ts-ignore
					let ls = list.concat(old);

					ls = Object.values(ls.reduce((a, v) =>
					{

						if (!a[v.id])
						{
							a[v.id] = v;
						}

						return a;
					}, {} as Record<string | number, IESJzoneRecentUpdateRow>));

					recentUpdateDay.data[t] = orderBy(ls, ["id"], ["asc"]);
				}

			})
		;

		recentUpdateDay.summary = Object.entries(recentUpdateDay.summary)
			.reduce((a, [k, v]) =>
			{

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

	await FastGlob.async([
			'*.json',
		], {
			cwd: join(dirname(cacheFilePaths.infoPack), 'info'),
			absolute: true,
		})
		.mapSeries(async (file) =>
		{
			let bool: boolean;

			let row: IESJzoneRecentUpdateRowBook = await readJSON(file);

			row.links = row.links?.filter?.(item =>
			{
				if ('name' in item && !item.name?.length)
				{
					delete item.name;
					bool = true;
				}

				if (!item.href.length || item.href === 'https://www.esjzone.cc/tags//')
				{
					bool = true;

					return false
				}

				return true;
			})

			if (row.cover !== (row.cover = _fixCoverUrl(row.cover)))
			{
				bool = true;
			}

			if (bool)
			{
				consoleDebug.success(`fix`, basename(file), row.name);
				return outputJSONLazy(file, row)
			}
			else
			{
				consoleDebug.gray.info(`checked`, basename(file), row.name);
			}
		})
	;

}, {
	pkgLabel: __filename,
});
