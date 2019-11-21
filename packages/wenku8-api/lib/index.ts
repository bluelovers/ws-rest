import { AbstractHttpClient } from 'restful-decorator/lib';
import { AxiosRequestConfig } from 'restful-decorator/lib/types/axios';
import {
	BaseUrl,
	BodyData,
	CacheRequest,
	FormUrlencoded,
	GET,
	Headers,
	methodBuilder,
	ParamData,
	ParamMapData,
	ParamPath,
	POST,
	RequestConfigs,
	TransformResponse,
	CatchError, ParamQuery,
} from 'restful-decorator/lib/decorators';
import { ICookiesValue, LazyCookieJar } from 'lazy-cookies';
import { getCookieJar } from 'restful-decorator/lib/decorators/config/cookies';
import { IBluebird } from 'restful-decorator/lib/index';
import Bluebird from 'bluebird';
import { array_unique } from 'array-hyper-unique';
import consoleDebug from 'restful-decorator/lib/util/debug';
import { mergeAxiosErrorWithResponseData } from '../../restful-decorator/lib/wrap/error';
import { ParamMapAuto } from 'restful-decorator/lib/decorators/body';
import toughCookie, { CookieJar } from 'tough-cookie';
import { fromURL, IFromUrlOptions, IJSDOM, createJSDOM } from 'jsdom-extra';
import { combineURLs } from 'restful-decorator/lib/fix/axios';
import { paramMetadataRequestConfig } from 'restful-decorator/lib/wrap/abstract';
import { arrayBufferToString, sniffHTMLEncoding, iconvDecode, trimUnsafe } from './util';
import moment from 'moment';
import { IDmzjClientNovelRecentUpdateAll } from 'dmzj-api/lib/types';

/**
 * https://gist.github.com/bluelovers/5e9bfeecdbff431c62d5b50e7bdc3e48
 * https://github.com/guuguo/flutter_dmzj/blob/master/lib/api.dart
 * https://github.com/tkkcc/flutter_dmzj/blob/269cb0d642c710626fe7d755f0b27b12ab477cc6/lib/util/api.dart
 */
@BaseUrl('https://www.wenku8.net')
@Headers({
	Referer: 'https://www.wenku8.net',
})
@CacheRequest({
	cache: {
		maxAge: 6 * 60 * 60 * 1000,
	},
})
@RequestConfigs({
	responseType: 'arraybuffer',
})
export class Wenku8Client extends AbstractHttpClient
{
	constructor(defaults?: AxiosRequestConfig, ...argv: any)
	{
		if (defaults && typeof defaults.jar === 'string')
		{
			defaults.jar = CookieJar.deserializeSync(defaults.jar)
		}

		super(defaults, ...argv);
	}

	_serialize(jar?: CookieJar)
	{
		return (jar || this._jar()).serializeSync()
	}

	@POST('login.php?do=submit&action=login')
	@FormUrlencoded
	@methodBuilder()
	loginByForm(@ParamMapAuto({
		action: 'login',
		usecookie: 315360000,
		submit: true,
	}) inputData: {
		username: string,
		password: string,
		usecookie?: number,
		jumpurl?: string,
	}): IBluebird<boolean>
	{
		let jsdom = this._responseDataToJSDOM(this.$response.data);
		return jsdom.document.title.includes('成功') as any;
	}

	loginByCookies(cookies_data: ICookiesValue[])
	{
		this._jar().setData(cookies_data || {});
		return Bluebird.resolve(this)
	}

	_jar(): LazyCookieJar
	{
		// @ts-ignore
		return this.$http.defaults.jar || getCookieJar(this)
	}

	/**
	 * 轻小说最近更新
	 */
	@GET('modules/article/toplist.php')
	@methodBuilder()
	articleToplist(@ParamQuery('page', 1) page?: number,
		@ParamQuery('sort', 'lastupdate') sortType?: string | 'lastupdate',
	): IBluebird<{
		page: number;
		end: number;
		last_update_time: number;
		data: {
			id: string;
			cid: string;
			name: string;
			cover: string;
			last_update_time: number;
			last_update_chapter_name: string;
		}[];
	}>
	{
		let jsdom = this._responseDataToJSDOM(this.$returnValue);

		let $ = jsdom.$;

		let tds = $('#centerm #content .grid > tbody > tr > td > div');

		tds.find('script').remove();
		tds.filter(':empty').remove();

		tds = $('#centerm #content .grid > tbody > tr > td > div');

		// @ts-ignore
		let pageEnd: number = $('#pagelink .last').text() | 0;

		let ret = {
			page,
			end: pageEnd,
			last_update_time: 0,
			data: [] as {
				id: string,
				cid: string,
				name: string,
				cover: string,
				last_update_time: number,
				last_update_chapter_name: string,
			}[]
		};

		let lastUpdateTime = 0;

		tds
			.each((i, elem) =>
			{
				let _this = $(elem);

				let _a = _this
					.find('a[tiptitle]:has(> img), a[title]:has(> img)')
					.eq(0)
				;

				let cover = _a.find('> img:eq(0)')
					.prop('src')
				;

				let title = _a.prop('tiptitle') || _a.prop('title');

				let _a2 = _this
					.find('a[href*="/novel/"]:eq(0)')
				;

				let cid: string;
				let nid: string;
				let last_update_chapter_name: string;

				if (_a2.length)
				{
					let _m = _a2.prop('href').match(/\/novel\/(\d+)\/(\d+)\//);

					if (_m)
					{
						cid = _m[1];
						nid = _m[2];
					}

					last_update_chapter_name = trimUnsafe(_a2.text());
				}
				else
				{
					let _m = _a2.prop('href').match(/book\/(\d+)\.htm/);

					if (_m)
					{
						nid = _m[1];
					}
				}

				let _m = _this.text().match(/(\d+\-\d+\-\d+)/);

				let last_update_time: number;
				if (_m)
				{
					last_update_time = moment(_m[1]).unix();

					lastUpdateTime = Math.max(lastUpdateTime, last_update_time)
				}

				title = trimUnsafe(title);

				ret.data.push({
					id: nid,
					cid,
					name: title,
					cover,
					last_update_time,
					last_update_chapter_name,
				})
			})
		;

		ret.last_update_time = lastUpdateTime;

		//console.dir(ret);

		return ret as any;
	}

	@GET('index.php')
	@methodBuilder()
	isLogin(): IBluebird<boolean>
	{
		let jsdom = this._responseDataToJSDOM(this.$returnValue);

		return !!jsdom
			.$('a[href="https://www.wenku8.net/logout.php"]')
			.length as any
	}

	_decodeBuffer(buf: unknown | ArrayBuffer | Buffer)
	{
		return iconvDecode(buf);
	}

	_responseDataToJSDOM(data: unknown)
	{
		return createJSDOM(this._decodeBuffer(data));
	}

}

export default Wenku8Client
