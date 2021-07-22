import md5 from 'md5'
import { serializeQuery } from 'axios-cache-adapter'
import { LazyURL } from 'lazy-url'
import { AxiosRequestConfig } from 'axios';
import { ITSPickExtra, ITSRequiredPick } from 'ts-type/lib/type/record';

declare module 'axios-cache-adapter'
{
	function serializeQuery(req: Pick<AxiosRequestConfig, 'params'>): string;
}

/**
 * bug fixed version of key
 *
 * @see https://github.com/RasCarlito/axios-cache-adapter/blob/master/src/cache.js#L66
 * @see https://github.com/RasCarlito/axios-cache-adapter/pull/250
 */
export function defaultAxiosCacheAdapterKeyFixed(req: AxiosRequestConfig)
{
	const url = new LazyURL(req.url, req.baseURL).toRealString();
	const key = url + serializeQuery(req)
	return req.data ? key + md5(req.data) : key
}

export function axiosCacheAdapterKeyExtra(cb: (req: AxiosRequestConfig) => ITSPickExtra<AxiosRequestConfig, 'url', 'params' | 'data' | 'baseURL'>)
{
	return (req: AxiosRequestConfig) => {
		return defaultAxiosCacheAdapterKeyFixed(cb(req))
	}
}
