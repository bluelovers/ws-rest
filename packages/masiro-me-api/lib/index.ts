import { BaseUrl } from 'restful-decorator/lib/decorators/http';
import { Headers } from 'restful-decorator/lib/decorators/headers';
import { CacheRequest } from 'restful-decorator/lib/decorators/config/cache';
import AbstractHttpClientWithJSDom from 'restful-decorator-plugin-jsdom/lib/index';
import { GET, POST } from 'restful-decorator/lib/decorators/method';
import { methodBuilder } from 'restful-decorator/lib/wrap/abstract';
import { ParamData, ParamMapAuto, ParamPath } from 'restful-decorator/lib/decorators/body';
import Bluebird from 'bluebird';
import { ReturnValueToJSDOM } from 'restful-decorator-plugin-jsdom/lib/decorators/jsdom';
import { IJSDOM } from 'jsdom-extra/lib/pack';
import { FormUrlencoded } from 'restful-decorator/lib/decorators/form';
import { CookieJar, Cookie } from 'tough-cookie';
import { IMasiroMeBook } from './types';
import { trimUnsafe } from './util/trim';
import moment from 'moment';
import { zhRegExp } from 'regexp-cjk';

@BaseUrl('https://masiro.me')
@Headers({
	Referer: 'https://masiro.me/admin',
})
@CacheRequest({
	cache: {
		maxAge: 6 * 60 * 60 * 1000,
	},
})
export class MasiroMeClient extends AbstractHttpClientWithJSDom
{

	@GET('admin/auth/login')
	@CacheRequest({
		// @ts-ignore
		cache: false,
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

		let u = this._checkLogin(jsdom);

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

	protected _checkLogin(jsdom: IJSDOM): string
	{
		const { $ } = jsdom;

		let username = $('.main-header .user .dropdown-toggle span:eq(0)')
			.text()
			.replace(/^\s+|\s+$/g, '')
		;

		if (username?.length)
		{
			return username
		}
	}

	@GET('/')
	@CacheRequest({
		// @ts-ignore
		cache: false,
	})
	@ReturnValueToJSDOM()
	@methodBuilder()
	checkLogin(): Bluebird<string>
	{
		return this._checkLogin(this.$returnValue as IJSDOM) as any
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
	bookInfo(@ParamPath('novel_id') novel_id: number | string): Bluebird<IMasiroMeBook>
	{
		const jsdom = this.$returnValue as IJSDOM;
		const { $ } = jsdom;

		let author = trimUnsafe($('.n-detail .author').text());

		let translator: string[];

		$('.n-detail .n-translator a')
			.each((index, elem) => {

				let s = trimUnsafe($(elem).text())

				if (s.length)
				{
					translator ??= [];
					translator.push(s)
				}
			})
		;

		let tags: string[];

		$('.n-detail .tags a .label')
			.each((index, elem) => {

				let s = trimUnsafe($(elem).text())

				if (s.length)
				{
					tags ??= [];
					tags.push(s)
				}
			})
		;

		let _date = trimUnsafe($('.n-detail .n-update .s-font').text());
		let updated: number;

		if (_date?.length)
		{
			updated = moment(_date).valueOf()
		}

		let content = trimUnsafe($('.content .brief').text())
			.replace(new zhRegExp(/^简介(?:：|:)\s*/), '')
		;

		let book: IMasiroMeBook = {
			id: novel_id as string,
			title: trimUnsafe($('.novel-title').text()),
			authors: author.length ? [author] : void 0,
			translator,
			tags,
			updated,
			content: content.length ? content : void 0,
		}

		return book as any
	}

}

export default MasiroMeClient
