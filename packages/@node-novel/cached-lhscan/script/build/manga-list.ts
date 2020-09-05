import { console, consoleDebug, lazyRun } from '@node-novel/site-cache-util/lib/index';
import { outputJSON, readJSON } from 'fs-extra';
import { join, relative } from 'upath2';
import { __root, getApiClient } from '../util';
import cacheFilePaths, { cacheFileInfoPath } from '../util/files';
import Bluebird from 'bluebird';
import { IMangaDataMetaPop, IMangaList, IMangaListRow, IMangaListRowWithExtra } from 'lhscan-api/lib/types';
import { outputJSONLazy } from '@node-novel/site-cache-util/lib/fs';

const file = join(cacheFilePaths.dirDataRoot, 'list-cache.json');
const file1 = join(cacheFilePaths.dirTempRoot, 'process-cache.json');

export default lazyRun(async () =>
{

	const { api, saveCache } = await getApiClient();

	let listCache = await readJSON(file)
		.catch(e => ({} as any)) as Record<string, IMangaListRowWithExtra>
	;

	let processCache = await readJSON(file1)
		.catch(e => ({} as any)) as {

			last_page: number,
			last_page_max: number,

		}
	;

	console.dir(processCache)

	let page = processCache.last_page;
	let page_max = processCache.last_page_max;

	let ret = await api.mangaList({
		page: 1,
	});

	await _handleMangaList(ret);

	if (ret.page_max != page_max)
	{
		let max = Math.max(ret.page_max || page_max, 1);
		let diff = Math.abs(max - page_max);

		page_max = max;

		if (!page)
		{
			page = ret.page_max
		}
		else
		{
			page = Math.max(page, page + diff);
		}

		page = Math.max(Math.min(page, page_max), 1);

		ret = await api.mangaList({
			page,
		});

		await _handleMangaList(ret);
	}
	else
	{
		page_max = Math.max(ret.page_max || page_max, 1);
		page ??= page_max;
	}

	page = Math.max(Math.min(page, page_max), 1);

	processCache.last_page = page;
	processCache.last_page_max = page_max;

	console.dir(processCache)

	await Promise.all([
		outputJSONLazy(file, listCache),
		outputJSONLazy(file1, processCache),
		saveCache(),
	])

	while (page > 1)
	{
		try
		{
			ret = await api.mangaList({
				page,
			});

			await _handleMangaList(ret);

			processCache.last_page = page;

			await Promise.all([
				outputJSONLazy(file, listCache),
				outputJSONLazy(file1, processCache),
				saveCache(),
			])

			page = Math.max(1, --page)
		}
		catch (e)
		{
			break;
		}
	}

	console.dir(processCache)

	await _saveDataCache();

	await saveCache();

	function _handleMangaList(ret: IMangaList)
	{
		console.log(ret.page, '/', ret.page_max, ret.list.length)

		return Bluebird.resolve(ret.list)
			.each(async (row: IMangaListRowWithExtra) =>
			{

				const id = row.id;

				let old = listCache[id];
				let bool: boolean;
				let last_update = old?.last_update;

				if (typeof old === 'undefined')
				{
					bool = true;
				}
				else if (row.last_chapter?.chapter_id !== old?.last_chapter?.chapter_id)
				{
					bool = true;
				}
				else if (last_update !== row.last_update)
				{
					bool = true;
				}

				if (bool)
				{
					await api.mangaMetaPop(row.id)
						.then(meta => {
							row.last_update = meta.last_update;
							row.other_names = meta.other_names;
						})
					;
				}

				listCache[id] = row;
			})
		;
	}

	function _saveDataCache()
	{
		return Bluebird.all([
			outputJSONLazy(file, listCache)
				.then(e =>
				{
					consoleDebug.info(`outputJSON`, relative(__root, file));
					return e;
				})
			,
			outputJSONLazy(file1, processCache)
				.then(e =>
				{
					consoleDebug.info(`outputJSON`, relative(__root, file1));
					return e;
				})
			,
		]);
	}

}, {
	pkgLabel: __filename,
});
