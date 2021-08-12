import { BaseUrl } from 'restful-decorator/lib/decorators/http';
import { Headers } from 'restful-decorator/lib/decorators/headers';
import { CacheRequest } from 'restful-decorator/lib/decorators/config/cache';
import AbstractHttpClientWithJSDom from 'restful-decorator-plugin-jsdom/lib/index';
import { GET } from 'restful-decorator/lib/decorators/method';
import { methodBuilder } from 'restful-decorator/lib/wrap/abstract';
import { ParamMapAuto, ParamPath, ParamQuery } from 'restful-decorator/lib/decorators/body';
import Bluebird from 'bluebird';
import { ReturnValueToJSDOM } from 'restful-decorator-plugin-jsdom/lib/decorators/jsdom';
import { IJSDOM } from 'jsdom-extra/lib/pack';
import { Cookie } from 'tough-cookie';
import { RequestConfigs } from 'restful-decorator/lib/decorators/config/index';
import { _checkLogin } from './util/_checkLogin';
import {
	INovelStarBookMini, INovelStarRecentUpdate, INovelStarRecentUpdateAll, INovelStarRecentUpdateAllOptions,
	INovelStarRecentUpdateOptions,
	INovelStarRecentUpdateOptionsRaw,
	IWordsObject,
} from './types';
import { _queryRecentUpdate } from './util/_queryRecentUpdate';
import { array_unique_overwrite } from 'array-hyper-unique';
import { _parseUrlInfo } from './util/_parseUrlInfo';
import { _getRecentUpdate } from './util/_getRecentUpdate';

@BaseUrl('https://www.novelstar.com.tw/')
@Headers({
	Referer: 'https://www.novelstar.com.tw/',
})
@CacheRequest({
	cache: {
		maxAge: 6 * 60 * 60 * 1000,
		readHeaders: false,
		//debug: true,
		exclude: {
			query: false,
		},
	},
})
export class NovelStarClient extends AbstractHttpClientWithJSDom
{

	@GET('member/home/')
	@RequestConfigs({
		cache: {
			maxAge: 0,
			ignoreCache: true,
			excludeFromCache: true,
		},
	})
	@ReturnValueToJSDOM()
	@methodBuilder({
		disableFallbackReturnValue: true,
	})
	checkLogin(): Bluebird<string>
	{
		return _checkLogin((this.$returnValue as IJSDOM).$) as any
	}

	isLogin()
	{
		return this.checkLogin()
	}

	_getAuthCookies()
	{
		return this._jar()
			.findCookieByKey('mid', this.$baseURL)
			.reduce((a, b) =>
			{
				let _key = b.key;

				// @ts-ignore
				a[_key] = b;

				return a;
			}, {} as Record<'mid', Cookie>)
			;
	}

	@GET('books/')
	@ReturnValueToJSDOM()
	@methodBuilder()
	_recentUpdate(@ParamQuery('p', 1) page?: number, @ParamMapAuto() extra?: INovelStarRecentUpdateOptionsRaw)
	{
		const jsdom = this.$returnValue as IJSDOM;
		const { $ } = jsdom;

		return _getRecentUpdate($, page, this.$baseURL, extra) as any as Bluebird<INovelStarRecentUpdate>
	}

	recentUpdate(page?: number, extra?: INovelStarRecentUpdateOptions)
	{
		return this._recentUpdate(..._queryRecentUpdate(page, extra))
	}

	recentUpdateAll(options?: INovelStarRecentUpdateAllOptions, extra?: INovelStarRecentUpdateOptions)
	{
		let start = options?.start || 1;

		return this.recentUpdate(start, extra)
			.then(async (data) =>
			{
				let cur = start = data.page;
				let end = Math.max(options?.end ?? Infinity, start, 1);

				let last: number;

				const filter = options?.filter ?? (() => false);

				while (cur < end)
				{
					let data2 = await this._recentUpdate(++cur, data.extra);

					if (data2.page === last || cur !== data2.page || !data2.list.length)
					{
						break;
					}

					if ((await filter(data2, data.list)) ?? false)
					{
						break;
					}

					data.list.push(...data2.list);

					data.range.max = data2.range.max || data.range.max;

					last = cur;
				}

				array_unique_overwrite(data.list);

				return <INovelStarRecentUpdateAll>{
					start,
					end: last ?? start,

					range: data.range,

					extra,

					list: data.list,
				}
			})
			;
	}

}

export default NovelStarClient
