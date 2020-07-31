import AbstractHttpClientWithJSDom, { IJSDOM } from 'restful-decorator-plugin-jsdom/lib';
import { AbstractHttpClient, IBluebird } from 'restful-decorator/lib';
import Bluebird from 'bluebird';
import { Cookie } from 'tough-cookie';
import { IPHPWindTaskList } from './types';
import { IBluebirdAxiosResponse } from '@bluelovers/axios-extend/lib';
/**
 * Created by user on 2020/5/13.
 */
export declare class PHPWindClient extends AbstractHttpClientWithJSDom {
    /**
     * window.verifyhash
     */
    _verifyhash?: string;
    constructor(...argv: ConstructorParameters<typeof AbstractHttpClient>);
    loginByForm(inputData: {
        username: string;
        password: string;
        cookietime?: number;
        lgt?: number | 0 | 1 | 2;
        hideid?: number | 0 | 1;
    }): IBluebird<boolean | string>;
    isLogin(): IBluebird<boolean | string>;
    _getAuthCookies(): Record<"winduser", Cookie>;
    hasCookiesAuth(): boolean;
    _updateVerifyHash(jsdom?: IJSDOM | string): string;
    taskList(): IBluebird<IPHPWindTaskList>;
    taskListNew(): IBluebird<IPHPWindTaskList>;
    taskListDoing(): IBluebird<NonNullable<IPHPWindTaskList["doing"]>>;
    taskApply(task_id: number | string, extra?: {
        nowtime?: string | number;
        verify?: string;
    }): IBluebirdAxiosResponse<unknown>;
    taskDraw(task_id: number | string, extra?: {
        nowtime?: string | number;
        verify?: string;
    }): IBluebirdAxiosResponse<unknown>;
    doAutoTaskList(cb?: (eventName: 'taskListNew' | 'taskApply' | 'taskListDoing' | 'taskDraw', data: any) => any): Bluebird<import("axios").AxiosResponse<unknown>[]>;
}
export default PHPWindClient;
