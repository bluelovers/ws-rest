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
import { IMasiroMeBook, IMasiroMeBookWithChapters } from './types';
import { trimUnsafe } from './util/trim';
import moment from 'moment';
import { zhRegExp } from 'regexp-cjk';
import { _checkLogin } from './util/_checkLogin';
import { _getBookInfo } from './util/_getBookInfo';
import { _getBookChapters } from './util/_getBookChapters';

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

	@GET('/')
	@CacheRequest({
		// @ts-ignore
		cache: false,
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

		let book: IMasiroMeBook = _getBookInfo($, novel_id);

		let book_with_chapters: IMasiroMeBookWithChapters = book as any;

		book_with_chapters.chapters = _getBookChapters($);

		return book_with_chapters as any
	}

}

export default MasiroMeClient
