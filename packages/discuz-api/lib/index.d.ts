/// <reference types="node" />
import { AbstractHttpClient } from 'restful-decorator/lib';
import AbstractHttpClientWithJSDom from 'restful-decorator-plugin-jsdom/lib';
import { IBluebird } from 'restful-decorator/lib/index';
import Bluebird from 'bluebird';
import toughCookie from 'tough-cookie';
import { IConstructorOptions as IJSDOMConstructorOptions } from 'jsdom-extra';
import { IDiscuzForum, IDzParamForumdisplay, IDiscuzTaskList, IDzParamNoticeView, IDiscuzForumPickThreads, IDiscuzThread, IDzParamThreadOptions2, IDiscuzThreadPickRange, IDzWindow, IJSDOM_WITH } from './types';
import { IBluebirdAxiosResponse } from '@bluelovers/axios-extend/lib';
import { ITSRequiredWith, ITSResolvable } from 'ts-type';
export declare class DiscuzClient extends AbstractHttpClientWithJSDom {
    constructor(...argv: ConstructorParameters<typeof AbstractHttpClient>);
    protected _constructor(): void;
    loginByForm(inputData: {
        username: string;
        password: string;
        cookietime?: number;
    }): IBluebird<boolean | string>;
    _getAuthCookies(): Record<"auth" | "sid" | "saltkey", toughCookie.Cookie>;
    /**
     * 取得板塊資訊
     */
    forum(argv: IDzParamForumdisplay): IBluebird<IDiscuzForum>;
    forumThread(argv: ITSRequiredWith<IDzParamForumdisplay, 'page'>): IBluebird<IDiscuzForum>;
    /**
     * 取得板塊下指定範圍頁數的主題列表
     */
    forumThreads(argv: IDzParamForumdisplay, range?: {
        from?: number;
        to?: number;
        delay?: number;
        /**
         * 允許中斷後續頁數抓取
         */
        next?(cur: IDiscuzForum, forum: IDiscuzForum): ITSResolvable<boolean>;
    }): Bluebird<IDiscuzForumPickThreads>;
    isLogin(): IBluebird<boolean | string>;
    hasCookiesAuth(): boolean;
    taskList(): IBluebird<IDiscuzTaskList>;
    taskListNew(): IBluebird<IDiscuzTaskList>;
    taskListDoing(): IBluebird<IDiscuzTaskList["doing"]>;
    /**
     * auto apply new task list and draw it
     */
    doAutoTaskList(cb?: (eventName: 'taskListNew' | 'taskApply' | 'taskListDoing' | 'taskDraw', data: any) => any): Bluebird<import("axios").AxiosResponse<unknown>[]>;
    taskApply(task_id: number | string): IBluebirdAxiosResponse<unknown>;
    taskDraw(task_id: number | string): IBluebirdAxiosResponse<unknown>;
    taskDelete(task_id: number | string): IBluebirdAxiosResponse<unknown>;
    noticeView(view?: IDzParamNoticeView): IBluebirdAxiosResponse<unknown>;
    thread(thread_options2: IDzParamThreadOptions2): IBluebird<IDiscuzThread>;
    threadPosts(thread_options2: IDzParamThreadOptions2, range?: {
        from?: number;
        to?: number;
        delay?: number;
    }): IBluebird<IDiscuzThreadPickRange>;
    jsInfo(): Bluebird<{
        var: {
            charset: string;
            cookiepre: string;
            SITEURL: string;
        };
        jsdom: IJSDOM_WITH<{
            window: IDzWindow;
        }>;
    }>;
    _createJSDOM(html: string | Buffer, config: IJSDOMConstructorOptions): IJSDOM_WITH<{
        window: IDzWindow;
    }>;
}
export default DiscuzClient;
