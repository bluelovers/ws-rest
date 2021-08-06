"use strict";
/**
 * Created by user on 2019/6/10.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.LazyCookieJar = exports.LazyCookie = void 0;
const tslib_1 = require("tslib");
const tough_cookie_1 = (0, tslib_1.__importStar)(require("tough-cookie"));
const moment_1 = (0, tslib_1.__importDefault)(require("moment"));
class LazyCookie extends tough_cookie_1.default.Cookie {
    constructor(prop = {}, ...argv) {
        if (!prop.expires || prop.expires === -1) {
            prop.expires = (0, moment_1.default)().add(1, 'year');
        }
        else if (typeof prop.expires == 'number') {
            prop.expires = (0, moment_1.default)().add(prop.expires, 's');
        }
        for (let key in prop) {
            if (moment_1.default.isMoment(prop[key])) {
                // @ts-ignore
                prop[key] = prop[key].toDate();
            }
        }
        super(prop);
    }
    static create(prop, ...argv) {
        return new this(prop, ...argv);
    }
}
exports.LazyCookie = LazyCookie;
class LazyCookieJar extends tough_cookie_1.default.CookieJar {
    constructor(store, options = {}, data = {}, url) {
        super(store, options);
        this.setData(data, url);
    }
    setData(data, url) {
        url = (url || '').toString();
        data = data;
        for (let key in data) {
            if (data[key] === null || typeof data[key] != 'object') {
                this.setCookieSync(new LazyCookie({
                    key,
                    value: data[key],
                }), url);
            }
            else if (data[key] instanceof tough_cookie_1.default.Cookie) {
                this.setCookieSync(data[key], url);
            }
            else if (data[key]) {
                this.setCookieSync(new LazyCookie(data[key]), url);
            }
        }
        return this;
    }
    _handleCookieOrString(cookieOrString, currentUrl) {
        if (typeof cookieOrString == 'string') {
            cookieOrString = tough_cookie_1.default.Cookie.parse(cookieOrString);
        }
        else if (!(cookieOrString instanceof tough_cookie_1.default.Cookie)) {
            cookieOrString = new LazyCookie(cookieOrString);
        }
        if (!currentUrl) {
            if (cookieOrString instanceof tough_cookie_1.default.Cookie) {
                currentUrl = `http://` + cookieOrString.canonicalizedDomain();
            }
        }
        else if (typeof currentUrl != 'string') {
            currentUrl = currentUrl.toString();
        }
        return {
            cookieOrString,
            // @ts-ignore
            currentUrl,
        };
    }
    setCookie(cookieOrString, currentUrl, ...argv) {
        ({ cookieOrString, currentUrl } = this._handleCookieOrString(cookieOrString, currentUrl));
        // @ts-ignore
        return super.setCookie(cookieOrString, currentUrl, ...argv);
    }
    setCookieSync(cookieOrString, currentUrl, options = {}, ...argv) {
        ({ cookieOrString, currentUrl } = this._handleCookieOrString(cookieOrString, currentUrl));
        // @ts-ignore
        return super.setCookieSync(cookieOrString, currentUrl, options, ...argv);
    }
    findCookieByKey(key, currentUrl) {
        let fn;
        if (typeof key === 'string') {
            fn = (v => v.key === key);
        }
        else if (key instanceof RegExp) {
            fn = (v => key.test(v.key));
        }
        else if (typeof key === 'function') {
            fn = key;
        }
        else {
            throw new TypeError(`search key is not allow`);
        }
        let cookies;
        if (currentUrl != null) {
            cookies = this.getCookiesSync(currentUrl.toString());
        }
        else {
            cookies = this.getAllCookies();
        }
        return cookies
            .filter(fn);
    }
    deleteCookieSync(key, currentUrl) {
        let cs = this.findCookieByKey(key, currentUrl);
        cs
            .forEach(v => {
            v.setMaxAge(-1);
            v.expiryTime(0);
            v.value = '';
        });
        return cs;
    }
    static create(store, options = {}, data = {}, url) {
        return new this(store, options, data, url);
    }
    getAllCookies() {
        let cookies;
        this.store.getAllCookies((err, cookie) => {
            cookies = cookie;
        });
        return cookies;
    }
    static deserialize(...argv) {
        let cb;
        if (argv.length !== 3) {
            cb = argv[1];
        }
        else if (argv.length) {
            cb = argv[argv.length - 1];
        }
        // @ts-ignore
        tough_cookie_1.CookieJar.deserialize(...argv, (err, _jar) => {
            let jar = new this(_jar.store, _jar.rejectPublicSuffixes);
            if (cb) {
                cb(this._copyCookieJar(_jar, jar));
            }
        });
    }
    static deserializeSync(serialized, store) {
        let _jar = tough_cookie_1.CookieJar.deserializeSync(serialized, store);
        let jar = new this(_jar.store, _jar.rejectPublicSuffixes);
        return this._copyCookieJar(_jar, jar);
    }
    static fromJSON(string) {
        return this.deserializeSync(string);
    }
    static createFrom(jarFrom) {
        let _jar = jarFrom;
        let jar = new this(_jar.store, _jar.rejectPublicSuffixes);
        return this._copyCookieJar(_jar, jar);
    }
    static _copyCookieJar(jarFrom, jarTo) {
        jarTo.store = jarFrom.store;
        jarTo.rejectPublicSuffixes = jarFrom.rejectPublicSuffixes;
        jarTo.enableLooseMode = jarFrom.enableLooseMode;
        jarTo.allowSpecialUseDomain = jarFrom.allowSpecialUseDomain;
        return jarTo;
    }
}
exports.LazyCookieJar = LazyCookieJar;
exports.default = LazyCookie;
//# sourceMappingURL=index.js.map