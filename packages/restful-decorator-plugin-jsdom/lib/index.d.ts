/// <reference types="jsdom" />
/// <reference types="node" />
import { AbstractHttpClient } from 'restful-decorator/lib';
import { IConstructorOptions as IJSDOMConstructorOptions, VirtualConsole } from 'jsdom-extra/lib/pack';
import { IJSDOM } from 'jsdom-extra';
import { ICookiesValueInput } from 'lazy-cookies';
import Bluebird from 'bluebird';
export { IJSDOM };
export declare abstract class AbstractHttpClientWithJSDom extends AbstractHttpClient {
    virtualConsole: VirtualConsole;
    constructor(...argv: ConstructorParameters<typeof AbstractHttpClient>);
    protected _constructor(): void;
    loginByCookies<T extends string>(cookies_data: ICookiesValueInput<T>): Bluebird<this>;
    loginByCookiesSync<T extends string>(cookies_data: ICookiesValueInput<T>): this;
    _iconvDecode(buf: Buffer): string;
    _decodeBuffer(buf: unknown | ArrayBuffer | Buffer): string;
    _createJSDOM(html: string | Buffer, config: IJSDOMConstructorOptions): IJSDOM;
    _responseDataToJSDOM(data: unknown, response: this["$response"], jsdomOptions?: IJSDOMConstructorOptions): IJSDOM;
    _encodeURIComponent(text: string): string;
    _plugin_cloudflare_trace(): Promise<{
        cloudflare: boolean;
        data: {
            /**
             * '12f313'
             */
            fl: string;
            /**
             * domain name
             */
            h: string;
            ip: string;
            /**
             * '1587972669.851'
             */
            ts: string;
            visit_scheme: 'https' | string;
            /**
             * 'axios/0.18.1'
             */
            uag: string;
            colo: 'LAX' | string;
            http: 'http/1.1' | string;
            loc: 'TW' | string;
            tls: 'TLSv1.3' | string;
            sni: 'plaintext' | string;
            warp: 'off' | 'on' | string;
        };
    }>;
}
export default AbstractHttpClientWithJSDom;
