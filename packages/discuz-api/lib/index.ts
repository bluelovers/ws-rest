import { AbstractHttpClient } from 'restful-decorator/lib';
import AbstractHttpClientWithJSDom from 'restful-decorator-plugin-jsdom/lib';
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
import { ICookiesValue, LazyCookieJar, ICookiesValueInput } from 'lazy-cookies';
import { getCookieJar } from 'restful-decorator/lib/decorators/config/cookies';
import { IBluebird } from 'restful-decorator/lib/index';
import Bluebird from 'bluebird';
import { array_unique } from 'array-hyper-unique';
import consoleDebug from 'restful-decorator/lib/util/debug';
import toughCookie, { CookieJar } from 'tough-cookie';
import {
	fromURL,
	IFromUrlOptions,
	IJSDOM,
	createJSDOM,
	IConstructorOptions as IJSDOMConstructorOptions,
} from 'jsdom-extra';
import { combineURLs } from 'restful-decorator/lib/fix/axios';
import { paramMetadataRequestConfig } from 'restful-decorator/lib/wrap/abstract';
import { trimUnsafe } from './util';
import moment from 'moment';
import {
	IParametersSlice,
	IDiscuzForumMini,
	IDiscuzForum,
	IDzParamForumdisplay,
	IDiscuzTaskList,
	IDiscuzTaskRow,
	IDzParamNoticeView,
	IDiscuzForumPickThreads,
	IDiscuzThread,
	IDzParamThreadOptions2,
	IDzParamThreadOptions,
	SymDzPost,
	IDiscuzPost, IDiscuzThreadPickRange, IDzWindow, IJSDOM_WITH,
} from './types';
import { IUnpackedPromiseLikeReturnType, IBluebirdAxiosResponse } from '@bluelovers/axios-extend/lib';
import uniqBy from 'lodash/uniqBy';
import tryMinifyHTML from 'restful-decorator-plugin-jsdom/lib/html';
import { getConfig, setConfig } from 'restful-decorator/lib/decorators/config/util';
import merge from 'restful-decorator/lib/util/merge';
import LazyURLSearchParams from 'http-form-urlencoded';
import LazyURL from 'lazy-url';
import {
	_checkLoginByJQuery,
	_jqForumThreads,
	_jqForumStickThreads,
	_jqForumThreadTypes,
	_checkLoginUsername,
} from './util/jquery';
import { ITSRequiredWith, ITSPickExtra, ITSResolvable } from 'ts-type';
import { isResponseFromAxiosCache } from '@bluelovers/axios-util/lib';
import { ReturnValueToJSDOM } from 'restful-decorator-plugin-jsdom/lib/decorators/jsdom';
import crlf from 'crlf-normalize';

@CacheRequest({
	cache: {
		maxAge: 6 * 60 * 60 * 1000,
	},
})
export class DiscuzClient extends AbstractHttpClientWithJSDom
{

	constructor(...argv: ConstructorParameters<typeof AbstractHttpClient>)
	{
		let [defaults = {}] = argv;

		if (!defaults.baseURL)
		{
			throw new TypeError(`baseURL must set`)
		}

		argv[0] = defaults;

		super(...argv);
	}

	protected _constructor()
	{
		return super._constructor();
	}

	@POST('member.php?mod=logging&action=login&loginsubmit=yes&infloat=yes&lssubmit=yes')
	@FormUrlencoded
	@CacheRequest({
		cache: {
			maxAge: 0,
		},
	})
	@methodBuilder()
	loginByForm(@ParamMapAuto({
		cookietime: 315360000,
	}) inputData: {
		username: string,
		password: string,
		cookietime?: number,
	}): IBluebird<boolean|string>
	{
		let jsdom = this._responseDataToJSDOM(this.$response.data, this.$response);

		let username = _checkLoginUsername(jsdom.$);

		if (username != null)
		{
			return Bluebird.resolve(username)
		}

		let bool = _checkLoginByJQuery(jsdom.$);

		if (!bool)
		{
			return Bluebird.reject(bool);
		}

		return bool as any;
	}

	_getAuthCookies()
	{
		let ret = this._jar()
			.findCookieByKey(/_(?:sid|saltkey|auth)$/, this.$baseURL)
			.reduce((a, b) =>
			{

				let _m = /_(sid|saltkey|auth)$/.exec(b.key);

				// @ts-ignore
				a[_m[1]] = b;

				return a;
			}, {} as Record<'sid' | 'saltkey' | 'auth', toughCookie.Cookie>)
		;

		return ret;
	}

