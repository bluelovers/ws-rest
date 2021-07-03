/// <reference types="jquery" />
/// <reference types="node" />
import AbstractHttpClientWithJSDom from 'restful-decorator-plugin-jsdom/lib';
import { IBluebird } from 'restful-decorator/lib/index';
import Bluebird from 'bluebird';
import { IWenku8RecentUpdate, IArticleToplistSortType, IWenku8RecentUpdateWithSortType, IWenku8RecentUpdateRowBook, IWenku8BookChapters, IWenku8RecentUpdateRowBookWithChapters, IArticleSearchType, IWenku8SearchList, IParametersSlice } from './types';
import { Buffer } from 'buffer';
/**
 * https://www.wenku8.net/index.php
 */
export declare class Wenku8Client extends AbstractHttpClientWithJSDom {
    protected _constructor(): void;
    loginByForm(inputData: {
        username: string;
        password: string;
        usecookie?: number;
        jumpurl?: string;
    }): IBluebird<boolean>;
    protected _handleArticleList<T extends Partial<IWenku8RecentUpdate>, R = T & Pick<IWenku8RecentUpdate, 'end' | 'last_update_time' | 'data'>>(_this: this, retDataInit: T): R;
    /**
     * 轻小说最近更新
     */
    articleToplist(page?: number, sortType?: IArticleToplistSortType | 'lastupdate'): IBluebird<IWenku8RecentUpdateWithSortType>;
    articleToplistAll(from: number, to?: number, options?: {
        throwError?: boolean;
        delay?: number;
    }, ...args: IParametersSlice<this["articleToplist"]>): Bluebird<IWenku8RecentUpdateWithSortType & {
        from: number;
        to: number;
    }>;
    protected _handleArticleTopListAll<T extends (page: number, args: any) => any>(method: T, args: IParametersSlice<T>, from?: number, pageTo?: number, { throwError, delay, }?: {
        throwError?: boolean;
        delay?: number;
    }): Bluebird<import("ts-type").ITSUnpackedPromiseLike<ReturnType<T>> & {
        from: number;
        to: number;
    }>;
    /**
     * 轻小说列表
     * 注意與轻小说最近更新不同，此列表可能會額外多出其他小說
     */
    articleList(page?: number, fullflag?: number): IBluebird<IWenku8RecentUpdate>;
    articleListAll(from: number, to?: number, options?: {
        throwError?: boolean;
        delay?: number;
    }, ...args: IParametersSlice<this["articleList"]>): Bluebird<IWenku8RecentUpdate & {
        from: number;
        to: number;
    }>;
    isLogin(): IBluebird<boolean>;
    bookInfo(novel_id: number | string): IBluebird<IWenku8RecentUpdateRowBook>;
    bookChapters(novel_id: number | string, cid: number | string): IBluebird<IWenku8BookChapters>;
    bookInfoWithChapters(novel_id: number | string): Bluebird<IWenku8RecentUpdateRowBookWithChapters>;
    cookiesRemoveTrack(): this;
    _encodeURIComponent(text: string): string;
    search(searchData: {
        'searchkey': string;
        searchtype?: IArticleSearchType;
        page?: number;
    }): IBluebird<IWenku8SearchList>;
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
        novel_id: string | number;
        cid: string | number;
        chapter_id: string | number;
    }, options?: {
        rawHtml?: boolean;
        cb?(data: {
            i: number;
            $elem: JQuery<HTMLElement>;
            $content: JQuery<HTMLElement>;
            src: string;
            imgs: string[];
        }): void;
    }): IBluebird<{
        novel_id: string;
        cid: string;
        chapter_id: string;
        imgs: string[];
        text: string;
        html?: string;
    }>;
    _iconvDecode(buf: Buffer): string;
}
export default Wenku8Client;
