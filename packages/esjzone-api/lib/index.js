"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ESJzoneClient = void 0;
const tslib_1 = require("tslib");
const lib_1 = (0, tslib_1.__importDefault)(require("restful-decorator-plugin-jsdom/lib"));
const decorators_1 = require("restful-decorator/lib/decorators");
const bluebird_1 = (0, tslib_1.__importDefault)(require("bluebird"));
const util_1 = require("./util");
const moment_1 = (0, tslib_1.__importDefault)(require("moment"));
const uniqBy_1 = (0, tslib_1.__importDefault)(require("lodash/uniqBy"));
const jsdom_1 = require("restful-decorator-plugin-jsdom/lib/decorators/jsdom");
const orderBy_1 = (0, tslib_1.__importDefault)(require("lodash/orderBy"));
const html_1 = require("restful-decorator-plugin-jsdom/lib/html");
const jquery_1 = require("restful-decorator-plugin-jsdom/lib/jquery");
const _getChapterData_1 = require("./util/_getChapterData");
const _getBookLinks_1 = require("./util/_getBookLinks");
const _getBookInfo_1 = require("./util/_getBookInfo");
const _getBookChapters_1 = require("./util/_getBookChapters");
const _parseSiteLink_1 = require("./util/_parseSiteLink");
const _getBookTags_1 = require("./util/_getBookTags");
const _getBookCover_1 = require("./util/_getBookCover");
const _getBookElemDesc_1 = require("./util/_getBookElemDesc");
const _fixCoverUrl_1 = require("./util/_fixCoverUrl");
const _parseChapterFromPasswordReturn_1 = require("./util/_parseChapterFromPasswordReturn");
const body_1 = require("restful-decorator/lib/decorators/body");
const _checkChapterLock_1 = require("./util/_checkChapterLock");
const _handleChapterContent_1 = require("./util/_handleChapterContent");
/**
 * https://www.wenku8.net/index.php
 */
