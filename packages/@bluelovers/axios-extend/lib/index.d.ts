import { AxiosAdapter, AxiosError, AxiosInstance, AxiosPromise, AxiosRequestConfig, AxiosResponse, AxiosStatic } from 'axios';
import Bluebird from 'bluebird';
import { RetryConfig as IAxiosRetryConfig } from 'retry-axios';
import { IAxiosCacheAdapterOptions } from 'axios-cache-adapter';
import setupCacheConfig, { mixinCacheConfig } from './cache';
import { IAxiosAdapterWarpper } from './types';
import { mixinDefaultConfig } from './config';
export * from "./types";
export { IAxiosCacheAdapterOptions, IAxiosRetryConfig, AxiosAdapter, AxiosPromise };
export { AxiosRequestConfig, AxiosResponse, AxiosInstance, AxiosError, AxiosStatic };
export declare function extendAxios<AX extends AxiosInstance | AxiosStatic>(axios: AX, defaultOptions?: AxiosRequestConfig): {
    axios: AX;
    /**
     * only use this method once for each axios, if not will create new cache
     */
    setupCacheConfig: typeof setupCacheConfig;
    mixinCacheConfig: typeof mixinCacheConfig;
    mixinDefaultConfig<T extends AxiosRequestConfig>(config: T, _axios?: AxiosInstance, ...opts: AxiosRequestConfig[]): AxiosRequestConfig;
};
export { setupCacheConfig, mixinDefaultConfig, mixinCacheConfig };
export declare function wrapAdapter(fn: IAxiosAdapterWarpper, config: AxiosRequestConfig): (arg1: AxiosRequestConfig, arg2: AxiosResponse<any>) => Bluebird<AxiosResponse<any>>;
export default extendAxios;
