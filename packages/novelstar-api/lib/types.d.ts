import { ITSResolvable } from 'ts-type/lib/generic';
export type INumberValue = number | string;
export declare enum EnumWriting {
    /**
     * 連載中
     */
    writing = 1,
    /**
     * 完本
     */
    done = 99
}
export declare enum EnumTimesUnit {
    days = "days",
    month = "month"
}
export declare enum EnumOrder {
    hot = "",
    /**
     * 推薦數
     */
    ticket = "ticket",
    /**
     * 推薦數
     */
    favor = "favor",
    /**
     * 點擊數
     */
    view = "view",
    /**
     * 訂閱數
     */
    orders = "orders"
}
export interface IWordsObject {
    min?: number;
    max?: number;
}
export type IWordsArray = number[];
interface INovelStarRecentUpdateOptionsBase {
    theme?: INumberValue;
    category?: INumberValue;
    tag?: INumberValue;
    writing?: EnumWriting;
    /**
     * 排序
     */
    o?: EnumOrder;
}
export interface INovelStarRecentUpdateOptionsRaw extends INovelStarRecentUpdateOptionsBase {
    words?: string | '0-100000' | '100000-300000' | '300000-500000' | '500000-1000000' | '1000000-';
    times?: string;
}
export interface INovelStarRecentUpdateOptions extends INovelStarRecentUpdateOptionsBase {
    words?: IWordsObject | IWordsArray | INovelStarRecentUpdateOptionsRaw["words"];
    times?: number | [number, (string | EnumTimesUnit)?] | INovelStarRecentUpdateOptionsRaw["times"];
}
export interface INovelStarRecentUpdateAllOptions {
    start?: number;
    end?: number;
    filter?(curPageData: INovelStarRecentUpdate, allDataList: INovelStarBookMini[]): ITSResolvable<boolean>;
}
export interface INovelStarBookMini {
    id: string;
    title: string;
    novel_r18: boolean;
    cover: string;
    last_update_name: string;
    content: string;
}
interface INovelStarRecentUpdateBase {
    extra: INovelStarRecentUpdateOptionsRaw;
    range: {
        min?: number;
        max?: number;
    };
    list: INovelStarBookMini[];
}
export interface INovelStarRecentUpdate extends INovelStarRecentUpdateBase {
    page: number;
}
export interface INovelStarRecentUpdateAll extends INovelStarRecentUpdateBase {
    start: number;
    end: number;
}
export {};
