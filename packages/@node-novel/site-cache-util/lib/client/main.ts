import { AbstractHttpClient } from 'restful-decorator/lib';
import { ICreatePkgCachePath, ICreatePkgCachePathMap } from '../files';
import { LazyCookieJar } from 'lazy-cookies';
import { getResponseUrl } from '@bluelovers/axios-util/lib/index';
import { console, consoleDebug } from '..';
import {
	AxiosAdapter,
	AxiosError,
	AxiosInstance,
	AxiosPromise,
	AxiosRequestConfig,
	AxiosResponse,
	AxiosStatic,
} from 'axios';
import { dotValue } from '@bluelovers/axios-util';
import { existsSync, outputFile, readJSON } from 'fs-extra';
import { deserializeCookieJar } from 'restful-decorator-plugin-jsdom/lib/cookies';
import isCi from '../ci';
import importPassword from '../pass';
import { defaultsDeep } from 'lodash';
import { _setupCacheFile } from './save';
import { ITSResolvable } from 'ts-type';
import { freeGC } from 'free-gc';
import { resultToURL } from 'get-http-result-url';

export async function _getApiClient<T extends AbstractHttpClient>(opts: {
	api: T,
	ApiClient: {
		new(...argv: any): T
	},
	jar: LazyCookieJar,
	saveCache: () => void,
	__path: ICreatePkgCachePath<ICreatePkgCachePathMap, any>,
	apiOptions?: AxiosRequestConfig,
	setupCacheFile?(api: T, saveCacheFileBySelf?: boolean): ITSResolvable<() => void>,
	saveCacheFileBySelf?: boolean,
	envPrefix: string,
})
{
	let { api, jar, __path, saveCache, ApiClient, apiOptions, setupCacheFile, saveCacheFileBySelf } = opts;
	const { __root, cacheFilePaths } = __path;

	if (api == null)
	{
		let setting: AxiosRequestConfig = defaultsDeep(apiOptions || {}, {
			cache: {
				maxAge: 24 * 60 * 60 * 1000,
			},

			raxConfig: {
				retry: 1,
				retryDelay: 1000,

				onRetryAttempt: (err: AxiosError) =>
				{
					freeGC();

					let currentRetryAttempt = dotValue(err, 'config.raxConfig.currentRetryAttempt');

					consoleDebug.debug(`Retry attempt #${currentRetryAttempt}`, resultToURL(err?.response, {
						ignoreError: true,
					})?.href);
				},

			},

//			proxy: {
//				host: '49.51.155.45',
//				port: 8081,
//			},

		});

		//consoleDebug.dir(setting);

		const cookiesCacheFile = cacheFilePaths.cookiesCacheFile;

		consoleDebug.debug(`cookiesCacheFile`, cookiesCacheFile);

		if (existsSync(cookiesCacheFile))
		{
			consoleDebug.debug(`axios.cookies.json 已存在，嘗試載入內容`);

			api = await readJSON(cookiesCacheFile)
				.then(r => deserializeCookieJar(r))
				.then(_jar =>
				{
					if (_jar)
					{
						!isCi() && consoleDebug.debug(jar = _jar as LazyCookieJar);

						return new ApiClient({
							...setting,
							jar: _jar,
						})
					}
				})
				.catch(e =>
				{
					console.error(e);
					return null;
				})
			;
		}

		if (!api)
		{
			api = new ApiClient(setting);
		}

		if (typeof api._beforeStart === 'function')
		{
			await api._beforeStart();
		}

		// @ts-ignore
		if (typeof api.isLogin === 'function')
		{
			// @ts-ignore
			let isLogin = await api.isLogin()
				.catch((e: any) =>
				{
					console.error(`[isLogin]`, String(e))
					return null as any;
				})
			;
			console.magenta.info('isLogin', isLogin);

			// @ts-ignore
			if (!isLogin && typeof api.loginByForm === 'function')
			{
				consoleDebug.gray.info(`目前為未登入狀態，嘗試使用帳號密碼登入`);

				let { default: localPassword, DISABLE_LOGIN } = await importPassword({
					file: cacheFilePaths.passwordLocalFile,
					__root,
					envPrefix: opts.envPrefix,
				});

				console.log(`DISABLE_LOGIN`, DISABLE_LOGIN)

				if (!localPassword)
				{
					consoleDebug.red.info(`帳密不存在`);
				}
				else if (DISABLE_LOGIN)
				{
					consoleDebug.red.info(`[DISABLE_LOGIN] 選項已啟用，忽略使用帳密登入`);
				}
				else
				{
					// @ts-ignore
					await api.loginByForm({
							...localPassword,
						})
						// @ts-ignore
						.then(async (r) =>
						{
							console.dir(r)
							// @ts-ignore
							console.magenta.info('isLogin', await api.isLogin());
						})
						// @ts-ignore
						.catch(e =>
						{
							console.error(`[loginByForm]`, String(e))
							return null;
						})
					;
				}
			}
		}

		if (!setupCacheFile)
		{
			saveCache = await _setupCacheFile({
				api,
				saveCacheFileBySelf,
				__path,
			})
		}
		else
		{
			saveCache = await setupCacheFile(api);
		}
	}

	return {
		api, jar, saveCache,
	}
}
