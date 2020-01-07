import { AbstractHttpClient } from 'restful-decorator/lib';
import { ICreatePkgCachePath, ICreatePkgCachePathMap } from '../files';
import { getAxiosCacheAdapter } from 'restful-decorator/lib/decorators/config/cache';
import fs from 'fs-extra';
import { consoleDebug, console } from '../index';
import { exportCache, IBaseCacheStore, importCache, processExitHook, ICacheStoreJson } from 'axios-cache-adapter-util';

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
		.then(async (json: ICacheStoreJson) =>
		{
			let len = await store.length();

			consoleDebug.debug(__path.relative(cacheFile), 'length:', Object.keys(json).length);

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

	let len = await store.length();

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

			let len2 = Object.keys(json).length;

			console.magenta.debug(`[Cache]`, len2, `saved`, __path.relative(cacheFile));

			console.red.log(`before: ${len}`, `after: ${len2}`);

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
