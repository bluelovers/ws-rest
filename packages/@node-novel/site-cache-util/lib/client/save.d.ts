import { AbstractHttpClient } from 'restful-decorator/lib';
import { ICreatePkgCachePath, ICreatePkgCachePathMap } from '../files';
export declare function _setupCacheFile(opts: {
    api: AbstractHttpClient;
    saveCacheFileBySelf?: boolean;
    __path: ICreatePkgCachePath<ICreatePkgCachePathMap, any>;
}): Promise<() => Promise<void>>;
