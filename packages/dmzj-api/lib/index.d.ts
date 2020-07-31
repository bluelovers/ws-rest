import { AbstractHttpClient } from 'restful-decorator/lib';
import { AxiosRequestConfig } from 'restful-decorator/lib/types/axios';
import { ICookiesValue } from 'lazy-cookies';
import { IBluebird } from 'restful-decorator/lib/index';
import Bluebird from 'bluebird';
import { EnumDmzjAcgnBigCatID, EnumDmzjAcgnOrderID, EnumDmzjAcgnStatus, EnumDmzjAcgnStatusID, EnumNumberBoolean, EnumWebSubscribeTypeID, IDmzjArticleCategory, IDmzjClientCookies, IDmzjClientNovelRecentUpdateAll, IDmzjJson, IDmzjLoginConfirm, IDmzjNovelChapters, IDmzjNovelInfoWithChapters, IDmzjNovelInfo, IDmzjNovelInfoMini, IDmzjNovelInfoRecentUpdateRow } from './types';
/**
 * https://gist.github.com/bluelovers/5e9bfeecdbff431c62d5b50e7bdc3e48
 * https://github.com/guuguo/flutter_dmzj/blob/master/lib/api.dart
 * https://github.com/tkkcc/flutter_dmzj/blob/269cb0d642c710626fe7d755f0b27b12ab477cc6/lib/util/api.dart
 */
