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
	ParamMapAuto,
} from 'restful-decorator/lib/decorators';
import { ICookiesValue, LazyCookieJar } from 'lazy-cookies';
import { getCookieJar } from 'restful-decorator/lib/decorators/config/cookies';
import { IBluebird } from 'restful-decorator/lib/index';
import Bluebird from 'bluebird';
import { array_unique } from 'array-hyper-unique';
import consoleDebug from 'restful-decorator/lib/util/debug';
import toughCookie, { CookieJar } from 'tough-cookie';
import { fromURL, IFromUrlOptions, IJSDOM, createJSDOM, IConstructorOptions as IJSDOMConstructorOptions } from 'jsdom-extra';
import { combineURLs } from 'restful-decorator/lib/fix/axios';
import { paramMetadataRequestConfig } from 'restful-decorator/lib/wrap/abstract';
import { arrayBufferToString, sniffHTMLEncoding, iconvDecode, trimUnsafe, tryMinifyHTML } from './util';
import moment from 'moment';
import {
	IESJzoneRecentUpdate,
	IESJzoneRecentUpdateRow,
	IESJzoneRecentUpdateRowBook,
	IESJzoneBookChapters,
	IESJzoneRecentUpdateRowBookWithChapters,
	IParametersSlice,
} from './types';
import { minifyHTML } from 'jsdom-extra/lib/html';
import { buildVersion } from 'dmzj-api/lib/util';
import iconv, { decode as _iconvDecode, BufferFrom } from 'iconv-jschardet';
import { expand as expandUriTpl } from 'router-uri-convert/parser';
import subobject from 'restful-decorator/lib/helper/subobject';
import { getResponseUrl } from '@bluelovers/axios-util/lib';
import { Buffer } from 'buffer';
import { IUnpackedPromiseLikeReturnType } from '@bluelovers/axios-extend/lib';
import uniqBy from 'lodash/uniqBy';

/**
 * https://www.wenku8.net/index.php
 */
@BaseUrl('https://www.esjzone.cc')
@Headers({
	Referer: 'https://www.esjzone.cc',
})
@CacheRequest({
	cache: {
		maxAge: 6 * 60 * 60 * 1000,
	},
})
@RequestConfigs({
	responseType: 'arraybuffer',
})
export class ESJzoneClient extends AbstractHttpClient
{
	constructor(defaults?: AxiosRequestConfig, ...argv: any)
	{
		if (defaults && typeof defaults.jar === 'string')
		{
			defaults.jar = CookieJar.deserializeSync(defaults.jar)
		}

		super(defaults, ...argv);

		this._constructor();
	}

	protected _constructor()
	{
		/*
		this._setCookieSync({
			key: 'jieqiUserCharset',
			value: 'gbk',
			expires: 3600 * 24,
		});
		 */
	}

	_setCookieSync(...argv: Parameters<LazyCookieJar["setCookieSync"]>)
	{
		if (argv[1] == null)
		{
			argv[1] = this.$baseURL;
		}

		return this._jar().setCookieSync(...argv);
	}