let ESJzoneClient = class ESJzoneClient extends lib_1.default {
    _handleArticleList(_this, retDataInit) {
        const jsdom = _this._responseDataToJSDOM(_this.$returnValue, this.$response);
        const $ = jsdom.$;
        // @ts-ignore
        let pageEnd = $('#page-selection [data-lp]:last').attr('data-lp') | 0;
        // @ts-ignore
        let page2 = $('#page-selection [data-lp]:eq(0)').attr('data-lp') | 0;
        if (!pageEnd) {
            $('script')
                .each((i, elem) => {
                let _this = $(elem);
                let code = _this.text();
                if (/#page-selection/.test(code)) {
                    let _m = code.match(/total\s*:\s*(\d+)/);
                    if (_m) {
                        pageEnd = _m[1] | 0;
                    }
                    _m = code.match(/\bpage\s*:\s*(\d+)/);
                    if (_m) {
                        page2 = _m[1] | 0;
                    }
                }
            });
        }
        let ret = {
            ...retDataInit,
            page: page2 || retDataInit.page,
            end: pageEnd,
            last_update_time: 0,
            data: [],
        };
        let lastUpdateTime = 0;
        let tds = $('.container .shop-toolbar + .row > div:not(.hidden-sm-up)');
        tds
            .each((i, elem) => {
            let _this = $(elem);
            let cover = _this
                .find('.card-img-tiles .main-img img:eq(0)')
                .prop('src');
            cover = (0, _fixCoverUrl_1._fixCoverUrl)(cover);
            let _a = _this
                .find('.card-body .card-title a')
                .eq(0);
            let title = (0, util_1.trimUnsafe)(_a.text());
            let cid;
            let nid;
            let last_update_chapter_name;
            let _m0 = (0, _parseSiteLink_1._parseSiteLink)(_a.prop('href'));
            nid = _m0.novel_id;
            last_update_chapter_name = _this
                .find('.card-body .card-ep')
                .eq(0)
                .text() || undefined;
            if (last_update_chapter_name) {
                last_update_chapter_name = (0, util_1.trimUnsafe)(last_update_chapter_name);
            }
            ret.data.push({
                id: nid,
                name: title,
                cover,
                last_update_chapter_name,
            });
        });
        ret.last_update_time = lastUpdateTime;
        //console.dir(ret);
        return ret;
    }
    _handleArticleTopListAll(method, args, from = 0, pageTo = Infinity, { throwError, delay, } = {}) {
        delay |= 0;
        return method
            .apply(this, [
            from, ...args,
        ])
            .then(async function (dataReturn) {
            const from = dataReturn.page;
            let { last_update_time, data } = dataReturn;
            throwError = !!throwError;
            pageTo = Math.min(dataReturn.end, pageTo);
            let to = from;
            while (to < pageTo) {
                delay && await bluebird_1.default.delay(delay);
                let retP = method
                    .apply(this, [
                    to + 1, ...args,
                ]);
                let ret;
                if (throwError) {
                    ret = await retP;
                }
                else {
                    ret = await retP.catch(e => null);
                }
                if (ret != null && ret.page != from && ret.page != to) {
                    to = ret.page;
                    data.push(...ret.data);
                    continue;
                }
                break;
            }
            return {
                // @ts-ignore
                ...dataReturn,
                from,
                to,
                last_update_time,
                data: (0, uniqBy_1.default)(data, 'id'),
            };
        });
    }
    /**
     * 轻小说列表
     * 注意與轻小说最近更新不同，此列表可能會額外多出其他小說
     */
    articleList(page, ...argv) {
        return this._handleArticleList(this, {
            page,
            end: undefined,
            last_update_time: 0,
            data: [],
        });
    }
    articleListAll(from, to = Infinity, options, ...args) {
        return this._handleArticleTopListAll(this.articleList, args, from, to, options);
    }
    /**
     * @deprecated
     * @todo
     */
    isLogin() {
        return bluebird_1.default.resolve(false);
    }
    //@GET('book/{novel_id}.htm')
    bookInfo(novel_id) {
        let jsdom = this._responseDataToJSDOM(this.$returnValue, this.$response);
        const $ = jsdom.$;
        let data = ({
            id: novel_id.toString(),
            "name": undefined,
            "titles": undefined,
            "authors": undefined,
            "cover": undefined,
            "last_update_time": 0,
            "last_update_chapter_name": undefined,
            desc: undefined,
            tags: [],
            links: [],
            chapters: [],
        });
        let _content = $('.container');
        (0, _getBookInfo_1._getBookInfo)($, data);
        (0, _getBookLinks_1._getBookLinks)($, data.links);
        (0, _getBookTags_1._getBookTags)($, data.tags);
        let cover = (0, _getBookCover_1._getBookCover)($);
        if (cover = (0, _fixCoverUrl_1._fixCoverUrl)(cover)) {
            data.cover = cover;
        }
        let $desc = (0, html_1.tryMinifyHTMLOfElem)((0, _getBookElemDesc_1._getBookElemDesc)($));
        (0, jquery_1._p_2_br)($desc.find('p'), $, true);
        data.desc = (0, util_1.trimUnsafe)($desc.text() || '');
        (0, _getBookChapters_1._getBookChapters)($, _content, data);
        return data;
    }
    cookiesRemoveTrack() {
        /*
        let _jar = this._jar();
        _jar.deleteCookieSync('jieqiVisitId');
         */
        return this;
    }
    _getDecodeChapter(argv) {
        return this.$http({
            ...this.$requestConfig,
            method: 'POST',
            data: {
                plxf: 'getTranslation',
                "plxa[]": argv.code,
            },
        })
            .then(v => {
            let source = this
                ._decodeBuffer(v.data)
                .toString()
                .replace(/\<JinJing\>/, '')
                .replace(/\<\/JinJing\>/, '');
            return JSON.parse(source);
        });
    }
    /**
     *
     * @param {IESJzoneChapterByPasswordForm} data
     * @returns {Bluebird<IJSDOM>}
     */
    _queryChapterByPassword(data) {
        const json = this.$returnValue;
        let jsdom = (0, _parseChapterFromPasswordReturn_1._parseSiteLinkChapterFromPasswordReturn)(this, json).jsdom;
        if (!jsdom) {
            let e = new Error(`Invalid password: ${data.pw}`);
            // @ts-ignore
            e.response = this.$response;
            throw e;
        }
        return jsdom;
    }
    /**
     * @see https://www.esjzone.cc/forum/1604843935/100652.html
     */
    _getChapterByPassword(argv, jsdom, data) {
        return bluebird_1.default.resolve()
            .then(async () => {
            var _b, _c;
            if (typeof jsdom === 'undefined' || jsdom === null) {
                jsdom = await this._getChapter(argv).then(m => m.$returnValue);
            }
            let $ = jsdom.$;
            let _check = (0, _checkChapterLock_1._checkChapterLock)($);
            if (_check.locked) {
                data !== null && data !== void 0 ? data : (data = {});
                data.code = argv.novel_id;
                data.rid = argv.chapter_id;
                data.pw = (_b = argv.password) !== null && _b !== void 0 ? _b : data.pw;
                data.token || (data.token = _check.form.token);
                if ((_c = data.pw) === null || _c === void 0 ? void 0 : _c.length) {
                    this._setCookieSync({
                        key: 'pw_record',
                        value: data.rid,
                    });
                    this._setCookieSync({
                        key: 'last_visit_post',
                        value: data.rid,
                    });
                    jsdom = await this._queryChapterByPassword(data);
                }
            }
            return jsdom;
        });
    }
    _getChapter(argv) {
        return this;
    }
    /**
     *
     * @example ```
     * api.getChapter({
            novel_id: 2555,
            cid: 2,
            chapter_id: 101191,
        }, {
            cb(data)
            {

                data.$elem.after(`(插圖${data.i})\n`);
                data.$elem.remove();
            },
        })
     ```
     */
    getChapter(argv, options = {}) {
        return this._getChapter(argv)
            .then(async (api) => {
            let $ = api.$returnValue.$;
            (0, _handleChapterContent_1._handleChapterContentRoot)($, argv, options);
            let jsdom2 = await this._getChapterByPassword(argv, api.$returnValue);
            let { author, dateline } = (0, _getChapterData_1._getChapterData)($);
            return {
                novel_id: argv.novel_id.toString(),
                chapter_id: argv.chapter_id.toString(),
                ...(0, _handleChapterContent_1._handleChapterContent)(jsdom2.$, argv, options),
                author,
                dateline,
            };
        });
    }
    recentUpdateDay() {
        //const jsdom = this._responseDataToJSDOM(this.$returnValue, this.$response);
        const jsdom = this.$returnValue;
        const $ = jsdom.$;
        let tabs = $('.container .nav.nav-pills[role="tablist"] li a.nav-link');
        let divs = $('.container .tab-content > div[id][role="tabpanel"]');
        let last_update_time = 0;
        let ret = {
            days: 0,
            size: 0,
            last_update_time,
            data: {},
            summary: {},
        };
        const { data, summary } = ret;
        tabs
            .each((i, tab_elem) => {
            let timestamp = (0, moment_1.default)($(tab_elem).text()).unix();
            let div = divs.eq(i);
            data[timestamp] = data[timestamp] || [];
            last_update_time = Math.max(last_update_time, timestamp, 0);
            div
                .find('> div')
                .each((i, elem) => {
                let _this = $(elem);
                let cover = _this
                    .find('.main-img img:eq(0)')
                    .prop('src');
                cover = (0, _fixCoverUrl_1._fixCoverUrl)(cover);
                let _a = _this
                    .find('.card-body .card-title a')
                    .eq(0);
                let title = _a.text();
                title = (0, util_1.trimUnsafe)(title);
                let cid;
                let nid;
                let last_update_chapter_name;
                /*
                let _m0 = (_a.prop('href') as string)
                    .match(/detail\/(\d+)/)
                ;
                nid = _m0[1];
                 */
                let _m0 = (0, _parseSiteLink_1._parseSiteLink)(_a.prop('href'));
                nid = _m0.novel_id;
                last_update_chapter_name = _this
                    .find('.card-body .card-ep')
                    .eq(0)
                    .text() || undefined;
                data[timestamp].push({
                    id: nid,
                    name: title,
                    cover,
                    last_update_chapter_name,
                });
                summary[nid] = Math.max(timestamp, summary[nid] | 0);
            });
            data[timestamp] = (0, orderBy_1.default)(data[timestamp], ["id"], ["asc"]);
        });
        ret.last_update_time = last_update_time;
        ret.days = Object.keys(data).length;
        ret.size = Object.keys(summary).length;
        return ret;
    }
};
(0, tslib_1.__decorate)([
    (0, decorators_1.GET)('list/{page}.html'),
    (0, decorators_1.methodBuilder)(),
    (0, tslib_1.__param)(0, (0, decorators_1.ParamPath)('page', 1)),
    (0, tslib_1.__metadata)("design:type", Function),
    (0, tslib_1.__metadata)("design:paramtypes", [Number, Object]),
    (0, tslib_1.__metadata)("design:returntype", Object)
], ESJzoneClient.prototype, "articleList", null);
(0, tslib_1.__decorate)([
    (0, decorators_1.GET)('detail/{novel_id}.html'),
    (0, decorators_1.methodBuilder)(),
    (0, tslib_1.__param)(0, (0, decorators_1.ParamPath)('novel_id')),
    (0, tslib_1.__metadata)("design:type", Function),
    (0, tslib_1.__metadata)("design:paramtypes", [Object]),
    (0, tslib_1.__metadata)("design:returntype", Object)
], ESJzoneClient.prototype, "bookInfo", null);
(0, tslib_1.__decorate)([
    (0, decorators_1.POST)('forum/{novel_id}/{chapter_id}.html'),
    decorators_1.FormUrlencoded,
    (0, decorators_1.methodBuilder)({
        autoRequest: false,
    }),
    (0, tslib_1.__param)(0, (0, decorators_1.ParamMapAuto)()),
    (0, tslib_1.__metadata)("design:type", Function),
    (0, tslib_1.__metadata)("design:paramtypes", [Object]),
    (0, tslib_1.__metadata)("design:returntype", void 0)
], ESJzoneClient.prototype, "_getDecodeChapter", null);
(0, tslib_1.__decorate)([
    (0, decorators_1.POST)('inc/forum_pw.php'),
    decorators_1.FormUrlencoded,
    (0, decorators_1.RequestConfigs)({
        responseType: 'json',
    }),
    (0, decorators_1.methodBuilder)(),
    (0, tslib_1.__param)(0, (0, decorators_1.ParamMapAuto)()),
    (0, tslib_1.__metadata)("design:type", Function),
    (0, tslib_1.__metadata)("design:paramtypes", [Object]),
    (0, tslib_1.__metadata)("design:returntype", bluebird_1.default)
], ESJzoneClient.prototype, "_queryChapterByPassword", null);
(0, tslib_1.__decorate)([
    (0, decorators_1.GET)('forum/{novel_id}/{chapter_id}.html'),
    (0, jsdom_1.ReturnValueToJSDOM)(),
    (0, decorators_1.methodBuilder)(),
    (0, tslib_1.__param)(0, (0, body_1.ParamMapPath)()),
    (0, tslib_1.__metadata)("design:type", Function),
    (0, tslib_1.__metadata)("design:paramtypes", [Object]),
    (0, tslib_1.__metadata)("design:returntype", bluebird_1.default)
], ESJzoneClient.prototype, "_getChapter", null);
(0, tslib_1.__decorate)([
    (0, decorators_1.GET)('update'),
    (0, jsdom_1.ReturnValueToJSDOM)(),
    (0, decorators_1.methodBuilder)(),
    (0, tslib_1.__metadata)("design:type", Function),
    (0, tslib_1.__metadata)("design:paramtypes", []),
    (0, tslib_1.__metadata)("design:returntype", Object)
], ESJzoneClient.prototype, "recentUpdateDay", null);
ESJzoneClient = (0, tslib_1.__decorate)([
    (0, decorators_1.BaseUrl)('https://www.esjzone.cc'),
    (0, decorators_1.Headers)({
        Referer: 'https://www.esjzone.cc',
    }),
    (0, decorators_1.CacheRequest)({
        cache: {
            maxAge: 6 * 60 * 60 * 1000,
        },
    })
], ESJzoneClient);
exports.ESJzoneClient = ESJzoneClient;
exports.default = ESJzoneClient;
/*
function _p_2_br(target: any, $: any)
{
    return $(target)
        .each(function (i: any, elem: any)
        {
            let _this = $(elem) as JQuery<HTMLElement>;

            let _html = _this
                .html()
                .replace(/(?:&nbsp;?)/g, ' ')
                .replace(/[\xA0\s]+$/g, '')
            ;

            if (_html == '<br/>' || _html == '<br>')
            {
                _html = '';
            }

            _this.after(`${_html}<br/>`);
            _this.remove()
        })
        ;
}
*/
//# sourceMappingURL=index.js.map