"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AbstractHttpClientWithJSDom = void 0;
const tslib_1 = require("tslib");
const lib_1 = require("restful-decorator/lib");
const pack_1 = require("jsdom-extra/lib/pack");
const lib_2 = (0, tslib_1.__importStar)(require("@bluelovers/axios-util/lib"));
const tough_cookie_1 = require("tough-cookie");
const jsdom_extra_1 = require("jsdom-extra");
const buffer_1 = require("buffer");
const utf8_1 = require("./util/utf8");
const decorators_1 = require("restful-decorator/lib/decorators");
const bluebird_1 = (0, tslib_1.__importDefault)(require("bluebird"));
const jsdom_1 = require("./decorators/jsdom");
let AbstractHttpClientWithJSDom = class AbstractHttpClientWithJSDom extends lib_1.AbstractHttpClient {
    constructor(...argv) {
        let [defaults] = argv;
        if (defaults && typeof defaults.jar === 'string') {
            // @ts-ignore
            defaults.jar = tough_cookie_1.CookieJar.deserializeSync(defaults.jar);
        }
        // @ts-ignore
        super(...argv);
        this.virtualConsole = new pack_1.VirtualConsole();
        this._constructor();
    }
    _constructor() {
    }
    loginByCookies(cookies_data) {
        return bluebird_1.default.resolve(this.loginByCookiesSync(cookies_data));
    }
    loginByCookiesSync(cookies_data) {
        this._jar().setData(cookies_data || {}, this.$baseURL);
        return this;
    }
    _iconvDecode(buf) {
        return (0, utf8_1.iconvDecode)(buf);
    }
    _decodeBuffer(buf) {
        return this._iconvDecode(buffer_1.Buffer.from(buf));
    }
    _createJSDOM(html, config) {
        if (config) {
            return (0, jsdom_extra_1.createJSDOM)(html, config);
        }
        return (0, jsdom_extra_1.createJSDOM)(html);
    }
    _responseDataToJSDOM(data, response, jsdomOptions) {
        const html = this._decodeBuffer(data);
        if (response) {
            let $responseUrl = (0, lib_2.getResponseUrl)(response);
            if (!$responseUrl && response.config && response.config.url) {
                $responseUrl = response.config.url.toString();
            }
            let cookieJar;
            if (response.config && response.config.jar && typeof response.config.jar === 'object') {
                // @ts-ignore
                cookieJar = response.config.jar;
            }
            if ($responseUrl || cookieJar) {
                jsdomOptions = {
                    ...jsdomOptions,
                    url: $responseUrl,
                    cookieJar,
                };
                //console.debug(`_responseDataToJSDOM`, $responseUrl);
            }
        }
        jsdomOptions = {
            userAgent: (0, lib_2.default)(response, 'config.headers.User-Agent'),
            referrer: (0, lib_2.default)(response, 'config.headers.Referer'),
            virtualConsole: this.virtualConsole,
            ...jsdomOptions,
        };
        return this._createJSDOM(html, jsdomOptions);
    }
    _encodeURIComponent(text) {
        return encodeURIComponent(text);
    }
    async _plugin_cloudflare_trace() {
        const jsdom = this.$returnValue;
        const body = jsdom.$(':root').text();
        let data = body
            .split('\n')
            .reduce((a, line) => {
            let m = line.match(/^([^=]+)=(.*)\s*$/);
            if (m) {
                // @ts-ignore
                a[m[1]] = m[2];
            }
            return a;
        }, {});
        return {
            cloudflare: ('ip' in data),
            data,
        };
    }
};
(0, tslib_1.__decorate)([
    (0, decorators_1.GET)('/cdn-cgi/trace'),
    (0, jsdom_1.ReturnValueToJSDOM)(),
    (0, decorators_1.methodBuilder)(),
    (0, tslib_1.__metadata)("design:type", Function),
    (0, tslib_1.__metadata)("design:paramtypes", []),
    (0, tslib_1.__metadata)("design:returntype", Promise)
], AbstractHttpClientWithJSDom.prototype, "_plugin_cloudflare_trace", null);
AbstractHttpClientWithJSDom = (0, tslib_1.__decorate)([
    (0, decorators_1.RequestConfigs)({
        responseType: 'arraybuffer',
    }),
    (0, tslib_1.__metadata)("design:paramtypes", [Object])
], AbstractHttpClientWithJSDom);
exports.AbstractHttpClientWithJSDom = AbstractHttpClientWithJSDom;
exports.default = AbstractHttpClientWithJSDom;
//# sourceMappingURL=index.js.map