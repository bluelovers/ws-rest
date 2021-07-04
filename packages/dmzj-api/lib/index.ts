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
} from 'restful-decorator/lib/decorators';
import { ICookiesValue } from 'lazy-cookies';
import { getCookieJar } from 'restful-decorator/lib/decorators/config/cookies';
import { IBluebird } from 'restful-decorator/lib/index';
import Bluebird from 'bluebird';
import { buildVersion, fixDmzjNovelInfo, sortDmzjNovelInfoChapters } from './util';
import {
	EnumDmzjAcgnBigCatID,
	EnumDmzjAcgnOrderID,
	EnumDmzjAcgnStatus,
	EnumDmzjAcgnStatusID,
	EnumNumberBoolean,
	EnumWebSubscribeTypeID,
	IDmzjArticleCategory,
	IDmzjClientCookies,
	IDmzjClientNovelRecentUpdateAll,
	IDmzjJson,
	IDmzjLoginConfirm,
	IDmzjNovelChapters,
	IDmzjNovelInfo,
	IDmzjNovelInfoMini,
	IDmzjNovelInfoRecentUpdateRow,
	IDmzjNovelInfoWithChapters,
} from './types';
import { array_unique } from 'array-hyper-unique';
import consoleDebug from 'restful-decorator/lib/util/debug';
import { SymSelf } from 'restful-decorator/lib/helper/symbol';
import subobject from 'restful-decorator/lib/helper/subobject';
import { decryptBase64V4 } from './v4/crypto';
import { lookupTypeNovelChapterResponse, lookupTypeNovelDetailResponse } from './v4/protobuf';

/**
 * https://gist.github.com/bluelovers/5e9bfeecdbff431c62d5b50e7bdc3e48
 * https://github.com/guuguo/flutter_dmzj/blob/master/lib/api.dart
 * https://github.com/tkkcc/flutter_dmzj/blob/269cb0d642c710626fe7d755f0b27b12ab477cc6/lib/util/api.dart
 */
//@BaseUrl('http://v2.api.dmzj.com')
//@BaseUrl('http://nnv3api.dmzj1.com')
@BaseUrl('https://nnv3api.muwai.com')
@Headers({
	Referer: 'http://www.dmzj.com/',
})
@TransformResponse((data) =>
{
	if (typeof data === 'string')
	{
		try
		{
			return JSON.parse(data)
		}
		catch (e)
		{
			try
			{
				return JSON.parse(data.replace(/(?<=\})test$/, ''))
			}
			catch (e)
			{
			}
		}
	}

	return data;
})
@RequestConfigs({
	responseType: 'json',
//	data: {
//		...buildVersion(),
//	},
})
@CacheRequest({
	cache: {
		maxAge: 6 * 60 * 60 * 1000,
	},
})
export class DmzjClient extends AbstractHttpClient
{
	constructor(defaults?: AxiosRequestConfig)
	{
		super(defaults);

		//consoleDebug.debug(`constructor`);
		//consoleDebug.dir(this.$http.defaults);

		//console.dir(this.$http.defaults.jar);

		//process.exit();
	}

	protected _init(defaults?: AxiosRequestConfig): any
	{
		defaults = super._init(defaults);

		//consoleDebug.debug(`_init`);
		//consoleDebug.dir(defaults);

		return defaults;
	}

	/**
	 * 使用帳號密碼來登入
	 */
	@POST('https://user.dmzj.com/loginV2/m_confirm')
	@methodBuilder()
	@FormUrlencoded
	loginConfirm(@ParamData('nickname') nickname: string,
		@ParamData('passwd') passwd: string,
	): IBluebird<IDmzjLoginConfirm>
	{
		let response = this.$returnValue as any as IDmzjLoginConfirm;

		if (!response.result || !response.data)
		{
			throw new Error(`${response.data}`)
		}

		this.$sharedPreferences.set('user_info', response.data);

		return
	}

	/**
	 * 以 cookies 來登入
	 */
	loginByCookies(cookies_data: IDmzjClientCookies | ICookiesValue[])
	{
		const jar = getCookieJar(this);
		jar.setData(cookies_data || {});

		//consoleDebug.dir(jar);

		return Bluebird.resolve(this)
	}

