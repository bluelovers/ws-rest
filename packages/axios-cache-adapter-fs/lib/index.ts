/**
 * Created by user on 2019/6/11.
 */

import { setupCache, ISetupCache } from 'axios-cache-adapter';
import { ITSPickExtra, ITSRequireAtLeastOne, ITSResolvable, ITSValueOrArray } from 'ts-type';
import Bluebird from 'bluebird';

export interface ICacheStoreJson<T = any> extends Record<any, T>
{

}

export interface IBaseCacheStore
{
	getItem<T extends object>(key: string): Promise<T>;
	setItem<T extends object>(key: string, value: T): Promise<T>;

	removeItem(key: string): Promise<void>;
	clear(): Promise<void>;

	length(): Promise<number>;

	iterate(fn: (value: object | string, key: string) => ITSResolvable<any>): Promise<any>;

	store?: ICacheStoreJson
}

export function importCache<S extends ISetupCache["store"]>(store: S | IBaseCacheStore, json: ICacheStoreJson)
{
	return Bluebird
		.resolve(Object.entries(json))
		.each(([k, v]) =>
		{
			(store as IBaseCacheStore).setItem(k, v);
		})
		.thenReturn(store)
		;
}

export function exportCache<S extends ISetupCache["store"], C extends ICacheStoreJson, R = C>(store: S | IBaseCacheStore, cb?: (json: C) => R): Promise<R>
{
	const json: C = {} as C;

	if (!cb)
	{
		cb = () => json as any;
	}

	return (store as IBaseCacheStore)
			.iterate(function (value: any | string, key: string)
			{
				if (typeof value === 'string')
				{
					try
					{
						value = JSON.parse(value);
					}
					catch (e)
					{

					}
				}

				(json as ICacheStoreJson)[key] = value;
			})
		.then(r => cb(json))
		;
}

/**
 * hook fn to process exit, return a fn for cancel
 * when process exit, can't take too many async , so if can try use sync
 */
export function processExitHook(fn: (...args: any[]) => void)
{
	// @ts-ignore
	process.on('exit', fn);

	return () => {
		// @ts-ignore
		process.off('exit', fn)
	}
}

export default {
	importCache,
	exportCache,
}
