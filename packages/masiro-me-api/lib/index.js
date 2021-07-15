"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MasiroMeClient = void 0;
const tslib_1 = require("tslib");
const http_1 = require("restful-decorator/lib/decorators/http");
const headers_1 = require("restful-decorator/lib/decorators/headers");
const cache_1 = require("restful-decorator/lib/decorators/config/cache");
const index_1 = (0, tslib_1.__importDefault)(require("restful-decorator-plugin-jsdom/lib/index"));
const method_1 = require("restful-decorator/lib/decorators/method");
const abstract_1 = require("restful-decorator/lib/wrap/abstract");
const body_1 = require("restful-decorator/lib/decorators/body");
const bluebird_1 = (0, tslib_1.__importDefault)(require("bluebird"));
const jsdom_1 = require("restful-decorator-plugin-jsdom/lib/decorators/jsdom");
const form_1 = require("restful-decorator/lib/decorators/form");
const trim_1 = require("./util/trim");
const moment_1 = (0, tslib_1.__importDefault)(require("moment"));
const regexp_cjk_1 = require("regexp-cjk");
let MasiroMeClient = class MasiroMeClient extends index_1.default {
    loginByForm(inputData) {
        const jsdom = this.$returnValue;
        const { $ } = jsdom;
        let u = this._checkLogin(jsdom);
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
    _checkLogin(jsdom) {
        const { $ } = jsdom;
        let username = $('.main-header .user .dropdown-toggle span:eq(0)')
            .text()
            .replace(/^\s+|\s+$/g, '');
        if (username === null || username === void 0 ? void 0 : username.length) {
            return username;
        }
    }
    checkLogin() {
        return this._checkLogin(this.$returnValue);
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
        let author = (0, trim_1.trimUnsafe)($('.n-detail .author').text());
        let translator;
        $('.n-detail .n-translator a')
            .each((index, elem) => {
            let s = (0, trim_1.trimUnsafe)($(elem).text());
            if (s.length) {
                translator !== null && translator !== void 0 ? translator : (translator = []);
                translator.push(s);
            }
        });
        let tags;
        $('.n-detail .tags a .label')
            .each((index, elem) => {
            let s = (0, trim_1.trimUnsafe)($(elem).text());
            if (s.length) {
                tags !== null && tags !== void 0 ? tags : (tags = []);
                tags.push(s);
            }
        });
        let _date = (0, trim_1.trimUnsafe)($('.n-detail .n-update .s-font').text());
        let updated;
        if (_date === null || _date === void 0 ? void 0 : _date.length) {
            updated = (0, moment_1.default)(_date).valueOf();
        }
        let content = (0, trim_1.trimUnsafe)($('.content .brief').text())
            .replace(new regexp_cjk_1.zhRegExp(/^简介(?:：|:)\s*/), '');
        let book = {
            id: novel_id,
            title: (0, trim_1.trimUnsafe)($('.novel-title').text()),
            authors: author.length ? [author] : void 0,
            translator,
            tags,
            updated,
            content: content.length ? content : void 0,
        };
        return book;
    }
};
(0, tslib_1.__decorate)([
    (0, method_1.GET)('admin/auth/login'),
    (0, cache_1.CacheRequest)({
        // @ts-ignore
        cache: false,
    }),
    (0, jsdom_1.ReturnValueToJSDOM)(),
    (0, abstract_1.methodBuilder)(),
    (0, tslib_1.__param)(0, (0, body_1.ParamMapAuto)()),
    (0, tslib_1.__metadata)("design:type", Function),
    (0, tslib_1.__metadata)("design:paramtypes", [Object]),
    (0, tslib_1.__metadata)("design:returntype", void 0)
], MasiroMeClient.prototype, "loginByForm", null);
(0, tslib_1.__decorate)([
    (0, method_1.POST)('admin/auth/login'),
    (0, headers_1.Headers)({
        Referer: 'https://masiro.me/admin/auth/login',
    }),
    form_1.FormUrlencoded,
    (0, abstract_1.methodBuilder)(),
    (0, tslib_1.__param)(0, (0, body_1.ParamMapAuto)({
        remember: 1,
    })),
    (0, tslib_1.__metadata)("design:type", Function),
    (0, tslib_1.__metadata)("design:paramtypes", [Object]),
    (0, tslib_1.__metadata)("design:returntype", void 0)
], MasiroMeClient.prototype, "_loginByForm", null);
(0, tslib_1.__decorate)([
    (0, method_1.GET)('/'),
    (0, cache_1.CacheRequest)({
        // @ts-ignore
        cache: false,
    }),
    (0, jsdom_1.ReturnValueToJSDOM)(),
    (0, abstract_1.methodBuilder)(),
    (0, tslib_1.__metadata)("design:type", Function),
    (0, tslib_1.__metadata)("design:paramtypes", []),
    (0, tslib_1.__metadata)("design:returntype", bluebird_1.default)
], MasiroMeClient.prototype, "checkLogin", null);
(0, tslib_1.__decorate)([
    (0, method_1.GET)('admin/novelView?novel_id={novel_id}'),
    (0, jsdom_1.ReturnValueToJSDOM)(),
    (0, abstract_1.methodBuilder)(),
    (0, tslib_1.__param)(0, (0, body_1.ParamPath)('novel_id')),
    (0, tslib_1.__metadata)("design:type", Function),
    (0, tslib_1.__metadata)("design:paramtypes", [Object]),
    (0, tslib_1.__metadata)("design:returntype", bluebird_1.default)
], MasiroMeClient.prototype, "bookInfo", null);
MasiroMeClient = (0, tslib_1.__decorate)([
    (0, http_1.BaseUrl)('https://masiro.me'),
    (0, headers_1.Headers)({
        Referer: 'https://masiro.me/admin',
    }),
    (0, cache_1.CacheRequest)({
        cache: {
            maxAge: 6 * 60 * 60 * 1000,
        },
    })
], MasiroMeClient);
exports.MasiroMeClient = MasiroMeClient;
exports.default = MasiroMeClient;
//# sourceMappingURL=index.js.map