	/**
	 * @fixme
	 */
	@POST('https://i.dmzj.com/subscribe')
	@Headers({
		Referer: 'https://i.dmzj.com/subscribe',
	})
	@methodBuilder()
	webSubscribe(@ParamMapData({
		page: 1,
		type_id: EnumWebSubscribeTypeID.NOVEL,
		letter_id: 0,
		read_id: 1,
	}) data?: {
		page?: number
		type_id?: EnumWebSubscribeTypeID | number,
		letter_id?: number
		read_id?: number,
	}): IBluebird<string>
	{
		//consoleDebug.dir(this.$requestConfig);
		//consoleDebug.dir(this.$http.defaults.jar);

		//console.dir(this.$responseUrl);

		//console.dir(this.$requestConfig);
		//console.dir(this.$http.defaults);

		// @ts-ignore
		//return this.$http(this.$requestConfig);

		// @ts-ignore
//		console.dir(this.$responseUrl);

		//const jar = getCookieJar(this);
		//consoleDebug.dir(jar);
		//console.dir(this.$returnValue.headers);

		return
	}

	/**
	 * 推荐列表
	 */
	@GET('article/recommend/header.json')
	@methodBuilder()
	articleRecommendHeader(): IBluebird<IDmzjJson<{
		"id": number,
		"title": string,
		"pic_url": string,
		"object_id": number,
		"object_url": string,
	}[]>>
	{
		//let data = arguments[0];
		return null;
	}

	/**
	 * 文章分类
	 */
	@GET('article/category.json')
	@methodBuilder()
	articleCategory(): IBluebird<IDmzjArticleCategory[]>
	{
		//let data = arguments[0];
		return null;
	}

	/**
	 * 文章列表
	 */
	@GET('article/list/v2/{tag_id}/2/{page}.json')
	@methodBuilder()
	articleList(@ParamPath('tag_id') _tag_id: number, @ParamPath('page', 0) _page?: number): IBluebird<IDmzjJson<{
		title: string;
		from_name: string;
		from_url: string;
		create_time: number;
		is_foreign: number;
		foreign_url: string;
		intro: string;
		author_id: number;
		status: number;
		row_pic_url: string;
		col_pic_url: string;
		article_id: number;
		page_url: string;
		comment_amount: string;
		author_uid: number;
		cover: string;
		nickname: string;
		mood_amount: number;
	}[]>>
	{
		//let data = arguments[0];
		return null;
	}

	/**
	 * 文章列表
	 */
	@GET('article/show/v2/{object_id}.html')
	@methodBuilder()
	articleShow(@ParamPath('object_id') object_id: number): IBluebird<IDmzjJson<string>>
	{
		//let data = arguments[0];
		return null;
	}

	/**
	 * 推荐
	 */
	@GET('novel/recommend.json')
	@methodBuilder()
	novelRecommend(): IBluebird<{
		category_id: number;
		sort: number;
		title: string | "轮番图" | "最新更新" | "动画进行时" | "即将动画化" | "经典必看";
		data: {
			id: number;
			obj_id: number;
			title: string;
			cover: string;
			url: string;
			type: number;
			sub_title: string;
			status: EnumDmzjAcgnStatus;
		}[];
	}[]>
	{
		return;
	}

	/**
	 * 最近更新
	 */
	@GET('novel/recentUpdate/{page}.json')
	@methodBuilder()
	_novelRecentUpdate(@ParamPath('page', 0) page?: number, delay?: number): IBluebird<IDmzjNovelInfoRecentUpdateRow[]>
	{
		if (delay && !this.$response.request.fromCache)
		{
			// @ts-ignore
			return Bluebird.delay(delay | 0)
				.thenReturn(this.$returnValue)
		}

		//let data = arguments[0];
		return null;
	}

	/**
	 * 最近更新(非原始資料 而是 經過修正處理)
	 */
	novelRecentUpdate(page?: number, delay?: number)
	{
		return this._novelRecentUpdate(page, delay)
			.then(data =>
			{
				return data.map(fixDmzjNovelInfo);
			})
			;
	}

