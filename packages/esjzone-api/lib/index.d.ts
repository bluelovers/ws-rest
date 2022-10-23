import AbstractHttpClientWithJSDom from 'restful-decorator-plugin-jsdom/lib';
import { IBluebird } from 'restful-decorator/lib/index';
import Bluebird from 'bluebird';
import { IJSDOM } from 'jsdom-extra';
import { IESJzoneRecentUpdate, IESJzoneRecentUpdateRowBook, IParametersSlice, IESJzoneRecentUpdateDay, IESJzoneChapter, IESJzoneChapterByPasswordForm, IESJzoneChapterOptions, IESJzoneChapterLocked } from './types';
/**
 * https://www.wenku8.net/index.php
 */
export declare class ESJzoneClient extends AbstractHttpClientWithJSDom {
    protected _handleArticleList<T extends Partial<IESJzoneRecentUpdate>, R = T & Pick<IESJzoneRecentUpdate, 'end' | 'last_update_time' | 'data'>>(_this: this, retDataInit: T): R;
    protected _handleArticleTopListAll<T extends (page?: number, args?: any) => any>(method: T, args: IParametersSlice<T>, from?: number, pageTo?: number, { throwError, delay, }?: {
        throwError?: boolean;
        delay?: number;
    }): Bluebird<import("ts-type").ITSAwaitedLazy<ReturnType<T>> & {
        from: number;
        to: number;
    }>;
    /**
     * 轻小说列表
     * 注意與轻小说最近更新不同，此列表可能會額外多出其他小說
     */
    articleList(page?: number, ...argv: any[]): IBluebird<IESJzoneRecentUpdate>;
    articleListAll(from: number, to?: number, options?: {
        throwError?: boolean;
        delay?: number;
    }, ...args: IParametersSlice<this["articleList"]>): Bluebird<IESJzoneRecentUpdate & {
        from: number;
        to: number;
    }>;
    /**
     * @deprecated
     * @todo
     */
    isLogin(): IBluebird<boolean>;
    bookInfo(novel_id: number | string): IBluebird<IESJzoneRecentUpdateRowBook>;
    cookiesRemoveTrack(): this;
    _getDecodeChapter(argv: {
        novel_id: string | number;
        chapter_id: string | number;
        code: string;
    }): Promise<string[]>;
    /**
     *
     * @param {IESJzoneChapterByPasswordForm} data
     * @returns {Bluebird<IJSDOM>}
     */
    _queryChapterByPassword(data: IESJzoneChapterByPasswordForm): Bluebird<IJSDOM>;
    /**
     * @see https://www.esjzone.cc/forum/1604843935/100652.html
     */
    _getChapterByPassword(argv: {
        novel_id: string | number;
        chapter_id: string | number;
        password?: string;
    }, jsdom?: IJSDOM, data?: Partial<IESJzoneChapterByPasswordForm>): Bluebird<IJSDOM>;
    _getChapter(argv: {
        novel_id: string | number;
        chapter_id: string | number;
    }): Bluebird<Omit<ESJzoneClient, '$returnValue'> & {
        $returnValue: IJSDOM;
    }>;
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
        chapter_id: string | number;
        password?: string;
    }, options?: IESJzoneChapterOptions): Bluebird<IESJzoneChapterLocked | IESJzoneChapter>;
    recentUpdateDay(): IBluebird<IESJzoneRecentUpdateDay>;
}
export default ESJzoneClient;
