import { AbstractHttpClientWithJSDom } from 'restful-decorator-plugin-jsdom/lib';
import {
	BaseUrl,
	CacheRequest,
	FormUrlencoded,
	GET,
	Headers,
	methodBuilder,
	ParamMapAuto,
	ParamPath,
	ParamQuery,
	POST,
} from 'restful-decorator/lib/decorators';
import { IBluebird } from 'restful-decorator/lib/index';
import Bluebird from 'bluebird';
import { trimUnsafe } from './util';
import { removeZeroWidth } from 'zero-width';

import { iconvDecode } from 'restful-decorator-plugin-jsdom/lib/util/gbk';

import moment from 'moment';
import {
	IArticleSearchType,
	IArticleToplistSortType,
	IParametersSlice,
	IWenku8BookChapters,
	IWenku8RecentUpdate,
	IWenku8RecentUpdateRowBook,
	IWenku8RecentUpdateRowBookWithChapters,
	IWenku8RecentUpdateWithSortType,
	IWenku8SearchList,
} from './types';
import { encodeURIComponent as encodeURIComponentGBK } from './util/urlEncodeGBK';
import { subobject } from 'restful-decorator/lib/helper/subobject';
import { Buffer } from 'buffer';
import { IUnpackedPromiseLikeReturnType } from '@bluelovers/axios-extend/lib';
import uniqBy from 'lodash/uniqBy';
import { tryMinifyHTML } from 'restful-decorator-plugin-jsdom/lib/html';

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
		exclude: {
			query: false,
		}
	},
})
export class Wenku8Client extends AbstractHttpClientWithJSDom
{

	protected _constructor()
	{
		this._setCookieSync({
			key: 'jieqiUserCharset',
			value: 'gbk',
			expires: 3600 * 24,
		});
	}

	@POST('login.php?do=submit&action=login')
	@FormUrlencoded
	@CacheRequest({
		cache: {
			maxAge: 0,
		},
	})
	@methodBuilder({
		disableFallbackReturnValue: true,
	})
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

	articleToplistAll(from: number, to: number = Infinity, options?: {
		throwError?: boolean
		delay?: number,
	}, ...args: IParametersSlice<this["articleToplist"]>)
	{
		return this._handleArticleTopListAll(this.articleToplist, args, from ,to, options)
	}

	protected _handleArticleTopListAll<T extends (page: number, args: any) => any>(method: T, args: IParametersSlice<T>, from: number = 0, pageTo: number = Infinity, {
		throwError,
		delay,
	}: {
		throwError?: boolean
		delay?: number,
	} = {})
	{
		delay |= 0;

		return (method as Wenku8Client["articleToplist"])
			.call(this, from, ...args)
			.then(async function (this: Wenku8Client, dataReturn)
			{
				const from: number = dataReturn.page;
				let to: number = from;
				let { last_update_time, data } = dataReturn;

				throwError = !!throwError;

				while (to < pageTo)
				{
					delay && await Bluebird.delay(delay);

					let retP = (method as Wenku8Client["articleToplist"])
						.call(this, to + 1, ...args)
					;

					let ret: IUnpackedPromiseLikeReturnType<Wenku8Client["articleToplist"]>;

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
						last_update_time = Math.max(last_update_time, ret.last_update_time);

						data.push(...ret.data);

						continue;
					}

					break;
				}

				return {
					...(dataReturn),
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

	articleListAll(from: number, to: number = Infinity, options?: {
		throwError?: boolean
		delay?: number,
	}, ...args: IParametersSlice<this["articleList"]>)
	{
		return this._handleArticleTopListAll(this.articleList, args, from ,to, options)
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

	//@GET('book/{novel_id}.htm')
	@GET('modules/article/articleinfo.php?id={novel_id}&charset=gbk')
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
			"tags": undefined,
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
			console.log(_cr.text())
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

			if (data.cid == null)
			{
				throw new Error(`data.cid == null`)
			}
		}

		let _tags = trimUnsafe(_content.find('.hottext:eq(0)').text() || '');

		if (/^作品Tags：/.test(_tags))
		{
			data.tags = _tags
				.replace(/^作品Tags：\s*/, '')
				.split(/\s+/)
				.filter(Boolean)
			;

			if (!data.tags.length)
			{
				data.tags = void 0;
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

	_encodeURIComponent(text: string): string
	{
		return encodeURIComponentGBK(text)
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

		let url = `modules/article/search.php?searchtype=${searchData.searchtype}&searchkey=${this._encodeURIComponent(searchkey)}&page=${searchData.page}`;

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
	@GET('https://www.wenku8.net/novel/{cid}/{novel_id}/{chapter_id}.htm')
	@methodBuilder()
	getChapter(@ParamMapAuto() argv: {
		novel_id: string | number,
		cid: string | number,
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
		cid: string;
		chapter_id: string;
		imgs: string[];
		text: string;
		html?: string;
	}>
	{
		let jsdom = this._responseDataToJSDOM(this.$returnValue, this.$response);
		const $ = jsdom.$;

		let $content = $('#content');

		$content.find('#contentdp').remove();
		$content.find('#contentdp').remove();
		$content.find('#contentdp').remove();

		$content.html(tryMinifyHTML($content.html()).replace(/^(&nbsp;){4}/gm, ''));

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

		let text = removeZeroWidth($content.text());

		return {
			novel_id: argv.novel_id.toString(),
			cid: argv.cid.toString(),
			chapter_id: argv.chapter_id.toString(),
			imgs,
			text,
			html,
		} as any
	}

	_iconvDecode(buf: Buffer): string
	{
		return iconvDecode(buf);
	}

	/**
	 * @todo implement tag search
	 * @see https://www.wenku8.net/modules/article/tags.php
	 */
	@GET('/modules/article/tags.php')
	tags()
	{
		throw new Error('Not implemented');
	}

}

export default Wenku8Client
