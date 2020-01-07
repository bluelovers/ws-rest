import path from 'upath2';
import { __root } from '@node-novel/cached-wenku8/script/util';
import util from 'util';
import fs from 'fs-extra';

export function createPkgPath(__root: string)
{
	if (!__root || !path.isAbsolute(__root))
	{
		throw new RangeError(`__root should is absolute path, but got ${JSON.stringify(__root)}`)
	}

	let stat = fs.statSync(__root);

	if (stat.isFile() || !stat.isDirectory())
	{
		throw new TypeError(`__root should is a dir, but got ${JSON.stringify(__root)}`)
	}

	__root = path.normalize(__root);

	return {
		get __root()
		{
			return __root
		},
		join(...paths: [string, ...string[]])
		{
			return path.join(...paths)
		},
		resolve(...paths: [string, ...string[]])
		{
			return path.resolve(__root, ...paths)
		},
		relative(...paths: [string])
		{
			return path.relative(__root, paths[0])
		},
	}
}

export type ICreatePkgPath = ReturnType<typeof createPkgPath>;

export type ICreatePkgCachePathFunction<T extends ICreatePkgPath = ICreatePkgPath> = ((this: T, ...argv: any) => any);

export type ICreatePkgCachePathFn = Record<string, ICreatePkgCachePathFunction>;

export type ICreatePkgCachePathMap = Record<string, string | [string, ...string[]]>;

export type ICreatePkgCachePath<T extends ICreatePkgCachePathMap, T2 extends Record<string, ICreatePkgCachePathFunction<ICreatePkgCachePath<T, T2>>>> = ICreatePkgPath & {
	cacheFilePaths: {

		recentUpdate: string;
		recentUpdateDay: string;

		task001: string;
		infoPack: string;

		idAuthors: string;
		idTitles: string;
		idUpdate: string;
		idChapters: string;

		ids: string;
		titles: string;
		authors: string;
		tags: string;

		cookiesCacheFile: string,
		axiosCacheFile: string,

		passwordLocalFile: string,

		dirDataRoot: string,
		dirTempRoot: string,

	} & Record<keyof T, string>;
	fn: {
		cacheFileInfoPath(id: string | number): string
	} & {
		[P in keyof T2]: (...argv: Parameters<T2[P]>) => ReturnType<T2[P]>
	};
}

export function createPkgCachePath<T extends Record<string, string | [string, ...string[]]>, T2 extends Record<string, ICreatePkgCachePathFunction<ICreatePkgCachePath<T, ICreatePkgCachePathFn>>>>(root: string, options: {
	map?: T,
	fn?: T2,
} = {}): ICreatePkgCachePath<T, T2>
{
	const pkgData = createPkgPath(root);
	const { join, resolve } = pkgData;

	let data = Object.assign(pkgData, {

		cacheFilePaths: {

			recentUpdate: join('data', 'novel/recentUpdate.json'),
			recentUpdateDay: join('data', 'novel/recentUpdateDay.json'),

			task001: join( 'test/temp', 'task001.json'),

			infoPack: join('data', 'novel/info.pack.json'),

			idAuthors: join('data/novel', 'id_authors.json'),

			idTitles: join('data/novel', 'id_titles.json'),

			idUpdate: join('data/novel', 'id_update.json'),

			idChapters: join('data/novel', 'id_chapters.json'),

			ids: join('data/novel', 'ids.json'),

			titles: join('data/novel', 'titles.json'),

			authors: join('data/novel', 'authors.json'),

			tags: join('data/novel', 'tags.json'),

			cookiesCacheFile: join('test/temp', 'axios.cookies.json'),
			axiosCacheFile: join('test/temp', 'axios.cache.json'),

			passwordLocalFile: join('test', 'password.local'),

			dirDataRoot: join('data'),
			dirTempRoot: join('test', 'temp'),

			...Object.entries(options.map || {} as T)
				.reduce((a, [k, v]: [keyof T, string | [string, ...string[]]]) => {

					if (typeof v === 'string')
					{
						a[k] = resolve(v);
					}
					else
					{
						a[k] = resolve(...v);
					}

					return a;
				}, {} as Record<keyof T, string>),
		},

		fn: {
			cacheFileInfoPath(id: string | number)
			{
				return join('data', `novel/info/${id}.json`)
			},

			...Object.entries(options.fn || {} as T2)
				.reduce((a, [k, v]) => {

					// @ts-ignore
					a[k] = v.bind(pkgData);

					return a;
				}, {} as any),
		}
	});

	data.cacheFilePaths = wrapProxy(data.cacheFilePaths);
	data.fn = wrapProxy(data.fn);

	return wrapProxy(data);
}

export function wrapProxy<T extends Record<string | number | symbol, any>>(target: T)
{
	return new Proxy(target, {
		get(target, p: string | number | symbol, receiver: any): any
		{
			if (p in target)
			{
				return Reflect.get(target, p, receiver)
			}
			else
			{
				throw new TypeError(`${util.inspect(target)} didn't has member ${util.inspect(p)}`)
			}
		},
		set(target: T, p: string | number | symbol, value: any, receiver: any): boolean {

			throw new TypeError(`readonly`);

			return
		},
	});
}
