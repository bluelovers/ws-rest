"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AbstractHttpClientWithJSDom = void 0;
const lib_1 = require("restful-decorator/lib");
const pack_1 = require("jsdom-extra/lib/pack");
const lib_2 = __importStar(require("@bluelovers/axios-util/lib"));
const tough_cookie_1 = require("tough-cookie");
const jsdom_extra_1 = require("jsdom-extra");
const buffer_1 = require("buffer");
const utf8_1 = require("./util/utf8");
const decorators_1 = require("restful-decorator/lib/decorators");
const bluebird_1 = __importDefault(require("bluebird"));
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
        return utf8_1.iconvDecode(buf);
    }
    _decodeBuffer(buf) {
        return this._iconvDecode(buffer_1.Buffer.from(buf));
    }
    _createJSDOM(html, config) {
        if (config) {
            return jsdom_extra_1.createJSDOM(html, config);
        }
        return jsdom_extra_1.createJSDOM(html);
    }
    _responseDataToJSDOM(data, response, jsdomOptions) {
        const html = this._decodeBuffer(data);
        if (response) {
            let $responseUrl = lib_2.getResponseUrl(response);
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
            userAgent: lib_2.default(response, 'config.headers.User-Agent'),
            referrer: lib_2.default(response, 'config.headers.Referer'),
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
__decorate([
    decorators_1.GET('/cdn-cgi/trace'),
    jsdom_1.ReturnValueToJSDOM(),
    decorators_1.methodBuilder(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AbstractHttpClientWithJSDom.prototype, "_plugin_cloudflare_trace", null);
AbstractHttpClientWithJSDom = __decorate([
    decorators_1.RequestConfigs({
        responseType: 'arraybuffer',
    }),
    __metadata("design:paramtypes", [Object])
], AbstractHttpClientWithJSDom);
exports.AbstractHttpClientWithJSDom = AbstractHttpClientWithJSDom;
exports.default = AbstractHttpClientWithJSDom;
//# sourceMappingURL=index.js.map