	_serialize(jar?: CookieJar)
	{
		return (jar || this._jar()).serializeSync()
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

	protected _handleArticleList<T extends Partial<IESJzoneRecentUpdate>, R = T & Pick<IESJzoneRecentUpdate, 'end' | 'last_update_time' | 'data'>>(_this: this, retDataInit: T): R
	{
		const jsdom = _this._responseDataToJSDOM(_this.$returnValue, this.$response);
		const $ = jsdom.$;

		let tds = $('.product-list-inline-small .thumbnail');

		// @ts-ignore
		let pageEnd: number = $('#page-selection [data-lp]:last').attr('data-lp') | 0;
		// @ts-ignore
		let page2: number = $('#page-selection [data-lp]:eq(0)').attr('data-lp') | 0;

		if (!pageEnd)
		{
			$('script')
				.each((i, elem) => {
					let _this = $(elem);

					let code = _this.text();

					if (/#page-selection/.test(code))
					{
						let _m = code.match(/total\s*:\s*(\d+)/);

						if (_m)
						{
							pageEnd = (_m[1] as any) | 0;
						}

						_m = code.match(/\bpage\s*:\s*(\d+)/);

						if (_m)
						{
							page2 = (_m[1] as any) | 0;
						}
					}
				})
			;
		}

		let ret: T = {
			...retDataInit,
			page: page2 || retDataInit.page,
			end: pageEnd,
			last_update_time: 0,
			data: []
		};

		let lastUpdateTime = 0;

		tds
			.each((i, elem) =>
			{
				let _this = $(elem);

				let cover = _this
					.find('.coverMask img:eq(0)')
					.prop('src')
				;

				let _a = _this
					.find('.caption .caption-txt a')
					.eq(0)
				;

				let title = _a.text();

				title = trimUnsafe(title);

				let cid: string;
				let nid: string;
				let last_update_chapter_name: string;

				let _m0 = (_a.prop('href') as string)
					.match(/detail\/(\d+)/)
				;

				nid = _m0[1];
				last_update_chapter_name = _this
					.find('.caption .caption-date')
					.eq(0)
					.text() || undefined
				;

				ret.data.push({
					id: nid,
					name: title,
					cover,
					last_update_chapter_name,
				})
			})
		;

		ret.last_update_time = lastUpdateTime;

		//console.dir(ret);

		return ret as any;
	}

	protected _handleArticleTopListAll<T extends (page?: number, args?: any) => any>(method: T, args: IParametersSlice<T>, from: number = 0, pageTo: number = Infinity, {
		throwError,
		delay,
	}: {
		throwError?: boolean
		delay?: number,
	} = {})
	{
		delay |= 0;

		return (method as ESJzoneClient["articleList"])
			.apply(this, [
				from, ...args
			])
			.then(async function (this: ESJzoneClient, dataReturn)
			{
				const from: number = dataReturn.page;
				let { last_update_time, data } = dataReturn;

				throwError = !!throwError;

				pageTo = Math.min(dataReturn.end, pageTo);

				let to: number = from;

				while (to < pageTo)
				{
					delay && await Bluebird.delay(delay);

					let retP = (method as ESJzoneClient["articleList"])
						.apply(this, [
							to + 1, ...args
						])
					;

					let ret: IUnpackedPromiseLikeReturnType<ESJzoneClient["articleList"]>;

					if (throwError)
					{
						ret = await retP;
					}
					else
					{
						ret = await retP.catch(e => null);
					}

					if (ret != null && ret.page != from && ret.page != to)
					{
						to = ret.page;

						data.push(...ret.data);

						continue;
					}

					break;
				}

				return {
					...(dataReturn as Omit<IUnpackedPromiseLikeReturnType<T>, 'data'>),
					from,
					to,
					last_update_time,
					data: uniqBy(data, 'id'),
				} as IUnpackedPromiseLikeReturnType<T> & {
					from: number;
					to: number;
				}
			})
		;
	}

	/**
	 * 轻小说列表
	 * 注意與轻小说最近更新不同，此列表可能會額外多出其他小說
	 */
	@GET('list/{page}.html')
	@methodBuilder()
	articleList(@ParamPath('page', 1) page?: number): IBluebird<IESJzoneRecentUpdate>
	{
		return this._handleArticleList<IESJzoneRecentUpdate>(this, {
			page,
			end: undefined,
			last_update_time: 0,
			data: []
		}) as any
	}

	articleListAll(from: number, to: number = Infinity, options?: {
		throwError?: boolean
		delay?: number,
	}, ...args: IParametersSlice<this["articleList"]>)
	{
		return this._handleArticleTopListAll(this.articleList, args, from ,to, options)
	}

	/**
	 * @deprecated
	 * @todo
	 */
	isLogin(): IBluebird<boolean>
	{
		return Bluebird.resolve(false)
	}

	_decodeBuffer(buf: unknown | ArrayBuffer | Buffer)
	{
		return iconvDecode(Buffer.from(buf as any));
	}

	_responseDataToJSDOM(data: unknown, response: this["$response"])
	{
		const html = this._decodeBuffer(data);

		let config: IJSDOMConstructorOptions;

		if (response)
		{
			let $responseUrl = getResponseUrl(response);

			if (!$responseUrl && response.config && response.config.url)
			{
				$responseUrl = response.config.url.toString()
			}

			let cookieJar: CookieJar;

			if (response.config && response.config.jar && typeof response.config.jar === 'object')
			{
				cookieJar = response.config.jar;
			}

			if ($responseUrl || cookieJar)
			{
				config = {
					url: $responseUrl,
					cookieJar,
				};

				//console.debug(`_responseDataToJSDOM`, $responseUrl);
			}

			if (config)
			{
				return createJSDOM(html, config);
			}
		}

		return createJSDOM(html);
	}

	//@GET('book/{novel_id}.htm')
	@GET('detail/{novel_id}.html')
	@methodBuilder()
	bookInfo(@ParamPath('novel_id') novel_id: number | string): IBluebird<IESJzoneRecentUpdateRowBook>
	{
		let jsdom = this._responseDataToJSDOM(this.$returnValue, this.$response);
		const $ = jsdom.$;

		let data: IESJzoneRecentUpdateRowBook = ({
			id: novel_id.toString(),
			"name": undefined,
			"authors": undefined,
			"cover": undefined,
			"last_update_time": 0,
			"last_update_chapter_name": undefined,
			desc: undefined,

			tags: [],

			links: [],
			chapters: [],

		});

		data.name = trimUnsafe($('.container > .row:eq(0) h3:eq(0)').text());

		$('.product-detail .well .nav-list > li')
			.each(function (i, elem)
			{
				let _this = $(this);

				let _text = trimUnsafe(_this.text());

				let _m: RegExpMatchArray;

				if (_m = _text.match(/作者\s*[：:]\s*([^\n]+)/))
				{
					data.authors = trimUnsafe(_m[1])
				}
				else if (_m = _text.match(/(\d+\-\d+\-\d+)/))
				{
					let last_update_time = moment(_m[1]).unix();
					data.last_update_time = last_update_time;
				}

			})
		;

		$('.product-detail .well ')
			.find('.row a[href]')
			.not('.btn, .form-group *')
			.each((i, elem) => {

				let _this = $(elem);

				let name = trimUnsafe(_this.text());
				let href = _this.prop('href') as string;

				if (name === href)
				{
					name = undefined;
				}

				data.links.push({
					name,
					href,
				})

			})
		;

		$('.show-tag a[href*="tag"]')
			.each((i, elem) => {
				let _this = $(elem);
				let name = trimUnsafe(_this.text());

				if (name)
				{
					data.tags.push(name);
				}
			})
		;

		let _content = $('.product-detail:eq(0)');

		try
		{
			tryMinifyHTML(_content.html(), (html) => {
				_content.html(html);
			});
		}
		catch (e)
		{

		}

		data.cover = _content.find('img.product-image').prop('src');
		data.desc = trimUnsafe(_content.find('.book_description').text() || '');

		let volume_order = 0;
		let chapter_order = 0;

		let body = _content.find('#tab1 a[href], #tab1  .non');

		data.chapters[volume_order] = {
			volume_name: null,
			volume_order,
			chapters: [],
		};

		body
			.each((i, elem) => {
				let _this = $(elem);

				if (_this.is('.non'))
				{
					let volume_name = trimUnsafe(_this.text());

					if (volume_name)
					{
						if (chapter_order || data.chapters[volume_order].volume_name != null)
						{
							volume_order++;
						}

						data.chapters[volume_order] = {
							volume_name,
							volume_order,
							chapters: [],
						};

						chapter_order = 0;
					}
				}
				else
				{
					let _a = _this;

					if (_a.length)
					{
						let chapter_link = _a.prop('href');

						let _m = chapter_link
							.match(/esjzone\.cc\/forum\/(\d+)\/(\d+)\.ktml?/)
						;

						let chapter_name = trimUnsafe(_a.text());

						if (_m)
						{
							data.chapters[volume_order]
								.chapters
								.push({
									novel_id: _m[1],

									chapter_id: _m[2],
									chapter_name,

									chapter_order,
									chapter_link,
								})
							;
						}
						else
						{
							data.chapters[volume_order]
								.chapters
								.push({
									chapter_name,
									chapter_order,
									chapter_link,
								})
							;
						}

						data.last_update_chapter_name = chapter_name;
					}

					chapter_order++;
				}
			})
		;

		return data as any;
	}

	cookiesRemoveTrack()
	{
		/*
		let _jar = this._jar();
		_jar.deleteCookieSync('jieqiVisitId');
		 */

		return this
	}

	@POST('forum/{novel_id}/{chapter_id}.html')
	@FormUrlencoded
	@methodBuilder({
		autoRequest: false,
	})
	_getDecodeChapter(@ParamMapAuto() argv: {
		novel_id: string | number,
		chapter_id: string | number,
		code: string,
	})
	{
		return this.$http({
			...this.$requestConfig,
			method: 'POST',
			data: {
				plxf: 'getTranslation',
				"plxa[]": argv.code,
			}
		})
			.then(v => {

				let source = this
					._decodeBuffer(v.data)
					.toString()
					.replace(/\<JinJing\>/, '')
					.replace(/\<\/JinJing\>/, '')
				;

				return JSON.parse(source) as string[]
			})
		;
	}

	/**
	 *
	 * @example ```
	 * api.getChapter({
			novel_id: 2555,
			cid: 2,
			chapter_id: 101191,
		}, {
			cb(data)
			{

				data.$elem.after(`(插圖${data.i})\n`);
				data.$elem.remove();
			},
		})
	 ```
	 */
	@GET('forum/{novel_id}/{chapter_id}.html')
	@methodBuilder()
	getChapter(@ParamMapAuto() argv: {
		novel_id: string | number,
		chapter_id: string | number,
	}, options: {
		rawHtml?: boolean,
		cb?(data: {
			i: number,
			$elem: JQuery<HTMLElement>,
			$content: JQuery<HTMLElement>,
			src: string,
			imgs: string[],
		}): void,
	} = {}): IBluebird<{
		novel_id: string;
		chapter_id: string;
		imgs: string[];
		text: string;
		html?: string;
	}>
	{
		return Bluebird.resolve()
			.then(async () => {
				let jsdom = this._responseDataToJSDOM(this.$returnValue, this.$response);
				const $ = jsdom.$;

				let $content = $('.container .row:has(.forum-content)');

				$content.html(tryMinifyHTML($content.html()));

				$('p[class]:has(> script), .adsbygoogle').remove();

				const _decodeChapter = async () =>
				{
					let code: string;

					if (!code)
					{
						code = _getCode(jsdom.serialize());
					}

					if (!code)
					{
						$('script')
							.each((i, elem) =>
							{

								let html = $(elem).text();

								code = _getCode(html);
							})
						;
					}

					await this._getDecodeChapter({
						novel_id: argv.novel_id,
						chapter_id: argv.chapter_id,
						code,
					})
						.then(a => {
							let elems = $('.trans');

							a.forEach((v, i) => {
								elems.eq(i).html(v);
							});

							return a;
						})
					;

					function _getCode(html: string): string
					{
						let m = html
							.match(/getTranslation\(['"]([^\'"]+)['"]/i)
						;

						if (m)
						{
							return m[1];
						}
					}
				};

				await _decodeChapter();

				$('p[class]:has(> script), .adsbygoogle').remove();

				$content = $('.container .forum-content');

				_p_2_br($content.find('> p'), $);

				let imgs = [] as string[];

				const { cb } = options;

				let html: string;

				if (options.rawHtml)
				{
					html = $content.html();
				}

				$content
					.find('img[src]')
					.each((i, elem) => {
						let $elem = $(elem);
						let src = $elem.prop('src').trim();

						imgs.push(src);

						if (cb)
						{
							cb({
								i,
								$elem,
								$content,
								src,
								imgs,
							})
						}
					})
				;

				let text = $content
					.text()
					.replace(/^\s+|\s+$/g, '')
				;

				return {
					novel_id: argv.novel_id.toString(),
					chapter_id: argv.chapter_id.toString(),
					imgs,
					text,
					html,
				} as any
			})
		;
	}

}

export default ESJzoneClient

function _p_2_br(target: any, $: any)
{
	return $(target)
		.each(function (i: any, elem: any)
		{
			let _this = $(elem) as JQuery<HTMLElement>;

			let _html = _this
				.html()
				.replace(/(?:&nbsp;?)/g, ' ')
				.replace(/[\xA0\s]+$/g, '')
			;

			if (_html == '<br/>' || _html == '<br>')
			{
				_html = '';
			}

			_this.after(`${_html}<br/>`);
			_this.remove()
		})
		;
}