	/**
	 * 一次性取得全部小說列表(如果遇到網路錯誤 或者 其他意外狀況則會停止)
	 */
	_novelRecentUpdateAll(from: number = 0, to: number = Infinity, {
		throwError,
		delay,
	}: {
		throwError?: boolean
		delay?: number,
	} = {}): IBluebird<IDmzjClientNovelRecentUpdateAll>
	{
		let i = from;

		delay |= 0;

		return Bluebird
			.resolve()
			.then(async () =>
			{
				let list: IDmzjNovelInfoRecentUpdateRow[] = [];
				let last: (IDmzjNovelInfoRecentUpdateRow["id"])[] = [];

				while (i < to)
				{
					let cur: IDmzjNovelInfoRecentUpdateRow[] = await this.novelRecentUpdate(i, delay)
						.catch(e =>
						{

							if (throwError)
							{
								return Promise.reject(e)
							}

							consoleDebug.error(i, e.message);

							return null;
						})
					;

					let cur_ids: (IDmzjNovelInfoRecentUpdateRow["id"])[];

					if (cur == null || !Array.isArray(cur))
					{
						if (i > 0)
						{
							i -= 1;
						}

						cur && consoleDebug.error(i, cur);

						break;
					}
					else if (!cur.length)
					{
						consoleDebug.debug(i, `沒有內容 此頁次可能已超過範圍`);

						if (i > 0)
						{
							i -= 1;
						}

						break;
					}
					else
					{
						cur_ids = cur.map((v: IDmzjNovelInfoRecentUpdateRow) => v.id);

						if (!cur_ids.some(id => id && !last.includes(id)))
						{
							consoleDebug.debug(i, `沒有新內容 本次查詢資料可能與上次相同`, {
								cur_ids,
								last_ids: last,
							});

							break;
						}
					}

					consoleDebug.debug(i, cur.length, cur_ids);

					list.push(...cur);

					last = cur_ids;
					i++;
				}

				return array_unique(list);
			})
			.then(list =>
			{

				let last_update_time = list.reduce((a, b) =>
				{
					return Math.max(a, b.last_update_time | 0)
				}, 0);

				return <IDmzjClientNovelRecentUpdateAll>{
					from,
					to,
					end: i,
					last_update_time,
					list,
				}
			})
			;
	}

	/**
	 * 一次性取得全部小說列表(如果遇到網路錯誤 或者 其他意外狀況則會停止)
	 * (非原始資料 而是 經過修正處理)
	 */
	novelRecentUpdateAll(from: number = 0, to: number = Infinity, options: {
		throwError?: boolean
		delay?: number,
	} = {}): IBluebird<IDmzjClientNovelRecentUpdateAll>
	{
		return this._novelRecentUpdateAll(from, to, options)
			.then(data =>
			{

				data.list = data.list.map(fixDmzjNovelInfo);

				return data
			})
	}

	/**
	 * 小说详情
	 */
	//@GET('novel/{novel_id}.json')
	@GET('http://nnv4api.muwai.com/novel/detail/{novel_id}')
	@methodBuilder()
	_novelInfo(@ParamPath('novel_id') novel_id: number | string): IBluebird<IDmzjNovelInfo>
	{
		const decrypted = decryptBase64V4(this.$response.data as any);
		const result = lookupTypeNovelDetailResponse().decode(decrypted)
		// console.log(result.toJSON())

		const apiresult: IDmzjNovelInfo = {
			id: result.Data.NovelId,
			name: result.Data.Name,
			zone: result.Data.Zone,
			status: result.Data.Status as EnumDmzjAcgnStatus,

			last_update_volume_name: result.Data.LastUpdateVolumeName,
			last_update_chapter_name: result.Data.LastUpdateChapterName,
			last_update_volume_id: result.Data.LastUpdateVolumeId,
			last_update_chapter_id: result.Data.LastUpdateChapterId,
			last_update_time: +result.Data.LastUpdateTime,

			cover: result.Data.Cover,
			hot_hits: result.Data.HotHits,
			introduction: result.Data.Introduction,
			types: result.Data.Types,
			authors: result.Data.Authors,

			first_letter: result.Data.FirstLetter,
			subscribe_num: result.Data.SubscribeNum,

			volume: result.Data.Volume.map((v: any) =>
				{
					return {
						id: v.VolumeId,
						lnovel_id: v.LnovelId,
						volume_name: v.VolumeName,
						volume_order: v.VolumeOrder,
						addtime: +v.Addtime,
						sum_chapters: v.SumChapters,
					}
				},
			),
		};
		return apiresult as any;
	}

	/**
	 * 小说详情(非原始資料 而是 經過修正處理)
	 */
	novelInfo(novel_id: number | string): IBluebird<IDmzjNovelInfo>
	{
		return this._novelInfo(novel_id).then(fixDmzjNovelInfo);
	}

	/**
	 * 小说卷列表
	 */
	@GET('http://nnv4api.muwai.com/novel/chapter/{novel_id}')
	@methodBuilder()
	novelChapter(@ParamPath('novel_id') novel_id: number | string): IBluebird<IDmzjNovelChapters[]>
	{
		const decrypted = decryptBase64V4(this.$response.data as any);
		const result = lookupTypeNovelChapterResponse().decode(decrypted);

		const apiresult: IDmzjNovelChapters[] = result.Data.map((v): IDmzjNovelChapters =>
		{
			return {
				volume_id: v.VolumeId,
				id: v.VolumeId,
				volume_name: v.VolumeName,
				volume_order: v.VolumeOrder,
				chapters: v.Chapters.map((c) =>
				{
					return {
						chapter_id: c.ChapterId,
						chapter_name: c.ChapterName,
						chapter_order: c.ChapterOrder,
					}
				}),
			}
		})
		return sortDmzjNovelInfoChapters(apiresult) as any;
	}

