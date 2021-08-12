import AbstractHttpClientWithJSDom from 'restful-decorator-plugin-jsdom/lib';
import {
	BaseUrl,
	CacheRequest,
	FormUrlencoded,
	GET,
	Headers,
	methodBuilder,
	ParamPath,
	POST,
	ParamMapAuto,
	RequestConfigs,
} from 'restful-decorator/lib/decorators';
import { IBluebird } from 'restful-decorator/lib/index';
import Bluebird from 'bluebird';
import { IJSDOM } from 'jsdom-extra';
import { trimUnsafe } from './util';
import moment from 'moment';
import {
	IESJzoneRecentUpdate,
	IESJzoneRecentUpdateRowBook,
	IParametersSlice,
	IESJzoneRecentUpdateDay,
	IESJzoneChapter,
	IESJzoneChapterFromPasswordReturnRaw,
	IESJzoneChapterByPasswordForm,
	IESJzoneChapterOptions,
	IESJzoneChapterLocked,
} from './types';
import { IUnpackedPromiseLikeReturnType } from '@bluelovers/axios-extend/lib';
import uniqBy from 'lodash/uniqBy';
import { ReturnValueToJSDOM } from 'restful-decorator-plugin-jsdom/lib/decorators/jsdom';
import orderBy from 'lodash/orderBy';
import tryMinifyHTML, { tryMinifyHTMLOfElem } from 'restful-decorator-plugin-jsdom/lib/html';
import { _p_2_br } from 'restful-decorator-plugin-jsdom/lib/jquery';
import { _getChapterData } from './util/_getChapterData';
import { _getChapterDomContent } from './util/_getChapterDomContent';
import { _getBookLinks } from './util/_getBookLinks';
import { _getBookInfo } from './util/_getBookInfo';
import { _matchDateString } from './util/_matchDateString';
import { _getBookChapters } from './util/_getBookChapters';
import { _parseSiteLink } from './util/_parseSiteLink';
import { _getBookTags } from './util/_getBookTags';
import { _getBookCover } from './util/_getBookCover';
import { _getBookElemDesc } from './util/_getBookElemDesc';
import { _remove_ad } from './util/_remove_ad';
import { _fixCoverUrl } from './util/_fixCoverUrl';
import {
	_parseSiteLinkChapterFromPasswordReturn,

} from './util/_parseChapterFromPasswordReturn';
import { ParamMapPath } from 'restful-decorator/lib/decorators/body';
import { _checkChapterLock } from './util/_checkChapterLock';
import { _handleChapterContent, _handleChapterContentRoot } from './util/_handleChapterContent';
import { CookieJar } from 'tough-cookie';

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
export class ESJzoneClient extends AbstractHttpClientWithJSDom
{

