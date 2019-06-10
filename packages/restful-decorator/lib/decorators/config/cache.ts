/**
 * Created by user on 2019/6/10.
 */

import 'reflect-metadata';
import { setupCache, IAxiosCacheAdapterOptions, ISetupCache } from 'axios-cache-adapter';
import Bluebird from 'bluebird';
import RequestConfig, { RequestConfigs } from './index';
import { AxiosRequestConfig } from '../../types/axios';
import { getMemberMetadata, IPropertyKey, setMemberMetadata, getMetadataLazy } from 'reflect-metadata-util';

export const SymAxiosCacheAdapter = Symbol('AxiosCacheAdapter');

export function CacheRequest(config: Pick<AxiosRequestConfig, 'cache' | 'clearCacheEntry'>)
{
	return function (target: any, propertyName?: IPropertyKey)
	{
		if (config.cache)
		{
			const cache = setupCache(config.cache);

			config = <AxiosRequestConfig>{
				...config,
				adapter: Bluebird.method(cache.adapter),
			};

			delete config.cache;

			setAxiosCacheAdapter(cache, target, propertyName)
		}

		return RequestConfigs(config)(target, propertyName);
	}
}

export function getAxiosCacheAdapter(target: any, propertyName?: IPropertyKey): ISetupCache
{
	return getMetadataLazy(SymAxiosCacheAdapter, target, propertyName)
}

export function setAxiosCacheAdapter(cache: ISetupCache, target: any, propertyName?: IPropertyKey)
{
	return setMemberMetadata(SymAxiosCacheAdapter, cache, target, propertyName);
}

export default CacheRequest;