	/**
	 * 取得小說資料的同時一起取得章節列表
	 */
	_novelInfoWithChapters(novel_id: number | string): Bluebird<IDmzjNovelInfoWithChapters>
	{
		let selfTop = subobject({}, this) as DmzjClient;
		let self = selfTop;
		return Bluebird.props({
				info: this.novelInfo(novel_id),
				chapters: this.novelChapter(novel_id)
					.tap(function ()
					{
						// @ts-ignore
						self = this;
					}),
			})
			.then(result =>
			{

				const { info, chapters } = result;

				selfTop.$response = self.$response;

				return <IDmzjNovelInfoWithChapters>{
					...info,
					chapters,
					[SymSelf]: self,
				}
			})
			.bind(self)
			;
	}

	/**
	 * 取得小說資料的同時一起取得章節列表(非原始資料 而是 經過修正處理)
	 */
	novelInfoWithChapters(novel_id: number | string)
	{
		return this._novelInfoWithChapters(novel_id).then(fixDmzjNovelInfo);
	}

	/**
	 * 小说章节正文
	 * @example novelDownload(2661, 10099, 95922)
	 */
	@GET('novel/download/{id}_{volume_id}_{chapter_id}.txt')
	@methodBuilder()
	novelDownload(@ParamPath('id') id: number,
		@ParamPath('volume_id') volume_id: number,
		@ParamPath('chapter_id') chapter_id: number,
	): IBluebird<string>
	{
		//let data = arguments[0];
		return null;
	}

	/**
	 * 小说分类
	 */
	@GET('1/category.json')
	@methodBuilder()
	novelCategory(): IBluebird<{
		"tag_id": number;
		"title": string;
		"cover": string;
	}[]>
	{
		//let data = arguments[0];
		return null;
	}

	/**
	 * 小说筛选条件
	 */
	@GET('novel/filter.json')
	@methodBuilder()
	novelFilter(): IBluebird<{
		"title": string;
		"items": {
			"tag_id": number;
			"tag_name": string;
		}[];
	}[]>
	{
		//let data = arguments[0];
		return null;
	}

	/**
	 * 小说列表
	 *
	 * @param {number} cat_id 分类id
	 * @param {EnumDmzjAcgnStatusID} status_id 连载情况
	 * @param {EnumDmzjAcgnOrderID} order_id 排序 0为人气从高到低，1为更新时间从近到远
	 * @param {number} page 页数
	 */
	@GET('novel/{cat_id}/{status_id}/{order_id}/{page}.json')
	@methodBuilder()
	novelList(@ParamPath('cat_id') cat_id: number,
		@ParamPath('status_id') status_id: EnumDmzjAcgnStatusID,
		@ParamPath('order_id') order_id: EnumDmzjAcgnOrderID,
		@ParamPath('page', 0) page?: number,
	): IBluebird<IDmzjNovelInfoMini[]>
	{
		//let data = arguments[0];
		return null;
	}

	/**
	 * 搜索
	 *
	 * @param {EnumDmzjAcgnBigCatID} big_cat_id 分类id; 0为漫画, 1为轻小说
	 * @param {string} keywords 关键字
	 * @param {number} page 页数
	 */
	searchShow(big_cat_id: EnumDmzjAcgnBigCatID.NOVEL,
		keywords: string,
		page?: number,
	): IBluebird<IDmzjNovelInfoMini[]>
	/**
	 * 搜索
	 *
	 * @param {EnumDmzjAcgnBigCatID} big_cat_id 分类id; 0为漫画, 1为轻小说
	 * @param {string} keywords 关键字
	 * @param {number} page 页数
	 */
	searchShow(big_cat_id: EnumDmzjAcgnBigCatID.COMIC,
		keywords: string,
		page?: number,
	): IBluebird<{
		/**
		 * 漫画
		 */
		"id": number;
		"status": string | EnumDmzjAcgnStatus;
		"title": string;
		"last_name": string;
		"cover": string;
		"authors": string;
		"types": string;
		"hot_hits": number;
	}[]>
	/**
	 * 搜索
	 *
	 * @param {EnumDmzjAcgnBigCatID} big_cat_id 分类id; 0为漫画, 1为轻小说
	 * @param {string} keywords 关键字
	 * @param {number} page 页数
	 */
	searchShow(big_cat_id: EnumDmzjAcgnBigCatID,
		keywords: string,
		page?: number,
	): IBluebird<IDmzjNovelInfoMini[] | {
		/**
		 * 漫画
		 */
		"id": number;
		"status": string | EnumDmzjAcgnStatus;
		"title": string;
		"last_name": string;
		"cover": string;
		"authors": string;
		"types": string;
		"hot_hits": number;
	}[]>
	@GET('search/show/{big_cat_id}/{keywords}/{page}.json')
	@methodBuilder()
	searchShow(@ParamPath('big_cat_id') big_cat_id: EnumDmzjAcgnBigCatID,
		@ParamPath('keywords') keywords: string,
		@ParamPath('page', 0) page?: number,
	): IBluebird<IDmzjNovelInfoMini[] | {
		/**
		 * 漫画
		 */
		"id": number;
		"status": string | EnumDmzjAcgnStatus;
		"title": string;
		"last_name": string;
		"cover": string;
		"authors": string;
		"types": string;
		"hot_hits": number;
	}[]>
	{
		return;
	}

