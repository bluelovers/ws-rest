/**
 * Created by user on 2019/6/11.
 */
import { ISetupCache } from 'axios-cache-adapter';
import { ITSResolvable } from 'ts-type';
import Bluebird from 'bluebird';
import { IResponseHeaders } from 'typed-http-headers';
export interface ICacheStoreJsonRow {
    status: number;
    statusText: string | "OK";
    headers: IResponseHeaders | Record<string, unknown> | {
        'set-cookie'?: string[];
    };
    data: string;
}
export interface ICacheStoreJsonItem<T extends ICacheStoreJsonRow = ICacheStoreJsonRow> {
    expires: number;
    data: T;
}
export interface ICacheStoreJson<T extends ICacheStoreJsonRow = ICacheStoreJsonRow> extends Record<any, ICacheStoreJsonItem<T>> {
}
export interface IOptions {
    importFilter?<T extends ICacheStoreJsonRow = ICacheStoreJsonRow>(k: string, v: ICacheStoreJsonItem<T>): boolean | number | ICacheStoreJsonItem<T>;
    exportFilter?<T extends ICacheStoreJsonRow = ICacheStoreJsonRow>(k: string, v: ICacheStoreJsonItem<T>): boolean | number | ICacheStoreJsonItem<T>;
}
export interface IBaseCacheStore {
    getItem<T extends object>(key: string): Promise<T>;
    setItem<T extends object>(key: string, value: T): Promise<T>;
    removeItem(key: string): Promise<void>;
    clear(): Promise<void>;
    length(): Promise<number>;
    iterate(fn: (value: object | string, key: string) => ITSResolvable<any>): Promise<any>;
    store?: ICacheStoreJson;
}
export declare function importCache<S extends ISetupCache["store"]>(store: S | IBaseCacheStore, json: ICacheStoreJson<any>, options?: IOptions): Bluebird<IBaseCacheStore | S>;
export declare function exportCache<S extends ISetupCache["store"], C extends ICacheStoreJson<unknown & ICacheStoreJsonRow>, R = C>(store: S | IBaseCacheStore, options?: ((json: C) => R) | (IOptions & {
    exportCb?(json: C): R;
})): Promise<R>;
/**
 * hook fn to process exit, return a fn for cancel
 * when process exit, can't take too many async , so if can try use sync
 */
export declare function processExitHook(fn: (...args: any[]) => void): () => void;
export declare function defaultFilter<T extends ICacheStoreJsonRow = ICacheStoreJsonRow>(k: string, v: ICacheStoreJsonItem<T>): boolean;
declare const _default: {
    importCache: typeof importCache;
    exportCache: typeof exportCache;
};
export default _default;