	/**
	 * 取得板塊資訊
	 */
	@GET('forum.php?mod=forumdisplay&fid={fid}')
	@methodBuilder()
	forum(@ParamMapAuto(<ITSPickExtra<IDzParamForumdisplay, 'fid'>>{
		filter: 'dateline',
		orderby: 'dateline',
	}) argv: IDzParamForumdisplay): IBluebird<IDiscuzForum>
	{
		const jsdom = this._responseDataToJSDOM(this.$returnValue, this.$response);

		const { $ } = jsdom;

		let fid = String(argv.fid);

		let forum_name = $(`#ct h1 a[href$="forum.php?mod=forumdisplay&fid=${fid}"]`).text();

		forum_name = trimUnsafe(forum_name);

		let subforum_area = $(`#wp #ct #subforum_${argv.fid}.bm_c`);

		let subforums: IDiscuzForumMini[] = [];

		subforum_area
			.find('.fl_g')
			.each((i, elem) =>
			{
				let _this = $(elem);

				let _a = _this
					.find('a[href*="forumdisplay"]:eq(0)')
				;

				let _url = new URL(_a.prop('href'));

				let forum_name: string;

				if (_a.find('> img[src*="forum"][alt]').length)
				{
					forum_name = _a.find('> img[src*="forum"][alt]').prop('alt');
				}
				else
				{
					forum_name = _a.text();
				}

				forum_name = trimUnsafe(forum_name);

				let fid = (_url.searchParams.get('fid') as any);

				subforums.push({
					fid,
					forum_name,
				})
			})
		;

		let thread_types = _jqForumThreadTypes($);

		let { threads, last_thread_time, last_thread_subject, last_thread_id } = _jqForumThreads($);

		let pages: number = 0;

		let _a = $('#fd_page_top a.last[href*="page="]').eq(0);

		if (!_a.length)
		{
			_a = $('#fd_page_top .pg a[href*="page="]')
				.not('.nxt')
				.eq(-1)
			;
		}

		if (_a.length)
		{
			pages = (new LazyURL(_a.prop('href')).searchParams.get('page') as any) | 0;
		}

		let page = ($('#fd_page_top .pg :input[name="custompage"]').val() as any) | 0;

		_a = $(`#forum_rules_${fid} > div`);

		let forum_rules: string;

		if (_a.length)
		{
			_a
				.find('[data-cfemail]')
				.removeAttr('data-cfemail')
			;

			forum_rules = trimUnsafe(tryMinifyHTML(_a.html()));
		}

		let moderator: IDiscuzForum["moderator"] = {};

		_a = $(`div:has(> #forum_rules_${fid}) > div:eq(0)`);

		if (!_a.length)
		{
			_a = $(`.boardnav #ct .mn .bm .bm_c div`);
		}

		_a
			.find('a[href*="username="]')
			.each((i, elem) =>
			{

				let _a = $(elem);

				let username = new LazyURL(_a.prop('href'))
					.searchParams.get('username')
				;

				let name = _a.text();

				moderator[username] = name;
			})
		;

		let stickthread = _jqForumStickThreads($);

		return ({
			fid,
			forum_name,

			last_thread_time,
			last_thread_id,
			last_thread_subject,

			pages,
			page,

			moderator,

			forum_rules,

			subforums,

			thread_types,

			stickthread,

			threads,
		} as IDiscuzForum) as any
	}

	forumThread(argv: ITSRequiredWith<IDzParamForumdisplay, 'page'>)
	{
		return this.forum(argv)
	}

