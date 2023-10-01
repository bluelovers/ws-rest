"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NovelStarClient = void 0;
const tslib_1 = require("tslib");
const http_1 = require("restful-decorator/lib/decorators/http");
const headers_1 = require("restful-decorator/lib/decorators/headers");
const cache_1 = require("restful-decorator/lib/decorators/config/cache");
const index_1 = tslib_1.__importDefault(require("restful-decorator-plugin-jsdom/lib/index"));
const method_1 = require("restful-decorator/lib/decorators/method");
const abstract_1 = require("restful-decorator/lib/wrap/abstract");
const body_1 = require("restful-decorator/lib/decorators/body");
const bluebird_1 = tslib_1.__importDefault(require("bluebird"));
const jsdom_1 = require("restful-decorator-plugin-jsdom/lib/decorators/jsdom");
const index_2 = require("restful-decorator/lib/decorators/config/index");
const _checkLogin_1 = require("./util/_checkLogin");
const _queryRecentUpdate_1 = require("./util/_queryRecentUpdate");
const array_hyper_unique_1 = require("array-hyper-unique");
const _getRecentUpdate_1 = require("./util/_getRecentUpdate");
let NovelStarClient = class NovelStarClient extends index_1.default {
    checkLogin() {
        return (0, _checkLogin_1._checkLogin)(this.$returnValue.$);
    }
    isLogin() {
        return this.checkLogin();
    }
    _getAuthCookies() {
        return this._jar()
            .findCookieByKey('mid', this.$baseURL)
            .reduce((a, b) => {
            let _key = b.key;
            // @ts-ignore
            a[_key] = b;
            return a;
        }, {});
    }
    _recentUpdate(page, extra) {
        const jsdom = this.$returnValue;
        const { $ } = jsdom;
        return (0, _getRecentUpdate_1._getRecentUpdate)($, page, this.$baseURL, extra);
    }
    recentUpdate(page, extra) {
        return this._recentUpdate(...(0, _queryRecentUpdate_1._queryRecentUpdate)(page, extra));
    }
    recentUpdateAll(options, extra) {
        let start = (options === null || options === void 0 ? void 0 : options.start) || 1;
        return this.recentUpdate(start, extra)
            .then(async (data) => {
            var _a, _b, _c;
            let cur = start = data.page;
            let end = Math.max((_a = options === null || options === void 0 ? void 0 : options.end) !== null && _a !== void 0 ? _a : Infinity, start, 1);
            let last;
            const filter = (_b = options === null || options === void 0 ? void 0 : options.filter) !== null && _b !== void 0 ? _b : (() => false);
            while (cur < end) {
                let data2 = await this._recentUpdate(++cur, data.extra);
                if (data2.page === last || cur !== data2.page || !data2.list.length) {
                    break;
                }
                if ((_c = (await filter(data2, data.list))) !== null && _c !== void 0 ? _c : false) {
                    break;
                }
                data.list.push(...data2.list);
                data.range.max = data2.range.max || data.range.max;
                last = cur;
            }
            (0, array_hyper_unique_1.array_unique_overwrite)(data.list);
            return {
                start,
                end: last !== null && last !== void 0 ? last : start,
                range: data.range,
                extra,
                list: data.list,
            };
        });
    }
};
exports.NovelStarClient = NovelStarClient;
tslib_1.__decorate([
    (0, method_1.GET)('member/home/'),
    (0, index_2.RequestConfigs)({
        cache: {
            maxAge: 0,
            ignoreCache: true,
            excludeFromCache: true,
        },
    }),
    (0, jsdom_1.ReturnValueToJSDOM)(),
    (0, abstract_1.methodBuilder)({
        disableFallbackReturnValue: true,
    }),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", bluebird_1.default)
], NovelStarClient.prototype, "checkLogin", null);
tslib_1.__decorate([
    (0, method_1.GET)('books/'),
    (0, jsdom_1.ReturnValueToJSDOM)(),
    (0, abstract_1.methodBuilder)(),
    tslib_1.__param(0, (0, body_1.ParamQuery)('p', 1)),
    tslib_1.__param(1, (0, body_1.ParamMapAuto)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Number, Object]),
    tslib_1.__metadata("design:returntype", void 0)
], NovelStarClient.prototype, "_recentUpdate", null);
exports.NovelStarClient = NovelStarClient = tslib_1.__decorate([
    (0, http_1.BaseUrl)('https://www.novelstar.com.tw/'),
    (0, headers_1.Headers)({
        Referer: 'https://www.novelstar.com.tw/',
    }),
    (0, cache_1.CacheRequest)({
        cache: {
            maxAge: 6 * 60 * 60 * 1000,
            readHeaders: false,
            //debug: true,
            exclude: {
                query: false,
            },
        },
    })
], NovelStarClient);
exports.default = NovelStarClient;
//# sourceMappingURL=index.js.map