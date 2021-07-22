/// <reference types="jquery" />
import AbstractHttpClientWithJSDom from 'restful-decorator-plugin-jsdom/lib/index';
import Bluebird from 'bluebird';
import { Cookie } from 'tough-cookie';
import { IMasiroMeBookWithChapters, IMasiroMeChapter, IMasiroMeRecentUpdate, IMasiroMeRecentUpdateAll, IMasiroMeRecentUpdateAllOptions, IMasiroMeRecentUpdateOptions } from './types';
export declare class MasiroMeClient extends AbstractHttpClientWithJSDom {
    loginByForm(inputData: {
        username: string;
        password: string;
        activationcode?: string;
    }): Bluebird<string>;
    protected _loginByForm(inputData: {
        username: string;
        password: string;
        activationcode?: string;
        remember?: 1;
        _token: string;
    }): Bluebird<string>;
    checkLogin(): Bluebird<string>;
    isLogin(): Bluebird<string>;
    _getAuthCookies(): Record<"laravel_session" | "remember_admin" | "XSRF-TOKEN", Cookie>;
    bookInfo(novel_id: number | string): Bluebird<IMasiroMeBookWithChapters>;
    getChapter(chapter_id: string | number, options?: {
        rawHtml?: boolean;
        cb?(data: {
            i: number;
            $elem: JQuery<HTMLElement>;
            $content: JQuery<HTMLElement>;
            src: string;
            imgs: string[];
        }): void;
    }): Bluebird<IMasiroMeChapter>;
    recentUpdate(page?: number, extra?: IMasiroMeRecentUpdateOptions): Bluebird<IMasiroMeRecentUpdate>;
    recentUpdateAll(options?: IMasiroMeRecentUpdateAllOptions, extra?: IMasiroMeRecentUpdateOptions): Bluebird<IMasiroMeRecentUpdateAll>;
}
export default MasiroMeClient;
