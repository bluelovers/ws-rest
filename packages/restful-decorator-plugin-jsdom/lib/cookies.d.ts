import { CookieJar, Store } from 'tough-cookie';
import { LazyCookieJar } from 'lazy-cookies';
export declare function deserializeCookieJar(serialized: CookieJar.Serialized | string, store?: Store): LazyCookieJar;
