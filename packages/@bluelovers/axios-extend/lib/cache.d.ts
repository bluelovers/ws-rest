import { AxiosRequestConfig } from './index';
import { AxiosAdapter } from 'axios';
import { setupCache, IAxiosCacheAdapterOptions, ISetupCache } from 'axios-cache-adapter';
import { IAxiosCacheAdapterOptionsConfig } from './types';
export { IAxiosCacheAdapterOptions, ISetupCache, IAxiosCacheAdapterOptionsConfig };
export { setupCache };
export declare function setupCacheConfig<T extends IAxiosCacheAdapterOptionsConfig | AxiosRequestConfig>(configInput: T): {
    config: Omit<T, "cache"> & {
        adapter: AxiosAdapter;
    };
    cache: ISetupCache;
};
export declare function mixinCacheConfig<T extends IAxiosCacheAdapterOptionsConfig>(config: T): T;
export default setupCacheConfig;
