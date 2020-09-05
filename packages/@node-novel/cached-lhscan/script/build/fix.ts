
import { console, consoleDebug, lazyRun } from '@node-novel/site-cache-util/lib/index';
import { outputJSON, readJSON } from 'fs-extra';
import { join, relative } from 'upath2';
import { __root, getApiClient } from '../util';
import cacheFilePaths, { cacheFileInfoPath } from '../util/files';
import Bluebird from 'bluebird';
import { IMangaDataMetaPop, IMangaList, IMangaListRow, IMangaListRowWithExtra } from 'lhscan-api/lib/types';
import { outputJSONLazy } from '@node-novel/site-cache-util/lib/fs';

export default lazyRun(async () =>
{

	const file = join(cacheFilePaths.dirDataRoot, 'list-cache.json');

	let listCache = await readJSON(file)
		.catch(e => ({} as any)) as Record<string, IMangaListRowWithExtra>
	;

	Object.entries(listCache)
		.forEach(([id, data]) => {

			if (!data.id_key?.length)
			{
				console.red.log(`[delete]`, id, data.title)
				delete listCache[id]
			}

		})
	;

	await outputJSONLazy(file, listCache)

}, {
	pkgLabel: __filename,
});
