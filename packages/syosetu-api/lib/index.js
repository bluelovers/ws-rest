"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SyosetuClient = void 0;
const lib_1 = __importDefault(require("restful-decorator-plugin-jsdom/lib"));
const http_1 = require("restful-decorator/lib/decorators/http");
const headers_1 = require("restful-decorator/lib/decorators/headers");
const cache_1 = require("restful-decorator/lib/decorators/config/cache");
const method_1 = require("restful-decorator/lib/decorators/method");
const abstract_1 = require("restful-decorator/lib/wrap/abstract");
const config_1 = require("restful-decorator/lib/decorators/config");
const body_1 = require("restful-decorator/lib/decorators/body");
const const_1 = require("./util/const");
const parseDate_1 = require("./util/parseDate");
const parseUrl_1 = require("./util/parseUrl");
const jsdom_1 = require("restful-decorator-plugin-jsdom/lib/decorators/jsdom");
/**
 * @see https://syosetu.com/
 *
 * @see https://dev.syosetu.com/man/rankapi/
 * @see https://dev.syosetu.com/man/api/
 *
 * r18
 * @see https://dev.syosetu.com/xman/api/
 *
 *
 * @see https://github.com/59naga/naroujs
 * @see https://github.com/ErgoFriend/yomoujs
 */
let SyosetuClient = class SyosetuClient extends lib_1.default {
    _constructor() {
        this._setCookieSync({
            key: 'over18',
            value: 'yes',
            expires: 3600 * 24 * 360,
        });
    }
    _syosetuApi(apiPath, params) {
        return this.$http.get(apiPath, {
            params,
        });
    }
    ncodeInfoRaw(ncode, novel18) {
        const $returnValue = this.$returnValue;
        if ($returnValue[0].allcount === 0 || $returnValue[1] === void 0) {
            return Promise.reject(new RangeError(`Invalid ncode: ${ncode}, novel18: ${!!novel18}`));
        }
        // @ts-ignore
        return this.$returnValue[1];
    }
    ncodeInfo(ncode, novel18) {
        novel18 = !!novel18;
        return this.ncodeInfoRaw(ncode, novel18)
            .then(data => {
            return {
                ...data,
                general_firstup: parseDate_1.parseDateStringToMoment(data.general_firstup).valueOf(),
                general_lastup: parseDate_1.parseDateStringToMoment(data.general_lastup).valueOf(),
                novelupdated_at: parseDate_1.parseDateStringToMoment(data.novelupdated_at).valueOf(),
                updated_at: parseDate_1.parseDateStringToMoment(data.updated_at).valueOf(),
                keyword: data.keyword.split(/\s+/),
                novel18,
                url: `https://${novel18 ? 'novel18' : 'ncode'}.syosetu.com/${data.ncode.toLowerCase()}/`,
            };
        });
    }
    _getWebNovelRaw(argv) {
        return Promise.resolve(this.$returnValue);
    }
    getChapter(argv, options = {}) {
        return this._getWebNovelRaw(argv);
    }
};
__decorate([
    method_1.GET(const_1.EnumSyosetuApiURL.novel),
    config_1.RequestConfigs({
        responseType: 'json',
    }),
    body_1.BodyData({
        libtype: 2,
        out: 'json',
        lim: 1,
    })
    // @ts-ignore
    ,
    abstract_1.methodBuilder(function (info) {
        const [, novel18] = info.argv;
        if (novel18) {
            info.requestConfig.url = const_1.EnumSyosetuApiURL.novel18;
        }
        return info;
    }, {
        autoRequest: true,
    }),
    __param(0, body_1.ParamData('ncode')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Boolean]),
    __metadata("design:returntype", Promise)
], SyosetuClient.prototype, "ncodeInfoRaw", null);
__decorate([
    jsdom_1.ReturnValueToJSDOM(),
    abstract_1.methodBuilder(function (info) {
        const data = info.argv[0];
        let href = parseUrl_1.buildLink(data);
        info.requestConfig.url = href;
        return info;
    }, {
        autoRequest: true,
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], SyosetuClient.prototype, "_getWebNovelRaw", null);
SyosetuClient = __decorate([
    http_1.BaseUrl('https://api.syosetu.com/'),
    headers_1.Headers({
        Referer: 'https://syosetu.com/',
    }),
    cache_1.CacheRequest({
        cache: {
            maxAge: 12 * 60 * 60 * 1000,
        },
    })
], SyosetuClient);
exports.SyosetuClient = SyosetuClient;
exports.default = SyosetuClient;
//# sourceMappingURL=index.js.map