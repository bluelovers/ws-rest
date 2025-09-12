"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Wenku8Client = void 0;
const tslib_1 = require("tslib");
const lib_1 = require("restful-decorator-plugin-jsdom/lib");
const decorators_1 = require("restful-decorator/lib/decorators");
const bluebird_1 = tslib_1.__importDefault(require("bluebird"));
const util_1 = require("./util");
const zero_width_1 = require("zero-width");
const gbk_1 = require("restful-decorator-plugin-jsdom/lib/util/gbk");
const moment_1 = tslib_1.__importDefault(require("moment"));
const urlEncodeGBK_1 = require("./util/urlEncodeGBK");
const subobject_1 = require("restful-decorator/lib/helper/subobject");
const uniqBy_1 = tslib_1.__importDefault(require("lodash/uniqBy"));
const html_1 = require("restful-decorator-plugin-jsdom/lib/html");
/**
 * https://www.wenku8.net/index.php
 */
let Wenku8Client = class Wenku8Client extends lib_1.AbstractHttpClientWithJSDom {
    _constructor() {
        this._setCookieSync({
            key: 'jieqiUserCharset',
            value: 'gbk',
            expires: 3600 * 24,
        });
    }
    loginByForm(inputData) {
        let jsdom = this._responseDataToJSDOM(this.$response.data, this.$response);
        return jsdom.document.title.includes('成功');
    }
    _handleArticleList(_this, retDataInit) {
        let jsdom = _this._responseDataToJSDOM(_this.$returnValue, this.$response);
        let $ = jsdom.$;
        let tds = $('#centerm #content .grid > tbody > tr > td > div');
        tds.find('script').remove();
        tds.filter(':empty').remove();
        tds = $('#centerm #content .grid > tbody > tr > td > div');
        //console.debug(jsdom.serialize());
        // @ts-ignore
        let pageEnd = $('#pagelink .last').text() | 0;
        let ret = {
            ...retDataInit,
            end: pageEnd,
            last_update_time: 0,
            data: []
        };
        let lastUpdateTime = 0;
        tds
            .each((i, elem) => {
            let _this = $(elem);
            let _a = _this
                .find('a[tiptitle]:has(> img), a[title]:has(> img)')
                .eq(0);
            let cover = _a.find('> img:eq(0)')
                .prop('src');
            let title = _a.prop('tiptitle') || _a.prop('title');
            title = (0, util_1.trimUnsafe)(title);
            let _a2 = _this
                .find('a[href*="/novel/"]:eq(0)');
            let cid;
            let nid;
            let last_update_chapter_name;
            if (_a2.length) {
                let _m = _a2.prop('href').match(/\/novel\/(\d+)\/(\d+)\//);
                if (_m) {
                    cid = _m[1];
                    nid = _m[2];
                }
                last_update_chapter_name = (0, util_1.trimUnsafe)(_a2.text());
            }
            else {
                _a2 = _this
                    .find('a[href*="/book/"]:eq(0)');
                let _m = _a2.prop('href').match(/book\/(\d+)\.htm/);
                if (_m) {
                    nid = _m[1];
                }
            }
            let _text = _this.text();
            let _m = _text.match(/(\d+\-\d+\-\d+)/);
            let last_update_time;
            if (_m) {
                last_update_time = (0, moment_1.default)(_m[1]).unix();
                lastUpdateTime = Math.max(lastUpdateTime, last_update_time);
            }
            let authors;
            if (_m = _text.match(/作者\:([^\n]+)\/分/)) {
                authors = (0, util_1.trimUnsafe)(_m[1]);
            }
            let status;
            if (_m = _text.match(/\/(?:状|狀)(?:态|態):([^\n\s]+)/)) {
                status = (0, util_1.trimUnsafe)(_m[1]);
            }
            let publisher;
            if (_m = _text.match(/分(?:类|類)\:([^\n]+)\/(?:状|狀)/)) {
                publisher = (0, util_1.trimUnsafe)(_m[1]);
            }
            ret.data.push({
                id: nid,
                cid,
                name: title,
                authors,
                publisher,
                status,
                cover,
                last_update_time,
                last_update_chapter_name,
            });
        });
        ret.last_update_time = lastUpdateTime;
        //console.dir(ret);
        return ret;
    }
    /**
     * 轻小说最近更新
     */
    articleToplist(page, sortType) {
        return this._handleArticleList(this, {
            page,
            end: undefined,
            last_update_time: 0,
            sort: sortType,
            data: []
        });
    }
    articleToplistAll(from, to = Infinity, options, ...args) {
        return this._handleArticleTopListAll(this.articleToplist, args, from, to, options);
    }
    _handleArticleTopListAll(method, args, from = 0, pageTo = Infinity, { throwError, delay, } = {}) {
        delay |= 0;
        return method
            .call(this, from, ...args)
            .then(async function (dataReturn) {
            const from = dataReturn.page;
            let to = from;
            let { last_update_time, data } = dataReturn;
            throwError = !!throwError;
            while (to < pageTo) {
                delay && await bluebird_1.default.delay(delay);
                let retP = method
                    .call(this, to + 1, ...args);
                let ret;
                if (throwError) {
                    ret = await retP;
                }
                else {
                    ret = await retP.catch(e => null);
                }
                if (ret != null && ret.page != from && ret.page != to) {
                    to = ret.page;
                    last_update_time = Math.max(last_update_time, ret.last_update_time);
                    data.push(...ret.data);
                    continue;
                }
                break;
            }
            return {
                ...(dataReturn),
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
    articleList(page, fullflag) {
        return this._handleArticleList(this, {
            page,
            end: undefined,
            last_update_time: 0,
            data: []
        });
    }
    articleListAll(from, to = Infinity, options, ...args) {
        return this._handleArticleTopListAll(this.articleList, args, from, to, options);
    }
    isLogin() {
        let jsdom = this._responseDataToJSDOM(this.$returnValue, this.$response);
        return !!jsdom
            .$('a[href="https://www.wenku8.net/logout.php"], a[href*="/logout.php"]')
            .length;
    }
    //@GET('book/{novel_id}.htm')
    bookInfo(novel_id) {
        let jsdom = this._responseDataToJSDOM(this.$returnValue, this.$response);
        const $ = jsdom.$;
        let data = ({
            id: novel_id.toString(),
            "cid": undefined,
            "name": undefined,
            "authors": undefined,
            "publisher": undefined,
            "status": undefined,
            "cover": undefined,
            "last_update_time": 0,
            "last_update_chapter_name": undefined,
            "tags": undefined,
            desc: undefined,
        });
        data.name = (0, util_1.trimUnsafe)($('#content table:eq(0) table:eq(0) td > span > b').text());
        $('#content table:eq(0) tr:not(table) td')
            .each(function (i, elem) {
            let _this = $(this);
            let _text = (0, util_1.trimUnsafe)(_this.text());
            let _m = _text.match(/分(?:类|類)：([^\n]+)/);
            if (_m) {
                data.publisher = (0, util_1.trimUnsafe)(_m[1]);
            }
            else if (_m = _text.match(/作者：([^\n]+)/)) {
                data.authors = (0, util_1.trimUnsafe)(_m[1]);
            }
            else if (_m = _text.match(/(?:状|狀)(?:态|態)：([^\n]+)/)) {
                data.status = (0, util_1.trimUnsafe)(_m[1]);
            }
            else if (_m = _text.match(/更新：(\d+\-\d+\-\d+)/)) {
                let last_update_time = (0, moment_1.default)(_m[1]).unix();
                data.last_update_time = last_update_time;
            }
        });
        let _content = $('#content > div > table:eq(1)');
        try {
            (0, html_1.tryMinifyHTML)(_content.html(), (html) => {
                _content.html(html);
            });
        }
        catch (e) {
        }
        let _cr = _content.find('.hottext:eq(0)');
        if (_cr.length && /因版权问题|因版權問題/.test(_cr.text() || '')) {
            console.log(_cr.text());
            data.copyright_remove = true;
        }
        data.cover = _content.find('img:eq(0)').prop('src');
        data.desc = (0, util_1.trimUnsafe)(_content.find('.hottext + br + span:eq(-1)').text() || '');
        let _a2 = _content
            .find('a[href*="/novel/"]:eq(0)');
        if (_a2.length) {
            let _m = _a2.prop('href')
                .match(/\/novel\/(\d+)\/(\d+)\//);
            if (_m) {
                data.cid = _m[1];
            }
            data.last_update_chapter_name = (0, util_1.trimUnsafe)(_a2.text());
        }
        if (data.cid == null) {
            _a2 = $('#content > div > div > div a[href*="/novel/"]:eq(0)');
            if (_a2.length) {
                let _m = _a2.prop('href')
                    .match(/\/novel\/(\d+)\/(\d+)\//);
                if (_m) {
                    data.cid = _m[1];
                }
            }
            if (data.cid == null) {
                throw new Error(`data.cid == null`);
            }
        }
        let _tags = (0, util_1.trimUnsafe)(_content.find('.hottext:eq(0)').text() || '');
        if (/^作品Tags：/.test(_tags)) {
            data.tags = _tags
                .replace(/^作品Tags：\s*/, '')
                .split(/\s+/)
                .filter(Boolean);
            if (!data.tags.length) {
                data.tags = void 0;
            }
        }
        return data;
    }
    bookChapters(novel_id, cid) {
        const jsdom = this._responseDataToJSDOM(this.$returnValue, this.$response);
        const $ = jsdom.$;
        novel_id = novel_id.toString();
        cid = cid.toString();
        let name = (0, util_1.trimUnsafe)($('body > #title').text());
        let authors = (0, util_1.trimUnsafe)($('#info').text().replace(/^[^：]+：/g, ''));
        let data = {
            id: novel_id,
            cid,
            name,
            authors,
            chapters: [],
        };
        let volume_order = -1;
        let chapter_order = 0;
        let body = $('.css').find('td.vcss, td.ccss');
        body
            .each((i, elem) => {
            let _this = $(elem);
            if (_this.is('.vcss')) {
                volume_order++;
                let volume_name = (0, util_1.trimUnsafe)(_this.text());
                data.chapters[volume_order] = {
                    volume_name,
                    volume_order,
                    chapters: [],
                };
                chapter_order = 0;
            }
            else {
                let _a = _this.find('a:eq(0)');
                if (_a.length) {
                    let _m = _a
                        .prop('href')
                        .match(/(?:novel\/(\d+)\/(\d+)\/)?(\d+)\.htm/);
                    data.chapters[volume_order]
                        .chapters
                        .push({
                        novel_id: novel_id,
                        cid: cid,
                        chapter_id: _m[3],
                        chapter_name: (0, util_1.trimUnsafe)(_a.text()),
                        chapter_order,
                    });
                }
                chapter_order++;
            }
        });
        return data;
    }
    bookInfoWithChapters(novel_id) {
        return this
            .bookInfo(novel_id)
            .then(async function (data) {
            let { chapters } = await this.bookChapters(data.id, data.cid);
            return {
                ...data,
                chapters,
            };
        });
    }
    cookiesRemoveTrack() {
        let _jar = this._jar();
        _jar.deleteCookieSync('jieqiVisitId');
        return this;
    }
    _encodeURIComponent(text) {
        return (0, urlEncodeGBK_1.encodeURIComponent)(text);
    }
    //@POST('so.php')
    search(searchData) {
        let searchkey = searchData.searchkey;
        let url = `modules/article/search.php?searchtype=${searchData.searchtype}&searchkey=${this._encodeURIComponent(searchkey)}&page=${searchData.page}`;
        let $requestConfig = {
            ...this.$requestConfig,
            url,
        };
        return bluebird_1.default
            .resolve(this.$http($requestConfig))
            .then(v => {
            return this._handleArticleList((0, subobject_1.subobject)({
                $requestConfig,
                $returnValue: v.data,
                $response: v.request,
            }, this), {
                searchtype: searchData.searchtype,
                searchkey,
                page: searchData.page,
                end: undefined,
                last_update_time: 0,
                data: []
            });
        });
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
        let jsdom = this._responseDataToJSDOM(this.$returnValue, this.$response);
        const $ = jsdom.$;
        let $content = $('#content');
        $content.find('#contentdp').remove();
        $content.find('#contentdp').remove();
        $content.find('#contentdp').remove();
        $content.html((0, html_1.tryMinifyHTML)($content.html()).replace(/^(&nbsp;){4}/gm, ''));
        let imgs = [];
        const { cb } = options;
        let html;
        if (options.rawHtml) {
            html = $content.html();
        }
        $content
            .find('img[src]')
            .each((i, elem) => {
            let $elem = $(elem);
            let src = $elem.prop('src').trim();
            imgs.push(src);
            if (cb) {
                cb({
                    i,
                    $elem,
                    $content,
                    src,
                    imgs,
                });
            }
        });
        let text = (0, zero_width_1.removeZeroWidth)($content.text());
        return {
            novel_id: argv.novel_id.toString(),
            cid: argv.cid.toString(),
            chapter_id: argv.chapter_id.toString(),
            imgs,
            text,
            html,
        };
    }
    _iconvDecode(buf) {
        return (0, gbk_1.iconvDecode)(buf);
    }
    /**
     * @todo implement tag search
     * @see https://www.wenku8.net/modules/article/tags.php
     */
    tags() {
        throw new Error('Not implemented');
    }
};
exports.Wenku8Client = Wenku8Client;
tslib_1.__decorate([
    (0, decorators_1.POST)('login.php?do=submit&action=login'),
    decorators_1.FormUrlencoded,
    (0, decorators_1.CacheRequest)({
        cache: {
            maxAge: 0,
        },
    }),
    (0, decorators_1.methodBuilder)({
        disableFallbackReturnValue: true,
    }),
    tslib_1.__param(0, (0, decorators_1.ParamMapAuto)({
        action: 'login',
        usecookie: 315360000,
        submit: true,
    })),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Object)
], Wenku8Client.prototype, "loginByForm", null);
tslib_1.__decorate([
    (0, decorators_1.GET)('modules/article/toplist.php'),
    (0, decorators_1.methodBuilder)(),
    tslib_1.__param(0, (0, decorators_1.ParamQuery)('page', 1)),
    tslib_1.__param(1, (0, decorators_1.ParamQuery)('sort', 'lastupdate')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Number, String]),
    tslib_1.__metadata("design:returntype", Object)
], Wenku8Client.prototype, "articleToplist", null);
tslib_1.__decorate([
    (0, decorators_1.GET)('modules/article/articlelist.php'),
    (0, decorators_1.methodBuilder)(),
    tslib_1.__param(0, (0, decorators_1.ParamQuery)('page', 1)),
    tslib_1.__param(1, (0, decorators_1.ParamQuery)('fullflag')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Number, Number]),
    tslib_1.__metadata("design:returntype", Object)
], Wenku8Client.prototype, "articleList", null);
tslib_1.__decorate([
    (0, decorators_1.GET)('index.php'),
    (0, decorators_1.CacheRequest)({
        cache: {
            maxAge: 0,
        },
    }),
    (0, decorators_1.methodBuilder)(),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", Object)
], Wenku8Client.prototype, "isLogin", null);
tslib_1.__decorate([
    (0, decorators_1.GET)('modules/article/articleinfo.php?id={novel_id}&charset=gbk'),
    (0, decorators_1.methodBuilder)(),
    tslib_1.__param(0, (0, decorators_1.ParamPath)('novel_id')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Object)
], Wenku8Client.prototype, "bookInfo", null);
tslib_1.__decorate([
    (0, decorators_1.GET)('novel/{cid}/{novel_id}/index.htm'),
    (0, decorators_1.methodBuilder)(),
    tslib_1.__param(0, (0, decorators_1.ParamPath)('novel_id')),
    tslib_1.__param(1, (0, decorators_1.ParamPath)('cid')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object, Object]),
    tslib_1.__metadata("design:returntype", Object)
], Wenku8Client.prototype, "bookChapters", null);
tslib_1.__decorate([
    tslib_1.__param(0, (0, decorators_1.ParamPath)('novel_id')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", void 0)
], Wenku8Client.prototype, "bookInfoWithChapters", null);
tslib_1.__decorate([
    (0, decorators_1.GET)('modules/article/search.php?searchtype={searchtype}&searchkey={searchkey}&page={page}'),
    (0, decorators_1.CacheRequest)({
        cache: {
            maxAge: 0,
        },
    }),
    (0, decorators_1.methodBuilder)({
        autoRequest: false,
    }),
    tslib_1.__param(0, (0, decorators_1.ParamMapAuto)({
        searchtype: 'articlename',
        page: 1,
    })),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Object)
], Wenku8Client.prototype, "search", null);
tslib_1.__decorate([
    (0, decorators_1.GET)('https://www.wenku8.net/novel/{cid}/{novel_id}/{chapter_id}.htm'),
    (0, decorators_1.methodBuilder)(),
    tslib_1.__param(0, (0, decorators_1.ParamMapAuto)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object, Object]),
    tslib_1.__metadata("design:returntype", Object)
], Wenku8Client.prototype, "getChapter", null);
tslib_1.__decorate([
    (0, decorators_1.GET)('/modules/article/tags.php'),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", void 0)
], Wenku8Client.prototype, "tags", null);
exports.Wenku8Client = Wenku8Client = tslib_1.__decorate([
    (0, decorators_1.BaseUrl)('https://www.wenku8.net'),
    (0, decorators_1.Headers)({
        Referer: 'https://www.wenku8.net/index.php',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36',
    }),
    (0, decorators_1.CacheRequest)({
        cache: {
            maxAge: 6 * 60 * 60 * 1000,
            exclude: {
                query: false,
            }
        },
    })
], Wenku8Client);
exports.default = Wenku8Client;
//# sourceMappingURL=index.js.map