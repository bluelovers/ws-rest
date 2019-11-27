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
	CatchError, ParamQuery, HandleParamMetadata,
} from 'restful-decorator/lib/decorators';
import { ICookiesValue, LazyCookieJar } from 'lazy-cookies';
import { getCookieJar } from 'restful-decorator/lib/decorators/config/cookies';
import { IBluebird } from 'restful-decorator/lib/index';
import Bluebird from 'bluebird';
import { array_unique } from 'array-hyper-unique';
import consoleDebug from 'restful-decorator/lib/util/debug';
import { ParamMapAuto } from 'restful-decorator/lib/decorators/body';
import toughCookie, { CookieJar } from 'tough-cookie';
import { fromURL, IFromUrlOptions, IJSDOM, createJSDOM } from 'jsdom-extra';
import { combineURLs } from 'restful-decorator/lib/fix/axios';
import { paramMetadataRequestConfig } from 'restful-decorator/lib/wrap/abstract';
import { arrayBufferToString, sniffHTMLEncoding, iconvDecode, trimUnsafe, tryMinifyHTML } from './util';
import moment from 'moment';
import {
	IWenku8RecentUpdate,
	IArticleToplistSortType,
	IWenku8RecentUpdateWithSortType,
	IWenku8RecentUpdateRow,
	IWenku8RecentUpdateRowBook,
	IWenku8BookChapters,
	IWenku8RecentUpdateRowBookWithChapters,
	IArticleSearchType, IWenku8SearchList,
} from './types';
import { minifyHTML } from 'jsdom-extra/lib/html';
import { buildVersion } from 'dmzj-api/lib/util';
import iconv, { decode as _iconvDecode } from 'iconv-jschardet';
import { encodeURIComponent as encodeURIComponentGBK } from './util/urlEncodeGBK';
import { expand as expandUriTpl } from 'router-uri-convert/parser';
import subobject from 'restful-decorator/lib/helper/subobject';

/**
 * https://www.wenku8.net/index.php
 */
