import { ICookiesValueRecord } from 'lazy-cookies';

export const enum EnumDmzjCode
{
	"成功" = 0,
}

export const enum EnumDmzjMsg
{
	"成功" = "成功",
}

export const enum EnumDmzjAcgnStatus
{
	"已完结" = "已完结",
	"连载中" = "连载中",
}

export const enum EnumDmzjAcgnStatusID
{
	ALL,
	NOT_DONE,
	DONE,
}

export const enum EnumDmzjAcgnOrderID
{
	/**
	 * 0为人气从高到低
	 */
	HOT,
	/**
	 * 1为更新时间从近到远
	 */
	UPDATE,
}

export const enum EnumDmzjAcgnBigCatID
{
	/**
	 * 0为漫画
	 */
	COMIC,
	/**
	 * 1为轻小说
	 */
	NOVEL,
}

export interface IDmzjJson<T>
{
	code: EnumDmzjCode | number,
	msg: EnumDmzjMsg | string,
	data?: T
}

export const enum EnumNumberBoolean
{
	FALSE,
	TRUE,
}

export interface IDmzjClientCookies extends ICookiesValueRecord<'token' | 'cookie' | 'uid' | 'PHPSESSID' | 'ci_session' | 'dmzj_session'>
{

}

export const enum EnumWebSubscribeTypeID
{
	/**
	 * 漫画
	 */
	COMIC = 1,
	/**
	 * 轻小说
	 */
	NOVEL = 4,

	/**
	 * 動畫
	 */
	ANIME = 3,
}

export const DMZJ_NOVEL_TAGS = [
	"侦探",
	"其它",
	"冒险",
	"励志",
	"历史",
	"后宫",
	"奇幻",
	"异界",
	"异能",
	"恐怖",
	"战争",
	"搞笑",
	"机战",
	"校园",
	"格斗",
	"治愈",
	"爱情",
	"百合",
	"神鬼",
	"科幻",
	"穿越",
	"都市",
	"魔法"
] as const;

export type IDmzjNovelTags = Pick<typeof DMZJ_NOVEL_TAGS, number>[number];

export interface IDmzjNovelRecentUpdateRow
{
	"id": number;
	"status": EnumDmzjAcgnStatus;
	"name": string;
	"authors": string;
	"cover": string;
	"types": (string | IDmzjNovelTags)[];
	"last_update_chapter_id": number;
	"last_update_volume_id": number;
	"last_update_volume_name": string;
	"last_update_chapter_name": string;
	"last_update_time": number;
}

export interface IDmzjClientNovelRecentUpdateAll
{
	from: number;
	to: number;
	end: number;
	last_update_time: number;
	list: IDmzjNovelRecentUpdateRow[];
}

export interface IDmzjLoginConfirm
{
	result: number | 0 | 1;
	msg: string | 'OK';
	data?: {
		uid: string;
		nickname: string;
		dmzj_token: string;
		photo: string;
		bind_phone: string;
		email: string;
		passwd: string;
	};
}

/**
 * [
 { tag_id: 1, tag_name: '动画情报' },
 { tag_id: 2, tag_name: '漫画情报' },
 { tag_id: 3, tag_name: '轻小说情报' },
 { tag_id: 8, tag_name: '美图欣赏' },
 { tag_id: 7, tag_name: '游戏资讯' },
 { tag_id: 4, tag_name: '动漫周边' },
 { tag_id: 5, tag_name: '声优情报' },
 { tag_id: 9, tag_name: '漫展情报' },
 { tag_id: 6, tag_name: '音乐资讯' },
 { tag_id: 10, tag_name: '大杂烩' }
 ]
 */
export interface IDmzjArticleCategory
{
	"tag_id": number;
	"tag_name": string;
}

export interface IDmzjNovelInfo extends IDmzjNovelRecentUpdateRow
{
	"zone": string | "日本";
	"hot_hits": number;
	"introduction": string;
	"subscribe_num": number;
	"volume": {
		"id": number;
		"lnovel_id": number;
		"volume_name": string;
		"volume_order": number;
		"addtime": number;
		"sum_chapters": number;
	}[];
}

export interface IDmzjNovelChapters
{
	"volume_id": number;
	"id": number;
	"volume_name": string;
	"volume_order": number;
	"chapters": {
		"chapter_id": number;
		"chapter_name": string;
		"chapter_order": number;
	}[];
}

export interface IDmzjNovelDataInfo extends IDmzjNovelInfo
{
	chapters: IDmzjNovelChapters[],
}
