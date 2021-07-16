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
const _checkLogin_1 = require("./util/_checkLogin");
const _getBookInfo_1 = require("./util/_getBookInfo");
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
        let book = (0, _getBookInfo_1._getBookInfo)($, novel_id);
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