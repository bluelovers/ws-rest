import { ITSResolvable } from 'ts-type';
import { IBaseCacheStore, ICacheStoreJson, ICacheStoreJsonItem, ICacheStoreJsonRow } from './index';

export class CacheStoreByMapLike<R extends Map<any, ICacheStoreJsonItem<T>>, T extends ICacheStoreJsonRow = ICacheStoreJsonRow>
{
	#map: R;

	constructor(map: R)
	{
		this.#map = map;
	}

	async getItem(key: string)
	{
		return this.#map.get(key)
	}

	async setItem(key: string, value: ICacheStoreJsonItem<T>)
	{
		await this.#map.set(key, value)
		return this.#map.get(key)
	}

	async removeItem(key: string)
	{
		await this.#map.delete(key)
		return
	}

	async clear()
	{
		await this.#map.clear()
		return
	}

	async length()
	{
		return this.#map.size
	}

	async iterate(fn: (value: object | string | T, key: string) => ITSResolvable<any>)
	{
		const entries = this.#map.entries();

		for await (let [key, value] of entries)
		{
			await fn(value, key)
		}

		return entries
	}

	get store(): ICacheStoreJson<T>
	{
		return Object.fromEntries(this.#map.entries())
	}

}

export function createCacheStoreByMapLike<R extends Map<any, ICacheStoreJsonItem<T>>, T extends ICacheStoreJsonRow = ICacheStoreJsonRow>(map: R)
{
	return new CacheStoreByMapLike(map)
}
