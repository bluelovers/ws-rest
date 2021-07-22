import { AxiosRequestConfig } from 'axios';
import { ITSPickExtra } from 'ts-type/lib/type/record';
declare module 'axios-cache-adapter' {
    function serializeQuery(req: Pick<AxiosRequestConfig, 'params'>): string;
}
/**
 * bug fixed version of key
 *
 * @see https://github.com/RasCarlito/axios-cache-adapter/blob/master/src/cache.js#L66
 * @see https://github.com/RasCarlito/axios-cache-adapter/pull/250
 */
export declare function defaultAxiosCacheAdapterKeyFixed(req: AxiosRequestConfig): string;
export declare function axiosCacheAdapterKeyExtra(cb: (req: AxiosRequestConfig) => ITSPickExtra<AxiosRequestConfig, 'url', 'params' | 'data' | 'baseURL'>): (req: AxiosRequestConfig) => string;