	/**
	 * 取得板塊下指定範圍頁數的主題列表
	 */
	forumThreads(argv: IDzParamForumdisplay, range: {
		from?: number,
		to?: number,
		delay?: number,
		/**
		 * 允許中斷後續頁數抓取
		 */
		next?(cur: IDiscuzForum, forum: IDiscuzForum): ITSResolvable<boolean>,
	} = {})
	{
		let { from = 1, to = Infinity, delay, next } = range;

		from |= 0;
		delay |= 0;

		return this.forum({
				...argv,
				page: from,
			})
			.then(async function (this: DiscuzClient, forum)
			{
				to = Math.min(to, forum.pages);

				if (forum.page > 0)
				{
					if (forum.page != from)
					{
						throw new RangeError(`forum.page: ${forum.page} != from: ${from}`)
					}

					if (to < from)
					{
						throw new RangeError(`to: ${to} < from: ${from}`)
					}

					let pi = from;

					let _not_cache: boolean;

					_not_cache = delay > 0 && !isResponseFromAxiosCache(this.$response);

					let _updated: boolean;
					let data: IDiscuzForum = forum;

					while (++pi <= to)
					{
						if (next && !await next(data, forum))
						{
							_updated = true;
							break;
						}

						if (_not_cache)
						{
							await Bluebird.delay(delay);
						}

						data = await this.forum({
								...argv,
								page: pi,
							})
							.tap(function (this: DiscuzClient)
							{
								_not_cache = delay > 0 && !isResponseFromAxiosCache(this.$response);
							})
						;

						forum.threads.push(...data.threads);

						_updated = true;
					}

					delete forum.page;

					if (_updated)
					{
						forum.threads = uniqBy(forum.threads, 'tid');
					}
				}

				return <IDiscuzForumPickThreads>{
					pageFrom: from,
					pageTo: to,
					...forum,
				};
			})
			;
	}

	@GET('home.php?mod=space&do=notice&view=system')
	@ReturnValueToJSDOM()
	@CacheRequest({
		cache: {
			maxAge: 0,
		},
	})
	@methodBuilder()
	isLogin(): IBluebird<boolean | string>
	{
		const jsdom = this.$returnValue as IJSDOM;

		let username = _checkLoginUsername(jsdom.$);

		if (username != null)
		{
			return Bluebird.resolve(username)
		}

		return Bluebird.resolve(_checkLoginByJQuery(jsdom.$))
	}

	hasCookiesAuth()
	{
		return this._jar()
			.findCookieByKey(/^.+_auth$/)
			.length > 0
			;
	}

	taskList(): IBluebird<IDiscuzTaskList>
	{
		let self = this;
		return this.taskListNew()
			.then(async (taskList) => {
				return {
					...taskList,
					doing: await self.taskListDoing(),
				}
			})
		;
	}

	@GET('home.php?mod=task')
	@CacheRequest({
		cache: {
			maxAge: 0,
		},
	})
	@methodBuilder()
	taskListNew(): IBluebird<IDiscuzTaskList>
	{
		const jsdom = this._responseDataToJSDOM(this.$returnValue, this.$response);
		const { $ } = jsdom;

		let data: IDiscuzTaskList = {
			disallow: [],
			allow: [],
		};

		$('#ct .ptm:eq(0) > table')
			.find('> tr, > tbody > tr')
			.each((i, elem) =>
			{

				let _tr = $(elem);

				let _a = _tr.find('h3:eq(0) a:eq(0)');

				let task_name = _a.text();

				let task_id = new LazyURL(_a.prop('href')).searchParams.get('id');

				let task_desc = _tr
					.find('p.xg2:eq(0)')
					.text()
					.replace(/^[\n\r]+/g, '')
					.replace(/\s+$/g, '')
				;

				let task_credit = _tr
					.find('> td:eq(-2)')
					.text()
					.replace(/^[\n\r]+/g, '')
					.replace(/\s+$/g, '')
				;

				_a = _tr.find('> td:eq(-1) a[href*="do=apply"]').filter(`[href*="id=${task_id}"]`);

				let obj: IDiscuzTaskRow = {
					task_id,
					task_name,
					task_desc,
					task_credit,
				};

				data[(_a.length ? 'allow' : 'disallow')]
					.push(obj)
				;
			})
		;

		return data as any;
	}

	@GET('home.php?mod=task&item=doing')
	@CacheRequest({
		cache: {
			maxAge: 0,
		},
	})
	@methodBuilder()
	taskListDoing(): IBluebird<IDiscuzTaskRow[]>
	{
		const jsdom = this._responseDataToJSDOM(this.$returnValue, this.$response);
		const { $ } = jsdom;

		return [] as any
	}

	@GET('home.php?mod=task&do=apply&id={task_id}')
	@CacheRequest({
		cache: {
			maxAge: 0,
		},
	})
	@methodBuilder()
	taskApply(@ParamPath('task_id') task_id: number | string): IBluebirdAxiosResponse<unknown>
	{
		return
	}

