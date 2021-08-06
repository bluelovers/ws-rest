/**
 * Created by user on 2019/6/10.
 */
import toughCookie, { CookieJar, Store, Cookie } from 'tough-cookie';
import moment from 'moment';
import { ITSPickExtra } from 'ts-type';
export declare class LazyCookie extends toughCookie.Cookie {
    constructor(prop?: Partial<ILazyCookieProperties>, ...argv: any[]);
    static create(prop?: Partial<ILazyCookieProperties>, ...argv: any[]): LazyCookie;
}
export interface ILazyCookieProperties extends Omit<IToughCookieProperties, 'expires' | 'creation' | 'lastAccessed'> {
    expires?: Date | moment.Moment | number;
    creation?: Date | moment.Moment;
    lastAccessed?: Date | moment.Moment;
}
export declare type ILazyCookiePropertiesInput = ITSPickExtra<ILazyCookieProperties, 'key'>;
export interface IToughCookieProperties {
    key?: string;
    value?: string;
    expires?: Date;
    maxAge?: number | 'Infinity' | '-Infinity';
    domain?: string;
    path?: string;
    secure?: boolean;
    httpOnly?: boolean;
    extensions?: string[];
    creation?: Date;
    creationIndex?: number;
    hostOnly?: boolean;
    pathIsDefault?: boolean;
    lastAccessed?: Date;
}
export declare type ICookiesInstance = toughCookie.Cookie | LazyCookie;
export declare type ICookiesValue = string | ILazyCookiePropertiesInput | ICookiesInstance;
export declare type ICookiesValueRecord<T extends string> = Record<string | T, ICookiesValue>;
export declare type ICookiesValueInput<T extends string> = ICookiesValueRecord<T> | ICookiesValue[];
export declare class LazyCookieJar extends toughCookie.CookieJar {
    enableLooseMode?: boolean;
    rejectPublicSuffixes?: boolean;
    allowSpecialUseDomain?: boolean;
    store?: toughCookie.Store;
    constructor(store?: any, options?: {}, data?: {}, url?: string | URL);
    setData<T extends string>(data: ICookiesValueInput<T>, url?: string | URL): this;
    _handleCookieOrString(cookieOrString: ICookiesValue, currentUrl?: string | URL): {
        cookieOrString: ICookiesInstance;
        currentUrl?: string;
    };
    setCookie(cookieOrString: ICookiesValue, currentUrl: string | URL, options: CookieJar.SetCookieOptions, cb: (err: Error | null, cookie: Cookie) => void): void;
    setCookie(cookieOrString: ICookiesValue, currentUrl: string | URL, cb: (err: Error, cookie: Cookie) => void): void;
    setCookieSync(cookieOrString: ICookiesValue, currentUrl?: string | URL, options?: toughCookie.CookieJar.SetCookieOptions, ...argv: any[]): void;
    findCookieByKey(key: string | RegExp | ((cookie: Cookie) => boolean), currentUrl?: string | URL): toughCookie.Cookie[];
    deleteCookieSync(key: string | RegExp | ((cookie: Cookie) => boolean), currentUrl?: string | URL): toughCookie.Cookie[];
    static create(store?: any, options?: {}, data?: {}, url?: string | URL): LazyCookieJar;
    getAllCookies(): toughCookie.Cookie[];
    static deserialize(serialized: CookieJar.Serialized | string, store: Store, cb: (err: Error | null, object: CookieJar) => void): void;
    static deserialize(serialized: CookieJar.Serialized | string, cb: (err: Error | null, object: CookieJar) => void): void;
    static deserializeSync(serialized: CookieJar.Serialized | string, store?: Store): LazyCookieJar;
    static fromJSON(string: string): LazyCookieJar;
    static createFrom(jarFrom: CookieJar | LazyCookieJar): LazyCookieJar;
    static _copyCookieJar(jarFrom: CookieJar | LazyCookieJar, jarTo: LazyCookieJar): LazyCookieJar;
}
export default LazyCookie;