@BaseUrl('https://www.wenku8.net')
@Headers({
	Referer: 'https://www.wenku8.net/index.php',
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
	@CacheRequest({
		cache: {
			maxAge: 0,
		},
	})
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
		let jsdom = this._responseDataToJSDOM(this.$response.data, this.$response);
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

	protected _handleArticleList<T extends Partial<IWenku8RecentUpdate>, R = T & Pick<IWenku8RecentUpdate, 'end' | 'last_update_time' | 'data'>>(_this: this, retDataInit: T): R
	{
		let jsdom = _this._responseDataToJSDOM(_this.$returnValue, this.$response);

		let $ = jsdom.$;

		let tds = $('#centerm #content .grid > tbody > tr > td > div');

		tds.find('script').remove();
		tds.filter(':empty').remove();

		tds = $('#centerm #content .grid > tbody > tr > td > div');

		//console.debug(jsdom.serialize());

		// @ts-ignore
		let pageEnd: number = $('#pagelink .last').text() | 0;

		let ret: T = {
			...retDataInit,
			end: pageEnd,
			last_update_time: 0,
			data: []
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

				title = trimUnsafe(title);

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
					_a2 = _this
						.find('a[href*="/book/"]:eq(0)')
					;

					let _m = _a2.prop('href').match(/book\/(\d+)\.htm/);

					if (_m)
					{
						nid = _m[1];
					}
				}

				let _text = _this.text();

				let _m = _text.match(/(\d+\-\d+\-\d+)/);

				let last_update_time: number;
				if (_m)
				{
					last_update_time = moment(_m[1]).unix();

					lastUpdateTime = Math.max(lastUpdateTime, last_update_time)
				}

				let authors: string;

				if (_m = _text.match(/作者\:([^\n]+)\/分/))
				{
					authors = trimUnsafe(_m[1]);
				}

				let status: string;

				if (_m = _text.match(/\/(?:状|狀)(?:态|態):([^\n\s]+)/))
				{
					status = trimUnsafe(_m[1]);
				}

				let publisher: string;

				if (_m = _text.match(/分(?:类|類)\:([^\n]+)\/(?:状|狀)/))
				{
					publisher = trimUnsafe(_m[1]);
				}

				ret.data.push({
					id: nid,
					cid,
					name: title,
					authors,
					publisher,
					status,
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

	/**
	 * 轻小说最近更新
	 */
	@GET('modules/article/toplist.php')
	@methodBuilder()
	articleToplist(@ParamQuery('page', 1) page?: number,
		@ParamQuery('sort', 'lastupdate') sortType?: IArticleToplistSortType | 'lastupdate',
	): IBluebird<IWenku8RecentUpdateWithSortType>
	{
		return this._handleArticleList<IWenku8RecentUpdateWithSortType>(this, {
			page,
			end: undefined,
			last_update_time: 0,
			sort: sortType,
			data: []
		}) as any
	}

	/**
	 * 轻小说列表
	 * 注意與轻小说最近更新不同，此列表可能會額外多出其他小說
	 */
	@GET('modules/article/articlelist.php')
	@methodBuilder()
	articleList(@ParamQuery('page', 1) page?: number, @ParamQuery('fullflag') fullflag?: number): IBluebird<IWenku8RecentUpdate>
	{
		return this._handleArticleList<IWenku8RecentUpdate>(this, {
			page,
			end: undefined,
			last_update_time: 0,
			data: []
		}) as any
	}

	@GET('index.php')
	@CacheRequest({
		cache: {
			maxAge: 0,
		},
	})
	@methodBuilder()
	isLogin(): IBluebird<boolean>
	{
		let jsdom = this._responseDataToJSDOM(this.$returnValue, this.$response);

		return !!jsdom
			.$('a[href="https://www.wenku8.net/logout.php"]')
			.length as any
	}

	_decodeBuffer(buf: unknown | ArrayBuffer | Buffer)
	{
		return iconvDecode(buf);
	}

	_responseDataToJSDOM(data: unknown, response: this["$response"])
	{
		if (response && response.config && response.config.url)
		{
			return createJSDOM(this._decodeBuffer(data), {
				url: response.config.url.toString(),
			});
		}

		return createJSDOM(this._decodeBuffer(data));
	}

	@GET('book/{novel_id}.htm')
	@methodBuilder()
	bookInfo(@ParamPath('novel_id') novel_id: number | string): IBluebird<IWenku8RecentUpdateRowBook>
	{
		let jsdom = this._responseDataToJSDOM(this.$returnValue, this.$response);
		const $ = jsdom.$;

		let data: IWenku8RecentUpdateRowBook = ({
			id: novel_id.toString(),
			"cid": undefined,
			"name": undefined,
			"authors": undefined,
			"publisher": undefined,
			"status": undefined,
			"cover": undefined,
			"last_update_time": 0,
			"last_update_chapter_name": undefined,
			desc: undefined,
		});

		data.name = trimUnsafe($('#content table:eq(0) table:eq(0) td > span > b').text());

		$('#content table:eq(0) tr:not(table) td')
			.each(function (i, elem)
			{
				let _this = $(this);

				let _text = trimUnsafe(_this.text());

				let _m = _text.match(/分(?:类|類)：([^\n]+)/);

				if (_m)
				{
					data.publisher = trimUnsafe(_m[1])
				}
				else if (_m = _text.match(/作者：([^\n]+)/))
				{
					data.authors = trimUnsafe(_m[1])
				}
				else if (_m = _text.match(/(?:状|狀)(?:态|態)：([^\n]+)/))
				{
					data.status = trimUnsafe(_m[1])
				}
				else if (_m = _text.match(/更新：(\d+\-\d+\-\d+)/))
				{
					let last_update_time = moment(_m[1]).unix();
					data.last_update_time = last_update_time;
				}

			})
		;

		let _content = $('#content > div > table:eq(1)');

		try
		{
			tryMinifyHTML(_content.html(), (html) => {
				_content.html(html);
			});
		}
		catch (e)
		{

		}

		let _cr = _content.find('.hottext:eq(0)');

		if (_cr.length && /因版权问题|因版權問題/.test(_cr.text() || ''))
		{
			data.copyright_remove = true;
		}

		data.cover = _content.find('img:eq(0)').prop('src');
		data.desc = trimUnsafe(_content.find('.hottext + br + span:eq(-1)').text() || '');

		let _a2 = _content
			.find('a[href*="/novel/"]:eq(0)')
		;

		if (_a2.length)
		{
			let _m = _a2.prop('href')
				.match(/\/novel\/(\d+)\/(\d+)\//)
			;

			if (_m)
			{
				data.cid = _m[1];
			}

			data.last_update_chapter_name = trimUnsafe(_a2.text());
		}

		if (data.cid == null)
		{
			_a2 = $('#content > div > div > div a[href*="/novel/"]:eq(0)');

			if (_a2.length)
			{
				let _m = _a2.prop('href')
					.match(/\/novel\/(\d+)\/(\d+)\//)
				;

				if (_m)
				{
					data.cid = _m[1];
				}
			}
		}

		return data as any;
	}

	@GET('novel/{cid}/{novel_id}/index.htm')
	@methodBuilder()
	bookChapters(@ParamPath('novel_id') novel_id: number | string, @ParamPath('cid') cid: number | string): IBluebird<IWenku8BookChapters>
	{
		const jsdom = this._responseDataToJSDOM(this.$returnValue, this.$response);
		const $ = jsdom.$;

		novel_id = novel_id.toString();
		cid = cid.toString();

		let name = trimUnsafe($('body > #title').text());
		let authors = trimUnsafe($('#info').text().replace(/^[^：]+：/g, ''));

		let data: IWenku8BookChapters = {
			id: novel_id,
			cid,
			name,
			authors,
			chapters: [],
		};

		let volume_order = -1;
		let chapter_order = 0;

		let body = $('.css').find('td.vcss, td.ccss');

		body
			.each((i, elem) => {
				let _this = $(elem);

				if (_this.is('.vcss'))
				{
					volume_order++;

					let volume_name = trimUnsafe(_this.text());

					data.chapters[volume_order] = {
						volume_name,
						volume_order,
						chapters: [],
					};

					chapter_order = 0;
				}
				else
				{
					let _a = _this.find('a:eq(0)');

					if (_a.length)
					{
						let _m = _a
							.prop('href')
							.match(/(?:novel\/(\d+)\/(\d+)\/)?(\d+)\.htm/)
						;

						data.chapters[volume_order]
							.chapters
							.push({
								novel_id: novel_id as string,
								cid: cid as string,

								chapter_id: _m[3],
								chapter_name: trimUnsafe(_a.text()),

								chapter_order,
							})
						;
					}

					chapter_order++;
				}
			})
		;

		return data as any;
	}

	bookInfoWithChapters(@ParamPath('novel_id') novel_id: number | string)
	{
		return this
			.bookInfo(novel_id)
			.then(async function (this: Wenku8Client, data)
			{
				let { chapters } = await this.bookChapters(data.id, data.cid);

				return <IWenku8RecentUpdateRowBookWithChapters>{
					...data,
					chapters,
				}
			})
		;
	}

	cookiesRemoveTrack()
	{
		let _jar = this._jar();
		_jar.deleteCookieSync('jieqiVisitId');

		return this
	}

	//@POST('so.php')
	@GET('modules/article/search.php?searchtype={searchtype}&searchkey={searchkey}&page={page}')
	@CacheRequest({
		cache: {
			maxAge: 0,
		},
	})
	@methodBuilder({
		autoRequest: false,
	})
	search(@ParamMapAuto({
		searchtype: 'articlename',
		page: 1,
	}) searchData: {
		'searchkey': string,
		searchtype?: IArticleSearchType,
		page?: number,
	}): IBluebird<IWenku8SearchList>
	{
		let searchkey = searchData.searchkey;

		let url = `modules/article/search.php?searchtype=${searchData.searchtype}&searchkey=${encodeURIComponentGBK(searchkey)}&page=${searchData.page}`;

		let $requestConfig = {
			...this.$requestConfig,
			url,
		};

		return Bluebird
			.resolve(this.$http($requestConfig))
			.then(v => {
				return this._handleArticleList<IWenku8SearchList>(subobject({
					$requestConfig,
					$returnValue: v.data,
					$response: v.request,
				}, this) as this, {
					searchtype: searchData.searchtype,
					searchkey,
					page: searchData.page,
					end: undefined,
					last_update_time: 0,
					data: []
				})
			})
		;
	}

}

export default Wenku8Client
