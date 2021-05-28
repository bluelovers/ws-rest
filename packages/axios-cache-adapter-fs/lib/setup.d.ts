import { IBaseCacheStore } from './index';
export declare function setupCacheFile(options?: {
    store: IBaseCacheStore | object;
    saveCacheFileBySelf?: boolean;
    cacheFile: string;
}): Promise<{
    (): Promise<void>;
    store: object | IBaseCacheStore;
}>;
export default setupCacheFile;
