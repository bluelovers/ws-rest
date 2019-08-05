/**
 * Created by user on 2019/6/11.
 */

import { setupCache, ISetupCache } from 'axios-cache-adapter';
import { ITSPickExtra, ITSRequireAtLeastOne, ITSResolvable, ITSValueOrArray } from 'ts-type';
import Bluebird from 'bluebird';
import { IResponseHeaders } from 'typed-http-headers';

export interface ICacheStoreJsonRow
{
	status: number,
	statusText: string | "OK",
	headers: IResponseHeaders | Record<string, unknown> | {
		'set-cookie'?: string[],
	},
	data: string,
}

export interface ICacheStoreJsonItem<T extends ICacheStoreJsonRow = ICacheStoreJsonRow>
{
	expires: number,
	data: T,
}

export interface ICacheStoreJson<T extends ICacheStoreJsonRow = ICacheStoreJsonRow> extends Record<any, ICacheStoreJsonItem<T>>
{

}

export interface IOptions
{
	importFilter?<T extends ICacheStoreJsonRow = ICacheStoreJsonRow>(k: string, v: ICacheStoreJsonItem<T>): boolean | number | ICacheStoreJsonItem<T>;
	exportFilter?<T extends ICacheStoreJsonRow = ICacheStoreJsonRow>(k: string, v: ICacheStoreJsonItem<T>): boolean | number | ICacheStoreJsonItem<T>;
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

export function importCache<S extends ISetupCache["store"]>(store: S | IBaseCacheStore, json: ICacheStoreJson<any>, options?: IOptions)
{
	const { importFilter = defaultFilter as IOptions["importFilter"]} = options || {};

	return Bluebird
		.resolve(Object.entries(json) as [string, ICacheStoreJsonItem<any>][])
		.each(([k, v]) =>
		{
			let r = importFilter && importFilter(k, v);

			if (r || r == null)
			{
				if (r && typeof r === 'object')
				{
					v = r;
				}

				(store as IBaseCacheStore).setItem(k, v);
			}
		})
		.thenReturn(store)
		;
}

export function exportCache<S extends ISetupCache["store"], C extends ICacheStoreJson<unknown & ICacheStoreJsonRow>, R = C>(store: S | IBaseCacheStore, options?: ((json: C) => R) | IOptions & {
	exportCb?(json: C): R;
}): Promise<R>
{
	if (typeof options === 'function')
	{
		options = {
			exportCb: options,
		}
	}

	const json: C = {} as C;

	let { exportFilter = defaultFilter as IOptions["exportFilter"], exportCb } = options || {};

	if (!exportCb)
	{
		exportCb = () => json as any;
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

				let r = exportFilter && exportFilter(key, value);

				if (r || r == null)
				{
					if (r && typeof r === 'object')
					{
						value = r;
					}

					(json as ICacheStoreJson)[key] = value;
				}

			})
		.then(r => exportCb(json) as R)
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

export function defaultFilter<T extends ICacheStoreJsonRow = ICacheStoreJsonRow>(k: string, v: ICacheStoreJsonItem<T>): boolean
{
	const { status } = v.data;

	return status != 500;
}

export default {
	importCache,
	exportCache,
}
