"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MasiroMeClient = void 0;
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
const form_1 = require("restful-decorator/lib/decorators/form");
const _checkLogin_1 = require("./util/_checkLogin");
const _getBookInfo_1 = require("./util/_getBookInfo");
const _getBookChapters_1 = require("./util/_getBookChapters");
const _getChapter_1 = require("./util/_getChapter");
const index_2 = require("restful-decorator/lib/decorators/config/index");
const _getRecentUpdate_1 = require("./util/_getRecentUpdate");
const array_hyper_unique_1 = require("array-hyper-unique");
const _handleBookInfo_1 = require("./util/_handleBookInfo");
let MasiroMeClient = class MasiroMeClient extends index_1.default {
    loginByForm(inputData) {
        const jsdom = this.$returnValue;
        const { $ } = jsdom;
        let u = (0, _checkLogin_1._checkLogin)($);
        if (u === null || u === void 0 ? void 0 : u.length) {
            return u;
        }
        const _token = $(':input[name="_token"]').val();
        return this._loginByForm({
            ...inputData,
            _token,
        });
    }
    _loginByForm(inputData) {
        return this.checkLogin();
    }
    checkLogin() {
        return (0, _checkLogin_1._checkLogin)(this.$returnValue.$);
    }
    isLogin() {
        return this.checkLogin();
    }
    _getAuthCookies() {
        return this._jar()
            .findCookieByKey(/laravel_session|remember_|XSRF-TOKEN/, this.$baseURL)
            .reduce((a, b) => {
            var _a, _b;
            let _key = (_b = (_a = /^(remember_\w+)_/.exec(b.key)) === null || _a === void 0 ? void 0 : _a[1]) !== null && _b !== void 0 ? _b : b.key;
            // @ts-ignore
            a[_key] = b;
            return a;
        }, {});
    }
    bookInfo(novel_id) {
        const jsdom = this.$returnValue;
        const { $ } = jsdom;
        let book = (0, _getBookInfo_1._getBookInfo)($, novel_id, this.$baseURL);
        if (!book) {
            return Promise.reject(new Error(`'${novel_id}' 不存在或已刪除`));
        }
        let book_with_chapters = book;
        book_with_chapters.chapters = (0, _getBookChapters_1._getBookChapters)($);
        (0, _handleBookInfo_1._handleBookInfo)(book_with_chapters);
        return book_with_chapters;
    }
    getChapter(chapter_id, options = {}) {
        const jsdom = this.$returnValue;
        const { $ } = jsdom;
        return (0, _getChapter_1._getChapter)($, chapter_id, options);
    }
    recentUpdate(page, extra) {
        const json = this.$returnValue;
        const jsdom = this._responseDataToJSDOM('<meta charset="utf-8">' + json.html, this.$response);
        return (0, _getRecentUpdate_1._getRecentUpdate)(jsdom.$, json, this.$baseURL, extra);
    }
    recentUpdateAll(options, extra) {
        let start = (options === null || options === void 0 ? void 0 : options.start) || 1;
        return this.recentUpdate(start, extra)
            .then(async (data) => {
            var _a, _b;
            let cur = start = data.page;
            const end = Math.max(Math.min((options === null || options === void 0 ? void 0 : options.end) || data.pages, data.pages), start, 1);
            let last;
            const filter = (_a = options === null || options === void 0 ? void 0 : options.filter) !== null && _a !== void 0 ? _a : (() => false);
            while (cur < end) {
                let data2 = await this.recentUpdate(++cur, extra);
                if (data2.page === last || cur !== data2.page || !data2.list.length) {
                    break;
                }
                if ((_b = (await filter(data2, data.list))) !== null && _b !== void 0 ? _b : false) {
                    break;
                }
                data.list.push(...data2.list);
                data.pages = data2.pages;
                data.total = data2.total;
                last = cur;
            }
            (0, array_hyper_unique_1.array_unique_overwrite)(data.list);
            return {
                start,
                end: last !== null && last !== void 0 ? last : start,
                pages: data.pages,
                total: data.total,
                extra,
                list: data.list,
            };
        });
    }
};
exports.MasiroMeClient = MasiroMeClient;
tslib_1.__decorate([
    (0, method_1.GET)('admin/auth/login'),
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
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", void 0)
], MasiroMeClient.prototype, "loginByForm", null);
tslib_1.__decorate([
    (0, method_1.POST)('admin/auth/login'),
    (0, headers_1.Headers)({
        Referer: 'https://masiro.me/admin/auth/login',
    }),
    form_1.FormUrlencoded,
    (0, abstract_1.methodBuilder)({
        disableFallbackReturnValue: true,
    }),
    tslib_1.__param(0, (0, body_1.ParamMapAuto)({
        remember: 1,
    })),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", void 0)
], MasiroMeClient.prototype, "_loginByForm", null);
tslib_1.__decorate([
    (0, method_1.GET)('/'),
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
], MasiroMeClient.prototype, "checkLogin", null);
tslib_1.__decorate([
    (0, method_1.GET)('admin/novelView?novel_id={novel_id}'),
    (0, jsdom_1.ReturnValueToJSDOM)(),
    (0, abstract_1.methodBuilder)(),
    tslib_1.__param(0, (0, body_1.ParamPath)('novel_id')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", bluebird_1.default)
], MasiroMeClient.prototype, "bookInfo", null);
tslib_1.__decorate([
    (0, method_1.GET)('admin/novelReading?cid={chapter_id}'),
    (0, jsdom_1.ReturnValueToJSDOM)(),
    (0, abstract_1.methodBuilder)(),
    tslib_1.__param(0, (0, body_1.ParamPath)('chapter_id')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object, Object]),
    tslib_1.__metadata("design:returntype", bluebird_1.default)
], MasiroMeClient.prototype, "getChapter", null);
tslib_1.__decorate([
    (0, method_1.GET)('admin/loadMoreNovels?page={page}&order={order}'),
    (0, index_2.RequestConfigs)({
        responseType: 'json',
    }),
    (0, abstract_1.methodBuilder)(),
    tslib_1.__param(0, (0, body_1.ParamPath)('page', 1)),
    tslib_1.__param(1, (0, body_1.ParamMapAuto)({
        order: 1,
    })),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Number, Object]),
    tslib_1.__metadata("design:returntype", bluebird_1.default)
], MasiroMeClient.prototype, "recentUpdate", null);
exports.MasiroMeClient = MasiroMeClient = tslib_1.__decorate([
    (0, http_1.BaseUrl)('https://masiro.me'),
    (0, headers_1.Headers)({
        Referer: 'https://masiro.me/admin',
    }),
    (0, cache_1.CacheRequest)({
        cache: {
            maxAge: 6 * 60 * 60 * 1000,
            readHeaders: false,
            //debug: true,
            exclude: {
                query: false,
            }
        },
    })
], MasiroMeClient);
exports.default = MasiroMeClient;
//# sourceMappingURL=index.js.map