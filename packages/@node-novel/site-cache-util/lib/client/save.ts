import { AbstractHttpClient } from 'restful-decorator/lib';
import { ICreatePkgCachePath, ICreatePkgCachePathMap } from '../files';
import { getAxiosCacheAdapter } from 'restful-decorator/lib/decorators/config/cache';
import fs from 'fs-extra';
import { consoleDebug, console } from '../index';
import { exportCache, IBaseCacheStore, importCache, processExitHook } from 'axios-cache-adapter-util';

export async function _setupCacheFile(opts: {
	api: AbstractHttpClient,
	saveCacheFileBySelf?: boolean,
	__path: ICreatePkgCachePath<ICreatePkgCachePathMap, any>
})
{
	const { api, saveCacheFileBySelf, __path } = opts;
	const { cacheFilePaths } = __path;

	const store = getAxiosCacheAdapter(api).store as IBaseCacheStore;

	const cacheFile = cacheFilePaths.axiosCacheFile;

	const now = Date.now() + 3600;

	await fs.readJSON(cacheFile)
		.catch(e =>
		{
			return {}
		})
		.then(async (json) =>
		{

			let len = await store.length();

			await importCache(store, json, {
				importFilter(k, v)
				{
					if (now >= v.expires)
					{
						//v.expires = now;
					}

					let { status } = v.data;

					if (status != 200)
					{
						consoleDebug.debug(`[importCache]`, String(status).padStart(3, '0'), k);
					}

					return v;
				},
			});

			let len2 = await store.length();

			console.magenta.log(`before: ${len}`, `after: ${len2}`);
		})
	;

	function saveCache()
	{

		// @ts-ignore
		if (typeof api._serialize === 'function')
		{
			// @ts-ignore
			if (typeof api.cookiesRemoveTrack === 'function')
			{
				// @ts-ignore
				api.cookiesRemoveTrack();
			}

			// @ts-ignore
			let json = api._serialize();

			//consoleDebug.dir(json);

			fs.writeJSONSync(cacheFilePaths.cookiesCacheFile, json, {
				spaces: 2,
			})
		}

		return exportCache(store, (json) =>
		{
			fs.outputJSONSync(cacheFile, json, {
				//spaces: 2,
			});

			console.magenta.debug(`[Cache]`, Object.keys(json).length, `saved`, __path.relative(cacheFile));

		})
	}

	if (!saveCacheFileBySelf)
	{
		await processExitHook(() =>
		{
			console.magenta.success(`processExitHook`);
			return saveCache();
		});
	}

	return saveCache
}