	protected _handleArticleList<T extends Partial<IESJzoneRecentUpdate>, R = T & Pick<IESJzoneRecentUpdate, 'end' | 'last_update_time' | 'data'>>(_this: this,
		retDataInit: T,
	): R
	{
		const jsdom = _this._responseDataToJSDOM(_this.$returnValue, this.$response);
		const $ = jsdom.$;

		// @ts-ignore
		let pageEnd: number = $('#page-selection [data-lp]:last').attr('data-lp') | 0;
		// @ts-ignore
		let page2: number = $('#page-selection [data-lp]:eq(0)').attr('data-lp') | 0;

		if (!pageEnd)
		{
			$('script')
				.each((i, elem) =>
				{
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
			data: [],
		};

		let lastUpdateTime = 0;

		let tds = $('.container .shop-toolbar + .row > div:not(.hidden-sm-up)');

		tds
			.each((i, elem) =>
			{
				let _this = $(elem);

				let cover = _this
					.find('.card-img-tiles .main-img img:eq(0)')
					.prop('src')
				;

				cover = _fixCoverUrl(cover);

				let _a = _this
					.find('.card-body .card-title a')
					.eq(0)
				;

				let title = trimUnsafe(_a.text());

				let cid: string;
				let nid: string;
				let last_update_chapter_name: string;

				let _m0 = _parseSiteLink(_a.prop('href'))

				nid = _m0.novel_id;

				last_update_chapter_name = _this
					.find('.card-body .card-ep')
					.eq(0)
					.text() || undefined
				;

				if (last_update_chapter_name)
				{
					last_update_chapter_name = trimUnsafe(last_update_chapter_name)
				}

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

	protected _handleArticleTopListAll<T extends (page?: number, args?: any) => any>(method: T,
		args: IParametersSlice<T>,
		from: number = 0,
		pageTo: number = Infinity,
		{
			throwError,
			delay,
		}: {
			throwError?: boolean
			delay?: number,
		} = {},
	)
	{
		delay |= 0;

		return (method as ESJzoneClient["articleList"])
			.apply(this, [
				from, ...args,
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
							to + 1, ...args,
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
					// @ts-ignore
					...(dataReturn as any as Omit<IUnpackedPromiseLikeReturnType<T>, 'data'>),
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
	articleList(@ParamPath('page', 1) page?: number, ...argv: any[]): IBluebird<IESJzoneRecentUpdate>
	{
		return this._handleArticleList<IESJzoneRecentUpdate>(this, {
			page,
			end: undefined,
			last_update_time: 0,
			data: [],
		}) as any
	}

	articleListAll(from: number, to: number = Infinity, options?: {
		throwError?: boolean
		delay?: number,
	}, ...args: IParametersSlice<this["articleList"]>)
	{
		return this._handleArticleTopListAll(this.articleList, args, from, to, options)
	}

	/**
	 * @deprecated
	 * @todo
	 */
	isLogin(): IBluebird<boolean>
	{
		return Bluebird.resolve(false)
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
			"titles": undefined,
			"authors": undefined,
			"cover": undefined,
			"last_update_time": 0,
			"last_update_chapter_name": undefined,
			desc: undefined,

			tags: [],

			links: [],
			chapters: [],

		});

		let _content = $('.container')

		_getBookInfo($, data);

		_getBookLinks($, data.links);

		_getBookTags($, data.tags);

		let cover = _getBookCover($)
		if (cover = _fixCoverUrl(cover))
		{
			data.cover = cover;
		}

		let $desc = tryMinifyHTMLOfElem(_getBookElemDesc($));

		_p_2_br($desc.find('p'), $, true);

		data.desc = trimUnsafe($desc.text() || '');

		_getBookChapters($, _content, data);

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
				},
			})
			.then(v =>
			{

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
	 * @param {IESJzoneChapterByPasswordForm} data
	 * @returns {Bluebird<IJSDOM>}
	 */
	@POST('inc/forum_pw.php')
	@FormUrlencoded
	@RequestConfigs({
		responseType: 'json',
	})
	@methodBuilder()
	_queryChapterByPassword(@ParamMapAuto() data: IESJzoneChapterByPasswordForm): Bluebird<IJSDOM>
	{
		const json = this.$returnValue as IESJzoneChapterFromPasswordReturnRaw;

		let jsdom = _parseSiteLinkChapterFromPasswordReturn(this, json).jsdom

		if (!jsdom)
		{
			let e = new Error(`Invalid password: ${data.pw}`);

			// @ts-ignore
			e.response = this.$response;

			throw e
		}

		return jsdom as any
	}

	/**
	 * @see https://www.esjzone.cc/forum/1604843935/100652.html
	 */
	_getChapterByPassword(argv: {
		novel_id: string | number,
		chapter_id: string | number,
		password?: string,
	}, jsdom?: IJSDOM, data?: Partial<IESJzoneChapterByPasswordForm>)
	{
		return Bluebird.resolve()
			.then(async () =>
			{
				if (typeof jsdom === 'undefined' || jsdom === null)
				{
					jsdom = await this._getChapter(argv).then(m => m.$returnValue)
				}

				let $ = jsdom.$;

				let _check = _checkChapterLock($)

				if (_check.locked)
				{
					data ??= {};

					data.code = argv.novel_id;
					data.rid = argv.chapter_id;
					data.pw = argv.password ?? data.pw;

					data.token ||= _check.form.token;

					if (data.pw?.length)
					{
						this._setCookieSync({
							key: 'pw_record',
							value: data.rid as string,
						});
						this._setCookieSync({
							key: 'last_visit_post',
							value: data.rid as string,
						});

						jsdom = await this._queryChapterByPassword(data as IESJzoneChapterByPasswordForm)
					}
				}

				return jsdom
			})
	}

	@GET('forum/{novel_id}/{chapter_id}.html')
	@ReturnValueToJSDOM()
	@methodBuilder()
	_getChapter(@ParamMapPath() argv: {
		novel_id: string | number,
		chapter_id: string | number,
	}): Bluebird<Omit<ESJzoneClient, '$returnValue'> & {
		$returnValue: IJSDOM
	}>
	{
		return this as any
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
	getChapter(argv: {
		novel_id: string | number,
		chapter_id: string | number,
		password?: string,
	}, options: IESJzoneChapterOptions = {})
	{
		return this._getChapter(argv)
			.then<IESJzoneChapterLocked | IESJzoneChapter>(async (api) =>
			{
				let $ = api.$returnValue.$;

				_handleChapterContentRoot($, argv, options);

				let jsdom2 = await this._getChapterByPassword(argv, api.$returnValue);

				let { author, dateline } = _getChapterData($)

				return {
					novel_id: argv.novel_id.toString(),
					chapter_id: argv.chapter_id.toString(),

					..._handleChapterContent(jsdom2.$, argv, options),

					author,
					dateline,
				}
			})
			;
	}

	@GET('update')
	@ReturnValueToJSDOM()
	@methodBuilder()
	recentUpdateDay(): IBluebird<IESJzoneRecentUpdateDay>
	{
		//const jsdom = this._responseDataToJSDOM(this.$returnValue, this.$response);
		const jsdom = this.$returnValue as IJSDOM;
		const $ = jsdom.$;

		let tabs = $('.container .nav.nav-pills[role="tablist"] li a.nav-link');
		let divs = $('.container .tab-content > div[id][role="tabpanel"]');

		let last_update_time = 0;

		let ret: IESJzoneRecentUpdateDay = {
			days: 0,
			size: 0,
			last_update_time,
			data: {},
			summary: {},
		};

		const { data, summary } = ret;

		tabs
			.each((i, tab_elem) =>
			{

				let timestamp = moment($(tab_elem).text()).unix();
				let div = divs.eq(i);

				data[timestamp] = data[timestamp] || [];

				last_update_time = Math.max(last_update_time, timestamp, 0);

				div
					.find('> div')
					.each((i, elem) =>
					{
						let _this = $(elem);

						let cover = _this
							.find('.main-img img:eq(0)')
							.prop('src')
						;

						cover = _fixCoverUrl(cover);

						let _a = _this
							.find('.card-body .card-title a')
							.eq(0)
						;

						let title = _a.text();

						title = trimUnsafe(title);

						let cid: string;
						let nid: string;
						let last_update_chapter_name: string;

						/*
						let _m0 = (_a.prop('href') as string)
							.match(/detail\/(\d+)/)
						;
						nid = _m0[1];
						 */

						let _m0 = _parseSiteLink(_a.prop('href'));
						nid = _m0.novel_id;

						last_update_chapter_name = _this
							.find('.card-body .card-ep')
							.eq(0)
							.text() || undefined
						;

						data[timestamp].push({
							id: nid,
							name: title,
							cover,
							last_update_chapter_name,
						});

						summary[nid] = Math.max(timestamp, summary[nid] | 0);
					})
				;

				data[timestamp] = orderBy(data[timestamp], ["id"], ["asc"]);

			})
		;

		ret.last_update_time = last_update_time;
		ret.days = Object.keys(data).length;
		ret.size = Object.keys(summary).length;

		return ret as any;
	}

}

export default ESJzoneClient

/*
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
*/