export declare class DmzjClient extends AbstractHttpClient {
    constructor(defaults?: AxiosRequestConfig);
    protected _init(defaults?: AxiosRequestConfig): any;
    /**
     * 使用帳號密碼來登入
     */
    loginConfirm(nickname: string, passwd: string): IBluebird<IDmzjLoginConfirm>;
    /**
     * 以 cookies 來登入
     */
    loginByCookies(cookies_data: IDmzjClientCookies | ICookiesValue[]): Bluebird<this>;
    /**
     * @fixme
     */
    webSubscribe(data?: {
        page?: number;
        type_id?: EnumWebSubscribeTypeID | number;
        letter_id?: number;
        read_id?: number;
    }): IBluebird<string>;
    /**
     * 推荐列表
     */
    articleRecommendHeader(): IBluebird<IDmzjJson<{
        "id": number;
        "title": string;
        "pic_url": string;
        "object_id": number;
        "object_url": string;
    }[]>>;
    /**
     * 文章分类
     */
    articleCategory(): IBluebird<IDmzjArticleCategory[]>;
    /**
     * 文章列表
     */
    articleList(_tag_id: number, _page?: number): IBluebird<IDmzjJson<{
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
    }[]>>;
    /**
     * 文章列表
     */
    articleShow(object_id: number): IBluebird<IDmzjJson<string>>;
    /**
     * 推荐
     */
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
    }[]>;
    /**
     * 最近更新
     */
    _novelRecentUpdate(page?: number, delay?: number): IBluebird<IDmzjNovelInfoRecentUpdateRow[]>;
    /**
     * 最近更新(非原始資料 而是 經過修正處理)
     */
    novelRecentUpdate(page?: number, delay?: number): Bluebird<IDmzjNovelInfoRecentUpdateRow[]>;
    /**
     * 一次性取得全部小說列表(如果遇到網路錯誤 或者 其他意外狀況則會停止)
     */
    _novelRecentUpdateAll(from?: number, to?: number, { throwError, delay, }?: {
        throwError?: boolean;
        delay?: number;
    }): IBluebird<IDmzjClientNovelRecentUpdateAll>;
    /**
     * 一次性取得全部小說列表(如果遇到網路錯誤 或者 其他意外狀況則會停止)
     * (非原始資料 而是 經過修正處理)
     */
    novelRecentUpdateAll(from?: number, to?: number, options?: {
        throwError?: boolean;
        delay?: number;
    }): IBluebird<IDmzjClientNovelRecentUpdateAll>;
    /**
     * 小说详情
     */
    _novelInfo(novel_id: number | string): IBluebird<IDmzjNovelInfo>;
    /**
     * 小说详情(非原始資料 而是 經過修正處理)
     */
    novelInfo(novel_id: number | string): IBluebird<IDmzjNovelInfo>;
    /**
     * 小说卷列表
     */
    novelChapter(novel_id: number | string): IBluebird<IDmzjNovelChapters[]>;
    /**
     * 取得小說資料的同時一起取得章節列表
     */
    _novelInfoWithChapters(novel_id: number | string): Bluebird<IDmzjNovelInfoWithChapters>;
    /**
     * 取得小說資料的同時一起取得章節列表(非原始資料 而是 經過修正處理)
     */
    novelInfoWithChapters(novel_id: number | string): Bluebird<IDmzjNovelInfoWithChapters>;
    /**
     * 小说章节正文
     * @example novelDownload(2661, 10099, 95922)
     */
    novelDownload(id: number, volume_id: number, chapter_id: number): IBluebird<string>;
    /**
     * 小说分类
     */
    novelCategory(): IBluebird<{
        "tag_id": number;
        "title": string;
        "cover": string;
    }[]>;
    /**
     * 小说筛选条件
     */
    novelFilter(): IBluebird<{
        "title": string;
        "items": {
            "tag_id": number;
            "tag_name": string;
        }[];
    }[]>;
    /**
     * 小说列表
     *
     * @param {number} cat_id 分类id
     * @param {EnumDmzjAcgnStatusID} status_id 连载情况
     * @param {EnumDmzjAcgnOrderID} order_id 排序 0为人气从高到低，1为更新时间从近到远
     * @param {number} page 页数
     */
    novelList(cat_id: number, status_id: EnumDmzjAcgnStatusID, order_id: EnumDmzjAcgnOrderID, page?: number): IBluebird<IDmzjNovelInfoMini[]>;
    /**
     * 搜索
     *
     * @param {EnumDmzjAcgnBigCatID} big_cat_id 分类id; 0为漫画, 1为轻小说
     * @param {string} keywords 关键字
     * @param {number} page 页数
     */
    searchShow(big_cat_id: EnumDmzjAcgnBigCatID.NOVEL, keywords: string, page?: number): IBluebird<IDmzjNovelInfoMini[]>;
    /**
     * 搜索
     *
     * @param {EnumDmzjAcgnBigCatID} big_cat_id 分类id; 0为漫画, 1为轻小说
     * @param {string} keywords 关键字
     * @param {number} page 页数
     */
    searchShow(big_cat_id: EnumDmzjAcgnBigCatID.COMIC, keywords: string, page?: number): IBluebird<{
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
    }[]>;
    /**
     * 搜索
     *
     * @param {EnumDmzjAcgnBigCatID} big_cat_id 分类id; 0为漫画, 1为轻小说
     * @param {string} keywords 关键字
     * @param {number} page 页数
     */
    searchShow(big_cat_id: EnumDmzjAcgnBigCatID, keywords: string, page?: number): IBluebird<IDmzjNovelInfoMini[] | {
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
    }[]>;
    /**
     * 漫画 推荐
     */
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
    })[]>;
    /**
     * 漫画
     * @example comicDetail(47195)
     */
    comicDetail(comic_id: number): IBluebird<{
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
    }>;
    /**
     * 漫画
     * @example comicContent(47195, 85760)
     */
    comicContent(comic_id: number, chapter_id: number): IBluebird<{
        "chapter_id": number;
        "comic_id": number;
        "title": string;
        "chapter_order": number;
        "direction": number;
        "page_url": string[];
        "picnum": number;
        "comment_count": number;
    }>;
    deviceBuilding(data: {
        uid: number | string;
        user_id?: number | string;
        channel_id?: number | string;
    }): IBluebird<IDmzjJson<never>>;
}
export default DmzjClient;
