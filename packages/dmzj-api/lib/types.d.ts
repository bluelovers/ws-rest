import { ICookiesValueRecord } from 'lazy-cookies';
import { SymSelf } from 'restful-decorator/lib/helper/symbol';
import DmzjClient from './index';
export declare const enum EnumDmzjCode {
    "成功" = 0
}
export declare const enum EnumDmzjMsg {
    "成功" = "\u6210\u529F"
}
export declare const enum EnumDmzjAcgnStatus {
    "已完结" = "\u5DF2\u5B8C\u7ED3",
    "连载中" = "\u8FDE\u8F7D\u4E2D"
}
export declare const enum EnumDmzjAcgnStatusID {
    ALL = 0,
    NOT_DONE = 1,
    DONE = 2
}
export declare const enum EnumDmzjAcgnOrderID {
    /**
     * 0为人气从高到低
     */
    HOT = 0,
    /**
     * 1为更新时间从近到远
     */
    UPDATE = 1
}
export declare const enum EnumDmzjAcgnBigCatID {
    /**
     * 0为漫画
     */
    COMIC = 0,
    /**
     * 1为轻小说
     */
    NOVEL = 1
}
export interface IDmzjJson<T> {
    code: EnumDmzjCode | number;
    msg: EnumDmzjMsg | string;
    data?: T;
}
export declare const enum EnumNumberBoolean {
    FALSE = 0,
    TRUE = 1
}
export interface IDmzjClientCookies extends ICookiesValueRecord<'token' | 'cookie' | 'uid' | 'PHPSESSID' | 'ci_session' | 'dmzj_session'> {
}
export declare const enum EnumWebSubscribeTypeID {
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
    ANIME = 3
}
export declare const DMZJ_NOVEL_TAGS: readonly ["侦探", "其它", "冒险", "励志", "历史", "后宫", "奇幻", "异界", "异能", "恐怖", "战争", "搞笑", "机战", "校园", "格斗", "治愈", "爱情", "百合", "神鬼", "科幻", "穿越", "都市", "魔法"];
export declare type IDmzjNovelTags = Pick<typeof DMZJ_NOVEL_TAGS, number>[number];
export interface IDmzjClientNovelRecentUpdateAll {
    from: number;
    to: number;
    end: number;
    last_update_time: number;
    list: IDmzjNovelInfoRecentUpdateRow[];
}
export interface IDmzjLoginConfirm {
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
export interface IDmzjArticleCategory {
    "tag_id": number;
    "tag_name": string;
}
export interface IDmzjNovelInfoMini {
    "cover": string;
    "name": string;
    "authors": string;
    "id": number;
}
/**
 * 最近更新
 */
export interface IDmzjNovelInfoRecentUpdateRow extends IDmzjNovelInfoMini {
    "status": EnumDmzjAcgnStatus;
    "types": (string | IDmzjNovelTags)[];
    "last_update_chapter_id": number;
    "last_update_volume_id": number;
    "last_update_volume_name": string;
    "last_update_chapter_name": string;
    "last_update_time": number;
}
/**
 * 小说详情
 */
export interface IDmzjNovelInfo extends IDmzjNovelInfoRecentUpdateRow {
    "zone": string | "日本";
    "hot_hits": number;
    "introduction": string;
    "first_letter"?: string;
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
/**
 * 小说卷列表
 */
export interface IDmzjNovelChapters {
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
/**
 * 取得小說資料的同時一起取得章節列表
 */
export interface IDmzjNovelInfoWithChapters extends IDmzjNovelInfo {
    chapters: IDmzjNovelChapters[];
    /**
     * 隱藏資料 用來處理特殊需求
     */
    [SymSelf]: DmzjClient;
}