	@GET('home.php?mod=space&do=notice&view={view}')
	@CacheRequest({
		cache: {
			maxAge: 0,
		},
	})
	@methodBuilder()
	noticeView(@ParamPath<string, IDzParamNoticeView>('view', 'system') view: IDzParamNoticeView = 'system'): IBluebirdAxiosResponse<unknown>
	{
		return
	}

	@GET('forum.php?mod=viewthread&tid={tid}')
	@ReturnValueToJSDOM()
	@methodBuilder()
	thread(@ParamMapAuto(<IDzParamThreadOptions2>{
		ordertype: 0,
	}) thread_options2: IDzParamThreadOptions2): IBluebird<IDiscuzThread>
	{
		const jsdom = this.$returnValue as IJSDOM;
		const { $ } = jsdom;

		let thread_options = {
			...thread_options2,
		} as any as IDzParamThreadOptions;

		// @ts-ignore
		delete thread_options.tid;

		if (!thread_options.extra)
		{
			delete thread_options.extra;
		}

		if (!thread_options.authorid == null)
		{
			delete thread_options.authorid;
		}

		if (!thread_options.ordertype)
		{
			delete thread_options.ordertype;
		}

		let tid = thread_options2.tid.toString();

		let postlist = $('#ct #postlist');

		let subject: string;

		postlist.find('#thread_subject')
			.each((i, elem) =>
			{

				let text = $(elem).text();

				if (text != '')
				{
					text = trimUnsafe(text)

					if (text != '')
					{
						subject = text;
					}
				}

			})
		;

		let posts = [] as IDiscuzThread["posts"];
		let thread_attach: IDiscuzThread["thread_attach"] = {} as any;

		let pgt = $('#ct #pgt .pg');

		let page = (pgt.find(':input[name="custompage"]').val() as any) | 0;
		let pages: number;

		let _a = pgt.find('a.last');
		if (!_a.length)
		{
			_a = pgt.find('a + label').prev('a');
		}

		if (_a.length)
		{
			pages = (_a.text() as any) | 0;
		}

		let threadView: IDiscuzThread = {
			tid,
			subject,
			author: undefined,
			authorid: undefined,
			thread_options,
			pages,
			page,
			posts,
			thread_attach,
			post_pay: undefined,
		};

		if (page > 1)
		{
			let _a = $('#tath a[href*="uid="]')
				.not(':has(img)')
				.eq(0)
			;

			if (_a.length)
			{
				threadView.authorid = new LazyURL(_a.prop('href'))
					.searchParams
					.get('uid')
				;

				threadView.author = trimUnsafe(_a.text());
			}
		}

		postlist
			.find('> div[id^="post_"]')
			.each((i, elem) =>
			{

				let post = $(elem);

				let pid = (post.prop('id') as string)
					.replace(/^post_/, '')
				;

				let author: string;
				let authorid: string;

				let _a = post.find(`#favatar${pid} .authi a[href*="uid="]:eq(0)`);

				if (_a.length)
				{
					author = _a.text();

					authorid = new LazyURL(_a.prop('href'))
						.searchParams
						.get('uid')
				}

				let _postmessage = post.find(`#postmessage_${pid}`);
				let postmessage: string;

				let last_edit: number;

				let attach: IDiscuzPost["attach"];

				let post_pay: IDiscuzPost["post_pay"];

				if (post.find('.viewpay').length)
				{
					post_pay = {
						exixts: true,
					};

					if (!threadView.post_pay)
					{
						threadView.post_pay = {
							...post_pay,
						}
					}
					else
					{
						threadView.post_pay.exixts = true;
					}
				}

				if (_postmessage.length)
				{
					let pstatus = _postmessage
						.find('> .pstatus:eq(0)')
						.remove();
					;

					if (pstatus.length && pstatus.text().match(/(\d+-\d+-\d+(?:\s+\d+:\d+(?::\d+)?))/))
					{
						last_edit = moment(RegExp.$1, 'YYYY-MM-DD HH:mm:ss').unix();
					}

					_postmessage
						.find('ignore_js_op:has(img[id^="aimg_"][aid])')
						.each((i, elem) =>
						{

							let ignore_js_op = $(elem);

							let item = ignore_js_op
								.find('img[id^="aimg_"][aid]')
							;

							let aid = (item.prop('id') as string)
								.replace(/^aimg_/, '')
							;

							let file = item.attr('file');

							attach = attach || {} as any;
							attach.img = attach.img || [];

							attach.img.push({
								aid,
								file,
							});

							ignore_js_op.after(`(插圖aid_${aid})`);

							ignore_js_op.remove();
						})
					;

					if (attach && attach.img && attach.img.length)
					{
						thread_attach = thread_attach || {} as any;
						thread_attach.img = thread_attach.img || [];

						thread_attach.img.push(...attach.img);
					}

					postmessage = crlf(_postmessage.text())
						.replace(/^\n+|\s+$/g, '')
					;
				}

				let dateline: number;

				let _authorposton = post
					.find(`#authorposton${pid}`)
				;

				let _m = _authorposton
					.text()
					.match(/(\d+-\d+-\d+(?:\s+\d+:\d+(?::\d+)?))/)
				;

				if (_m)
				{
					dateline = moment(_m[1], 'YYYY-MM-DD HH:mm:ss').unix();
				}

				_a = _authorposton.find('[title]');

				if (!dateline && _a.length)
				{
					dateline = moment(_a.attr('title'), 'YYYY-MM-DD HH:mm:ss').unix();
				}

				if (page == 1)
				{
					threadView.author = author;
					threadView.authorid = authorid;
				}

				posts.push({
					pid,
					author,
					authorid,

					dateline,
					last_edit,

					[SymDzPost]: post,

					postmessage,

					attach,
					post_pay,
				})
			})
		;

		thread_attach.img = uniqBy(thread_attach.img, 'aid');

		threadView.thread_attach = thread_attach;

		return threadView as any;
	}

