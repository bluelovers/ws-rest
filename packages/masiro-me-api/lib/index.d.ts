import AbstractHttpClientWithJSDom from 'restful-decorator-plugin-jsdom/lib/index';
import Bluebird from 'bluebird';
import { IJSDOM } from 'jsdom-extra/lib/pack';
import { Cookie } from 'tough-cookie';
import { IMasiroMeBook } from './types';
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
    protected _checkLogin(jsdom: IJSDOM): string;
    checkLogin(): Bluebird<string>;
    _getAuthCookies(): Record<"laravel_session" | "remember_admin" | "XSRF-TOKEN", Cookie>;
    bookInfo(novel_id: number | string): Bluebird<IMasiroMeBook>;
}
export default MasiroMeClient;
