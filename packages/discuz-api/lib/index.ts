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
import { ICookiesValue, LazyCookieJar } from 'lazy-cookies';
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
import { trimUnsafe} from './util';
import moment from 'moment';
import {
	IParametersSlice,
	IDiscuzForumMini,
	IDiscuzForum,
	IDzParamForumdisplay,
	IDiscuzTaskList,
	IDiscuzTaskRow,
	IDzParamNoticeView, IDiscuzForumPickThreads,
} from './types';
import { IUnpackedPromiseLikeReturnType, IBluebirdAxiosResponse } from '@bluelovers/axios-extend/lib';
import uniqBy from 'lodash/uniqBy';
import tryMinifyHTML from 'restful-decorator-plugin-jsdom/lib/html';
import { getConfig, setConfig } from 'restful-decorator/lib/decorators/config/util';
import merge from 'restful-decorator/lib/util/merge';
import LazyURLSearchParams from 'http-form-urlencoded';
import LazyURL from 'lazy-url';
import { _checkLoginByJQuery, _jqForumThreads } from './util/jquery';
import { ITSRequiredWith, ITSPickExtra } from 'ts-type';
import { isResponseFromAxiosCache } from '@bluelovers/axios-util/lib';

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
	}): IBluebird<boolean>
	{
		let jsdom = this._responseDataToJSDOM(this.$response.data, this.$response);

		let bool = _checkLoginByJQuery(jsdom.$);

		if (!bool)
		{
			return Bluebird.reject(bool);
		}

		return bool as any;
	}

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

				let fid = (_url.searchParams.get('fid') as any);

				subforums.push({
					fid,
					forum_name,
				})
			})
		;

		let thread_types: IDiscuzForum["thread_types"] = {};

		$('#thread_types a[href*="typeid="]')
			.each((i, elem) => {

				let _a = $(elem);

				let typeid = new LazyURL(_a.prop('href'))
					.searchParams.get('typeid')
				;

				let name = _a.text();

				thread_types[typeid] = name;

			})
		;

		let { threads, last_thread_time, last_thread_subject } = _jqForumThreads($);

		let pages: number;

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

		return ({
			fid,
			forum_name,

			last_thread_time,
			last_thread_subject,

			pages,
			page,

			subforums,

			thread_types,

			threads,
		} as IDiscuzForum) as any
	}

	forumThreads(argv: IDzParamForumdisplay, range: {
		from?: number,
		to?: number,
		delay?: number,
	} = {})
	{
		let { from = 1, to = Infinity, delay } = range;

		from |= 0;
		delay |= 0;

		return this.forum({
			...argv,
			page: from,
			})
			.then(async function (this: DiscuzClient, forum)
			{

				if (forum.page != from)
				{
					throw new RangeError(`forum.page: ${forum.page} != from: ${from}`)
				}

				to = Math.min(to, forum.pages);

				if (to < from)
				{
					throw new RangeError(`to: ${to} < from: ${from}`)
				}

				let pi = from;

				let _not_cache: boolean;

				_not_cache = delay > 0 && !isResponseFromAxiosCache(this.$response);

				while (++pi < to)
				{
					if (_not_cache)
					{
						await Bluebird.delay(delay);
					}

					let data = await this.forum({
						...argv,
						page: pi,
					})
						.tap(function (this: DiscuzClient)
						{
							_not_cache = delay > 0 && !isResponseFromAxiosCache(this.$response);
						})
					;

					forum.threads.push(...data.threads);
				}

				delete forum.page;

				forum.threads = uniqBy(forum.threads, 'tid');

				return <IDiscuzForumPickThreads>{
					pageFrom: from,
					pageTo: to,
					...forum,
				};
			})
		;
	}

	@GET('home.php?mod=space&do=notice&view=system')
	@CacheRequest({
		cache: {
			maxAge: 0,
		},
	})
	@methodBuilder()
	isLogin(): IBluebird<boolean>
	{
		const jsdom = this._responseDataToJSDOM(this.$returnValue, this.$response);
		return Bluebird.resolve(_checkLoginByJQuery(jsdom.$))
	}

	hasCookiesAuth()
	{
		return this._jar()
			.findCookieByKey(/^.+_auth$/)
			.length > 0
		;
	}

	@GET('home.php?mod=task')
	@CacheRequest({
		cache: {
			maxAge: 0,
		},
	})
	@methodBuilder()
	taskList(): IBluebird<IDiscuzTaskList>
	{
		const jsdom = this._responseDataToJSDOM(this.$returnValue, this.$response);
		const { $ } = jsdom;

		let data: IDiscuzTaskList = {
			disallow: [],
			allow: [],
		};

		$('#ct .ptm:eq(0) > table')
			.find('> tr, > tbody > tr')
			.each((i, elem) => {

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
	noticeView(@ParamPath('view') view: IDzParamNoticeView): IBluebirdAxiosResponse<unknown>
	{
		return
	}

}

export default DiscuzClient