	threadPosts(thread_options2: IDzParamThreadOptions2, range: {
		from?: number;
		to?: number;
		delay?: number;
	} = {}): IBluebird<IDiscuzThreadPickRange>
	{
		let { from = 1, to = Infinity, delay } = range;

		from |= 0;

		return this.thread({
				...thread_options2,
				page: from,
			})
			.then(async function (this: DiscuzClient, thread)
			{
				from = thread.page;
				to = Math.min(to, thread.pages | 0);

				if (thread.page > 0)
				{
					if (thread.page != from)
					{
						throw new RangeError(`forum.page: ${thread.page} != from: ${from}`)
					}

					if (to < from)
					{
						throw new RangeError(`to: ${to} < from: ${from}`)
					}

					let pi = from;

					let _not_cache: boolean;

					_not_cache = delay > 0 && !isResponseFromAxiosCache(this.$response);

					let _updated: boolean;

					while (++pi <= to)
					{
						if (_not_cache)
						{
							await Bluebird.delay(delay);
						}

						let data = await this.thread({
								...thread_options2,
								page: pi,
							})
							.tap(function (this: DiscuzClient)
							{
								_not_cache = delay > 0 && !isResponseFromAxiosCache(this.$response);
							})
						;

						thread.posts.push(...data.posts);

						if (data.thread_attach.img)
						{
							thread.thread_attach.img = thread.thread_attach.img || [];

							thread.thread_attach.img.push(...data.thread_attach.img);
						}

						_updated = true;
					}

					delete thread.page;

					if (_updated)
					{
						thread.posts = uniqBy(thread.posts, 'pid');

						if (thread.thread_attach.img)
						{
							thread.thread_attach.img = uniqBy(thread.thread_attach.img, 'aid');
						}
					}
				}

				return <IDiscuzThreadPickRange>{
					...thread,
					pageFrom: from,
					pageTo: to,
				};
			})
			;
	}

	@GET('forum.php')
	@ReturnValueToJSDOM({
		runScripts: 'dangerously',
	})
	@methodBuilder()
	jsInfo()
	{
		const jsdom = this.$returnValue as ReturnType<DiscuzClient["_createJSDOM"]>;

		let { charset, cookiepre, SITEURL } = jsdom.window as IDzWindow;

		return Bluebird.resolve({
			var: {
				charset, cookiepre, SITEURL,
			},
			jsdom,
		});
	}

	_createJSDOM(html: string | Buffer, config: IJSDOMConstructorOptions): IJSDOM_WITH<{
		window: IDzWindow,
	}>
	{
		return super._createJSDOM(html, config) as any;
	}

	/*
	_responseDataToJSDOM(data: unknown, response: this["$response"], jsdomOptions?: IJSDOMConstructorOptions)
	{
		jsdomOptions = jsdomOptions || {};
		jsdomOptions.runScripts = 'dangerously';

		return super._responseDataToJSDOM(data, response, jsdomOptions);
	}
	 */

}

export default DiscuzClient
