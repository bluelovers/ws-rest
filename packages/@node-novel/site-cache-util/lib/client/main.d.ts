import { AbstractHttpClient } from 'restful-decorator/lib';
import { ICreatePkgCachePath, ICreatePkgCachePathMap } from '../files';
import { LazyCookieJar } from 'lazy-cookies';
import { AxiosRequestConfig } from 'axios';
import { ITSResolvable } from 'ts-type';
export declare function _getApiClient<T extends AbstractHttpClient>(opts: {
    api: T;
    ApiClient: {
        new (...argv: any): T;
    };
    jar: LazyCookieJar;
    saveCache: () => void;
    __path: ICreatePkgCachePath<ICreatePkgCachePathMap, any>;
    apiOptions?: AxiosRequestConfig;
    setupCacheFile?(api: T, saveCacheFileBySelf?: boolean): ITSResolvable<() => void>;
    saveCacheFileBySelf?: boolean;
    envPrefix: string;
}): Promise<{
    api: T;
    jar: LazyCookieJar;
    saveCache: () => void;
}>;
