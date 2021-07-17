import { BaseUrl } from 'restful-decorator/lib/decorators/http';
import { Headers } from 'restful-decorator/lib/decorators/headers';
import { CacheRequest } from 'restful-decorator/lib/decorators/config/cache';
import AbstractHttpClientWithJSDom from 'restful-decorator-plugin-jsdom/lib/index';
import { GET, POST } from 'restful-decorator/lib/decorators/method';
import { methodBuilder } from 'restful-decorator/lib/wrap/abstract';
import { ParamMapAuto, ParamPath } from 'restful-decorator/lib/decorators/body';
import Bluebird from 'bluebird';
import { ReturnValueToJSDOM } from 'restful-decorator-plugin-jsdom/lib/decorators/jsdom';
import { IJSDOM } from 'jsdom-extra/lib/pack';
import { FormUrlencoded } from 'restful-decorator/lib/decorators/form';
import { Cookie } from 'tough-cookie';
import {
	IMasiroMeBook,
	IMasiroMeBookWithChapters,
	IMasiroMeChapter,
	IMasiroMeRecentUpdate,
	IMasiroMeRecentUpdateAll, IMasiroMeRecentUpdateOptions,
	IRawMasiroMeLoadMoreNovels,
} from './types';
import { _checkLogin } from './util/_checkLogin';
import { _getBookInfo } from './util/_getBookInfo';
import { _getBookChapters } from './util/_getBookChapters';
import { _getChapter } from './util/_getChapter';
import { RequestConfigs } from 'restful-decorator/lib/decorators/config/index';
import { _getRecentUpdate } from './util/_getRecentUpdate';
import { array_unique_overwrite } from 'array-hyper-unique';

@BaseUrl('https://masiro.me')
@Headers({
	Referer: 'https://masiro.me/admin',
})
@CacheRequest({
	cache: {
		maxAge: 6 * 60 * 60 * 1000,
		readHeaders: false,
		//debug: true,
		exclude: {
			query: false,
		}
	},
})
export class MasiroMeClient extends AbstractHttpClientWithJSDom
{

	@GET('admin/auth/login')
	@RequestConfigs({
		cache: {
			maxAge: 0,
			ignoreCache: true,
			excludeFromCache: true,
		},
	})
	@ReturnValueToJSDOM()
	@methodBuilder()
	loginByForm(@ParamMapAuto() inputData: {
		username: string,
		password: string,
		activationcode?: string,
	})
	{
		const jsdom = this.$returnValue as IJSDOM;
		const { $ } = jsdom;

		let u = _checkLogin($);

		if (u?.length)
		{
			return u as null
		}

		const _token = $(':input[name="_token"]').val() as string

		return this._loginByForm({
			...inputData,
			_token,
		})
	}

	@POST('admin/auth/login')
	@Headers({
		Referer: 'https://masiro.me/admin/auth/login',
	})
	@FormUrlencoded
	@methodBuilder()
	protected _loginByForm(@ParamMapAuto({
		remember: 1,
	}) inputData: {
		username: string,
		password: string,
		activationcode?: string,
		remember?: 1,
		_token: string,
	})
	{
		return this.checkLogin()
	}

	@POST('/')
	@RequestConfigs({
		cache: {
			ignoreCache: true,
			excludeFromCache: true,
		},
	})
	@ReturnValueToJSDOM()
	@methodBuilder()
	checkLogin(): Bluebird<string>
	{
		return _checkLogin((this.$returnValue as IJSDOM).$) as any
	}

	_getAuthCookies()
	{
		return this._jar()
			.findCookieByKey(/laravel_session|remember_|XSRF-TOKEN/, this.$baseURL)
			.reduce((a, b) =>
			{
				let _key = /^(remember_\w+)_/.exec(b.key)?.[1] ?? b.key;

				// @ts-ignore
				a[_key] = b;

				return a;
			}, {} as Record<'laravel_session' | 'remember_admin' | 'XSRF-TOKEN', Cookie>)
			;
	}

	@GET('admin/novelView?novel_id={novel_id}')
	@ReturnValueToJSDOM()
	@methodBuilder()
	bookInfo(@ParamPath('novel_id') novel_id: number | string): Bluebird<IMasiroMeBookWithChapters>
	{
		const jsdom = this.$returnValue as IJSDOM;
		const { $ } = jsdom;

		let book: IMasiroMeBook = _getBookInfo($, novel_id, this.$baseURL);

		let book_with_chapters: IMasiroMeBookWithChapters = book as any;

		book_with_chapters.chapters = _getBookChapters($);

		return book_with_chapters as any
	}

	@GET('admin/novelReading?cid={chapter_id}')
	@ReturnValueToJSDOM()
	@methodBuilder()
	getChapter(@ParamPath('chapter_id')
		chapter_id: string | number, options: {
		rawHtml?: boolean,
		cb?(data: {
			i: number,
			$elem: JQuery<HTMLElement>,
			$content: JQuery<HTMLElement>,
			src: string,
			imgs: string[],
		}): void,
	} = {}): Bluebird<IMasiroMeChapter>
	{
		const jsdom = this.$returnValue as IJSDOM;
		const { $ } = jsdom;

		return _getChapter($, chapter_id, options) as null
	}

	@GET('admin/loadMoreNovels?page={page}&order={order}')
	@RequestConfigs({
		responseType: 'json',
	})
	@methodBuilder()
	recentUpdate(@ParamPath('page', 1) page?: number, @ParamMapAuto({
		order: 1,
	}) extra?: IMasiroMeRecentUpdateOptions): Bluebird<IMasiroMeRecentUpdate>
	{
		const json = this.$returnValue as IRawMasiroMeLoadMoreNovels;
		const jsdom = this._responseDataToJSDOM('<meta charset="utf-8">' + json.html, this.$response);

		return _getRecentUpdate(jsdom.$, json, this.$baseURL, extra) as IMasiroMeRecentUpdate as any;
	}

	recentUpdateAll(options?: {
		start?: number,
		end?: number,
	}, extra?: IMasiroMeRecentUpdateOptions)
	{
		let start = options?.start || 1;

		return this.recentUpdate(start, extra)
			.then(async (data) =>
			{
				let cur = start = data.page;
				const end = Math.max(Math.min(options?.end || data.pages, data.pages), start, 1);

				let last: number;

				while (cur < end)
				{
					let data2 = await this.recentUpdate(++cur, extra)

					if (data2.page === last || cur !== data2.page || !data2.list.length)
					{
						break;
					}

					data.list.push(...data2.list);

					data.pages = data2.pages;
					data.total = data2.total;

					last = cur;
				}

				array_unique_overwrite(data.list);

				return <IMasiroMeRecentUpdateAll>{
					start,
					end: last ?? start,

					pages: data.pages,
					total: data.total,

					extra,

					list: data.list,
				}
			})
			;
	}

}

export default MasiroMeClient
