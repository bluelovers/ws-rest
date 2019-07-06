
import { AxiosRequestConfig } from '../types/axios';
import { AxiosAdapter } from 'axios';
import { setupCache, IAxiosCacheAdapterOptions, ISetupCache } from 'axios-cache-adapter';
import { defaultsDeep } from 'lodash';
import Bluebird from 'bluebird';

export { IAxiosCacheAdapterOptions, ISetupCache }

export type IAxiosCacheAdapterOptionsConfig = Pick<AxiosRequestConfig, 'cache' | 'clearCacheEntry'>;

export { setupCache }

export function setupCacheConfig(configInput: IAxiosCacheAdapterOptionsConfig)
{
	configInput = mixinCacheConfig(configInput);

	const cache = setupCache(configInput.cache);

	const config = {
		...(configInput as Omit<IAxiosCacheAdapterOptionsConfig, 'cache'>),

		adapter: Bluebird.method(cache.adapter) as AxiosAdapter,
	};

	// @ts-ignore
	delete config.cache;

	return {
		config,
		cache,
	}
}

export function mixinCacheConfig(config: IAxiosCacheAdapterOptionsConfig)
{
	if (typeof config.cache === 'object')
	{
		config.cache = defaultsDeep(config.cache, {
			exclude: {
				filter(res: any)
				{
					return res.status == 500;
				}
			}
		})
	}

	return config;
}

export default setupCacheConfig
