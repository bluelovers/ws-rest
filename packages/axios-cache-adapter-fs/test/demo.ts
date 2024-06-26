
import { setupCache, ISetupCache } from 'axios-cache-adapter';
import Axios, { AxiosAdapter } from 'axios';
import { exportCache, importCache, processExitHook } from '../lib/index';
import fs from 'fs-extra';
import path from 'path';

(async () => {

	const saveCacheFileBySelf = true;

	let cache = setupCache({
		maxAge: 24 * 60 * 60 * 1000,
	});

	const cacheFile = path.join(__dirname, 'temp', 'axios.cache.json');

	await fs.readJSON(cacheFile)
		.catch(e => {
			return {}
		})
		.then(async (json) => {

			// @ts-ignore
			let len: number = await cache.store.length();

			await importCache(cache.store, json);

			// @ts-ignore
			let len2: number = await cache.store.length();

			console.log(`before: ${len}`, `after: ${len2}`);
		})
	;

	function saveCache()
	{
		return exportCache(cache.store, (json) => {
			fs.outputJSONSync(cacheFile, json, {
				spaces: 2,
			});

			console.debug(`[Cache]`, Object.keys(json).length, `saved`, cacheFile);

		})
	}

	if (!saveCacheFileBySelf)
	{
		await processExitHook(() => {
			return saveCache();
		});
	}

	let axios = Axios.create({
		adapter: cache.adapter as AxiosAdapter
	});

	await axios.get('https://github.com/RasCarlito/axios-cache-adapter')
		.then((ret) => {
			console.log(ret.status, ret.statusText);
			//console.dir(ret.headers);
		})
	;

	if (saveCacheFileBySelf)
	{
		await saveCache();
	}

})();
