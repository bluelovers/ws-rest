import { ITSResolvable } from 'ts-type';
import { ICacheStoreJson, ICacheStoreJsonItem, ICacheStoreJsonRow } from './index';
export declare class CacheStoreByMapLike<R extends Map<any, ICacheStoreJsonItem<T>>, T extends ICacheStoreJsonRow = ICacheStoreJsonRow> {
    #private;
    constructor(map: R);
    getItem(key: string): Promise<ICacheStoreJsonItem<T>>;
    setItem(key: string, value: ICacheStoreJsonItem<T>): Promise<ICacheStoreJsonItem<T>>;
    removeItem(key: string): Promise<void>;
    clear(): Promise<void>;
    length(): Promise<number>;
    iterate(fn: (value: object | string | T, key: string) => ITSResolvable<any>): Promise<IterableIterator<[any, ICacheStoreJsonItem<T>]>>;
    get store(): ICacheStoreJson<T>;
}
export declare function createCacheStoreByMapLike<R extends Map<any, ICacheStoreJsonItem<T>>, T extends ICacheStoreJsonRow = ICacheStoreJsonRow>(map: R): CacheStoreByMapLike<R, ICacheStoreJsonRow>;
