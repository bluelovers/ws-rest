"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LHScanClient = void 0;
const tslib_1 = require("tslib");
const decorators_1 = require("restful-decorator/lib/decorators");
const lazy_url_1 = tslib_1.__importDefault(require("lazy-url"));
const types_1 = require("./types");
const parse_1 = require("./site/parse");
const jsdom_1 = require("restful-decorator-plugin-jsdom/lib/decorators/jsdom");
const lib_1 = tslib_1.__importDefault(require("restful-decorator-plugin-jsdom/lib"));
const array_buffer_to_string_1 = require("@bluelovers/array-buffer-to-string");
const dot_values2_1 = require("dot-values2");
const moment_1 = tslib_1.__importDefault(require("moment"));
let LHScanClient = class LHScanClient extends lib_1.default {
    constructor(...argv) {
        let [defaults = {}] = argv;
        if (defaults.baseURL) {
            (0, dot_values2_1.setValue)(defaults, 'headers.Referer', defaults.baseURL);
        }
        argv[0] = defaults;
        super(...argv);
    }
    /**
     * @FIXME _iconvDecode 會錯誤解碼 導致無法分析日文
     */
    _iconvDecode(buf) {
        return buf.toString();
    }
    _searchSingle(keyword) {
        return null;
    }
    createURL(url) {
        return new lazy_url_1.default(url, this.$baseURL);
    }
    searchSingle(keyword) {
        return this._searchSingle(keyword)
            .then(ret => {
            return ret.map(topRow => {
                let data = topRow.data.map(data => {
                    let href = data.onclick.replace(/^window.location=['"](.+?)['"]/, '$1');
                    href = this.createURL(href).toString();
                    let path = this.createURL(href).pathname;
                    let id_key = (0, parse_1.parseMangaKey)(path);
                    return {
                        ...data,
                        href,
                        path,
                        id_key,
                    };
                });
                return {
                    ...topRow,
                    data,
                };
            });
        });
    }
    mangaMetaPop(id) {
        const jsdom = this.$returnValue;
        const { $ } = jsdom;
        //console.dir(this.$response)
        let title = $('.pop_title').text();
        let cover = $('.img:eq(0)').prop('src');
        let other_names;
        let authors = [];
        let tags = [];
        let last_update;
        //console.dir(jsdom.serialize())
        //console.dir($('p').length)
        $('p').each((index, elem) => {
            let _this = $(elem);
            let label = _this.find('strong:eq(0)').text().trim();
            let body = _this.clone();
            body.remove('strong:eq(0)');
            if (/Other Name/i.test(label)) {
                let text = body.text().trim()
                    .replace(/^\s+|\s+$/g, '');
                if (text.length && text !== 'Updating') {
                    other_names = text;
                }
            }
            else if (/Author/i.test(label)) {
                let text = body.text().trim()
                    .replace(/^\s+|\s+$/g, '');
                if (text.length && text !== 'Updating') {
                    authors = [text];
                }
            }
            else if (/Genres/i.test(label)) {
                let text = body.text().trim()
                    .replace(/^\s+|\s+$/g, '')
                    .split(',');
                text.forEach(v => {
                    var _b;
                    v = (_b = v === null || v === void 0 ? void 0 : v.trim) === null || _b === void 0 ? void 0 : _b.call(v);
                    if (v === null || v === void 0 ? void 0 : v.length) {
                        tags.push(v);
                    }
                });
            }
            else if (/Last Update/i.test(label)) {
                let text = body.text().trim()
                    .replace(/^\s+|\s+$/g, '')
                    .replace(/^Last\s*Update:\s*/i, '');
                if (text.length && text !== 'Updating') {
                    let timestamp = (0, moment_1.default)(text).valueOf();
                    last_update = timestamp;
                }
            }
        });
        id = id.toString();
        return {
            id,
            title,
            other_names,
            authors,
            tags,
            last_update,
        };
    }
    _manga(id_key) {
        const jsdom = this.$returnValue;
        const { $ } = jsdom;
        let manga_info = $('.manga-info');
        let _breadcrumb = $('.breadcrumb li[itemprop="itemListElement"]:eq(-1)');
        let _a = _breadcrumb.find('a[itemscope][itemid]');
        let title;
        let cover;
        if (/manga-.+(?:-raw)?\.html$/.test(_a.attr('itemid'))) {
            title = _a.find('[itemprop="name"]').text().trim();
            cover = _a.find('[itemprop="image"]').prop('src');
        }
        if (!(title === null || title === void 0 ? void 0 : title.length) || !$('.manga-info').length) {
            throw new RangeError(`manga '${id_key}' not exists`);
        }
        let other_names;
        let authors = [];
        let tags = [];
        let magazine = [];
        manga_info.find('> li')
            .each((index, element) => {
            let _this = $(element);
            let label = _this.find('b:eq(0)').text().trim();
            let body = _this.clone();
            body.remove('b:eq(0)');
            if (/Other names/i.test(label)) {
                other_names = body.text().trim()
                    .replace(/^\s*Other\s*names:\s*/i, '')
                    .replace(/^\s*:\s*/, '');
            }
            else if (/Author/i.test(label)) {
                body.find('small a')
                    .each((i, elem) => {
                    var _b, _c, _d;
                    let link = $(elem).attr('href');
                    let name = (_d = (_c = (_b = link.match(/manga-author-(.+)\.html/)) === null || _b === void 0 ? void 0 : _b[1]) === null || _c === void 0 ? void 0 : _c.trim) === null || _d === void 0 ? void 0 : _d.call(_c);
                    if ((name === null || name === void 0 ? void 0 : name.length) > 0) {
                        authors.push(name);
                    }
                });
            }
            else if (/GENRE/i.test(label)) {
                body.find('small a')
                    .each((i, elem) => {
                    var _b, _c, _d;
                    let link = $(elem).attr('href');
                    let name = (_d = (_c = (_b = link.match(/manga-list-genre-(.+)\.html/)) === null || _b === void 0 ? void 0 : _b[1]) === null || _c === void 0 ? void 0 : _c.trim) === null || _d === void 0 ? void 0 : _d.call(_c);
                    if ((name === null || name === void 0 ? void 0 : name.length) > 0) {
                        tags.push(name);
                    }
                });
            }
            else if (/Magazine/i.test(label)) {
                body.find('small a')
                    .each((i, elem) => {
                    let name = $(elem).text().trim();
                    if ((name === null || name === void 0 ? void 0 : name.length) > 0) {
                        magazine.push(name);
                    }
                });
            }
        });
        const chapters = [];
        $('#tab-chapper a.chapter')
            .each((idx, elem) => {
            let _this = $(elem);
            let href = _this.prop('href');
            let { id_key, chapter_id } = (0, parse_1.parseReadUrl)(href);
            chapters.push({
                id_key,
                chapter_id,
            });
        });
        const ret = {
            id_key,
            title,
            other_names,
            cover,
            authors,
            tags,
            magazine,
            last_chapter: chapters[0],
            chapters,
        };
        return ret;
    }
    manga(id_key) {
        id_key = id_key
            .replace(/\.html$/, '');
        return this._manga(id_key)
            .catch(RangeError, e => {
            let id_key_new = id_key.replace(/^manga-/, '');
            if (id_key_new !== id_key) {
                return this._manga(id_key_new);
            }
            return Promise.reject(e);
        });
    }
    read(opts) {
        const jsdom = this.$returnValue;
        const { $ } = jsdom;
        const images = [];
        $('.chapter-content img.chapter-img')
            .each((idx, elem) => {
            let _this = $(elem);
            let src = _this.attr('data-src') || _this.prop('src');
            src = src.replace(/\s+$/g, '');
            images.push(src);
        });
        return {
            id_key: opts.id_key,
            chapter_id: opts.chapter_id.toString(),
            images,
        };
    }
    fetchBuffer(url) {
        return this.$http.get(url, {
            responseType: 'arraybuffer',
            cache: {
                maxAge: 0,
                ignoreCache: true,
                // @ts-ignore
                excludeFromCache: true,
            },
        })
            .then(response => (0, array_buffer_to_string_1.arrayBufferToBuffer)(response.data, 'binary', 'binary'));
    }
    mangaList(query) {
        return this._mangaList(query);
    }
    _mangaList(query) {
        const jsdom = this.$returnValue;
        const { $ } = jsdom;
        let page = $('.pagination-wrap .pagination .active').text();
        let page_max = $('.pagination-wrap .pagination li:eq(-2)').text();
        let list = [];
        $('.container .row.top > .row-list')
            .each((idx, elem) => {
            let _this = $(elem);
            let _a = _this.find('.media-heading a');
            let id = _a.attr('onmouseenter').match(/show\((\d+)\)/)[1];
            let id_key = (0, parse_1.parseMangaKey)(_a.prop('href'));
            if (!(id_key === null || id_key === void 0 ? void 0 : id_key.length)) {
                return;
            }
            let title = _a.text();
            let genre = [];
            _this.find('a[href*="manga-list-genre-"]')
                .each((idx, elem) => {
                let _this = $(elem);
                genre.push(_this.text());
            });
            _a = _this.find('a[href^="read-"]');
            let last_chapter;
            try {
                last_chapter = (0, parse_1.parseReadUrl)(_a.prop('href'));
            }
            catch (e) { }
            list.push({
                id,
                id_key,
                title,
                last_chapter,
            });
        });
        return {
            page: Number.parseInt(page),
            page_max: Number.parseInt(page_max),
            query,
            list,
        };
    }
    /*
    @GET('manga-author-{author}.html')
    // @ts-ignore
    @ReturnValueToJSDOM()
    @methodBuilder()
     */
    author(author, query) {
        return this.mangaList({
            ...query,
            author,
        });
    }
    /*
    @GET('manga-list-genre-{tag}.html')
    // @ts-ignore
    @ReturnValueToJSDOM()
    @methodBuilder()
     */
    mangaListByGenre(tag, query) {
        if (Array.isArray(tag)) {
            tag = tag
                .filter(v => v === null || v === void 0 ? void 0 : v.length)
                .join(',');
        }
        return this.mangaList({
            ...query,
            genre: tag,
        });
    }
    /*
    @GET('manga-on-going.html')
    // @ts-ignore
    @ReturnValueToJSDOM()
    @methodBuilder()
     */
    mangaListByStatusOnGoing(query) {
        return this.mangaList({
            ...query,
            m_status: types_1.EnumMangaListStatus.OnGoing,
        });
    }
    mangaListByGroup(group, query) {
        return this.mangaList({
            ...query,
            group,
        });
    }
};
exports.LHScanClient = LHScanClient;
tslib_1.__decorate([
    (0, decorators_1.GET)('app/manga/controllers/search.single.php'),
    (0, decorators_1.methodBuilder)(),
    tslib_1.__param(0, (0, decorators_1.ParamData)('q')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Object)
], LHScanClient.prototype, "_searchSingle", null);
tslib_1.__decorate([
    (0, decorators_1.GET)('app/manga/controllers/cont.pop.php?action=pop&id={id}'),
    (0, jsdom_1.ReturnValueToJSDOM)(),
    (0, decorators_1.methodBuilder)(),
    tslib_1.__param(0, (0, decorators_1.ParamPath)('id')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", void 0)
], LHScanClient.prototype, "mangaMetaPop", null);
tslib_1.__decorate([
    (0, decorators_1.GET)('manga-{id_key}.html')
    // @ts-ignore
    ,
    (0, jsdom_1.ReturnValueToJSDOM)(),
    (0, decorators_1.methodBuilder)(),
    tslib_1.__param(0, (0, decorators_1.ParamPath)('id_key')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", void 0)
], LHScanClient.prototype, "_manga", null);
tslib_1.__decorate([
    (0, decorators_1.GET)('read-{id_key}-chapter-{chapter_id}.html'),
    (0, jsdom_1.ReturnValueToJSDOM)(),
    (0, decorators_1.methodBuilder)(),
    tslib_1.__param(0, (0, decorators_1.ParamMapAuto)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", void 0)
], LHScanClient.prototype, "read", null);
tslib_1.__decorate([
    (0, decorators_1.GET)('manga-list.html'),
    (0, jsdom_1.ReturnValueToJSDOM)(),
    (0, decorators_1.methodBuilder)(),
    tslib_1.__param(0, (0, decorators_1.ParamMapAuto)({
        listType: 'pagination',
        sort: 'last_update',
    })),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", void 0)
], LHScanClient.prototype, "mangaList", null);
exports.LHScanClient = LHScanClient = tslib_1.__decorate([
    (0, decorators_1.BaseUrl)("https://loveheaven.net" /* EnumMirrorSites.LOVEHEAVEN */),
    (0, decorators_1.Headers)({
        'Accept': 'application/json',
        Referer: "https://loveheaven.net" /* EnumMirrorSites.LOVEHEAVEN */,
    }),
    (0, decorators_1.RequestConfigs)({
        responseType: 'json',
    }),
    (0, decorators_1.CacheRequest)({
        cache: {
            maxAge: 15 * 60 * 1000,
            readHeaders: false,
        },
    })
    /**
     * @link https://lhscan.net/app/manga/controllers/search.single.php?q=%E9%AA%91%E5%A3%AB%E9%AD%94
     */
    ,
    tslib_1.__metadata("design:paramtypes", [Object])
], LHScanClient);
exports.default = LHScanClient;
//# sourceMappingURL=index.js.map