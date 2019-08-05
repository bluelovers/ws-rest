
import { AxiosRequestConfig } from './index';
import { AxiosAdapter } from 'axios';
import { setupCache, IAxiosCacheAdapterOptions, ISetupCache } from 'axios-cache-adapter';
import { defaultsDeep } from 'lodash';
import Bluebird from 'bluebird';
import { ITSPartialPick } from 'ts-type';
import { IAxiosCacheAdapterOptionsConfig } from './types';

export { IAxiosCacheAdapterOptions, ISetupCache, IAxiosCacheAdapterOptionsConfig }

export { setupCache }

export function setupCacheConfig<T extends IAxiosCacheAdapterOptionsConfig | AxiosRequestConfig>(configInput: T)
{
	configInput = mixinCacheConfig(configInput);

	const cache = setupCache(configInput.cache);

	const config = {
		...(configInput as Omit<T, 'cache'>),

		adapter: Bluebird.method(cache.adapter) as AxiosAdapter,
	};

	// @ts-ignore
	delete config.cache;

	return {
		config,
		cache,
	}
}

export function mixinCacheConfig<T extends IAxiosCacheAdapterOptionsConfig>(config: T)
{
	if (config.cache != null && typeof config.cache === 'object')
	{
		config.cache = defaultsDeep(config.cache, {
			exclude: {
				filter(res: any)
				{
					return res.status >= 500;
				}
			}
		})
	}

	return config;
}

export default setupCacheConfig