	/**
	 * 漫画 推荐
	 */
	@GET('v3/recommend.json')
	@methodBuilder()
	comicRecommend(): IBluebird<({
		"category_id": number;
		"title": string | "大图推荐" | "近期必看" | "火热专题" | "大师级作者怎能不看" | "国漫也精彩" | "美漫大事件" | "热门连载" | "条漫专区";
		"sort": number;
		"data": {
			"cover": string;
			"title": string;
			"sub_title": string;
			"type": number;
			"url": string;
			/**
			 * comic_id
			 */
			"obj_id": number;
			"status": string | '' | EnumDmzjAcgnStatus;
		}[];
	} | {
		"category_id": number;
		"title": string | "最新上架";
		"sort": number;
		"data": {
			/**
			 * comic_id
			 */
			"id": number;
			"title": string;
			"authors": string;
			"status": string | '' | EnumDmzjAcgnStatus;
			"cover": string;
		}[];
	})[]>
	{
		//let data = arguments[0];
		return null;
	}

	/**
	 * 漫画
	 * @example comicDetail(47195)
	 */
	@GET('comic/{comic_id}.json')
	@methodBuilder()
	comicDetail(@ParamPath('comic_id') comic_id: number): IBluebird<{
		"id": number;
		"islong": number;
		"direction": number;
		"title": string;
		"is_dmzj": number | EnumNumberBoolean;
		"cover": string;
		"description": string;
		"last_updatetime": number;
		"copyright": number | EnumNumberBoolean;
		"first_letter": string;
		"hot_num": number;
		"hit_num": number;
		"uid": number | null;
		"is_lock": number | EnumNumberBoolean;
		"status": {
			"tag_id": number | EnumDmzjAcgnStatusID;
			"tag_name": string | EnumDmzjAcgnStatus;
		}[];
		"types": {
			"tag_id": number;
			"tag_name": string;
		}[];
		"authors": {
			"tag_id": number;
			"tag_name": string;
		}[];
		"subscribe_num": number;
		"chapters": {
			"title": string;
			"data": {
				"chapter_id": number;
				"chapter_title": string;
				"updatetime": number;
				"filesize": number;
				"chapter_order": number;
			}[];
		}[];
		"comment": {
			"comment_count": number;
			"latest_comment": {
				"comment_id": number;
				"uid": number;
				"content": string;
				"createtime": number;
				"nickname": string;
				"avatar": string;
			}[];
		};
	}>
	{
		//let data = arguments[0];
		return null;
	}

	/**
	 * 漫画
	 * @example comicContent(47195, 85760)
	 */
	@GET('chapter/{comic_id}/{chapter_id}.json')
	@methodBuilder()
	comicContent(@ParamPath('comic_id') comic_id: number, @ParamPath('chapter_id') chapter_id: number): IBluebird<{
		"chapter_id": number;
		"comic_id": number;
		"title": string;
		"chapter_order": number;
		"direction": number;
		"page_url": string[];
		"picnum": number;
		"comment_count": number;
	}>
	{
		//let data = arguments[0];
		return null;
	}

	@POST('device/building')
	@methodBuilder()
	@BodyData({
		device: buildVersion().channel,
	})
	deviceBuilding(@ParamMapData({
		user_id: 1,
		channel_id: 2,
	}) data: {
		uid: number | string,
		user_id?: number | string,
		channel_id?: number | string,
	}): IBluebird<IDmzjJson<never>>
	{
		return
	}

}

export default DmzjClient
