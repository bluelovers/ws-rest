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
exports.LHScanClient = void 0;
const decorators_1 = require("restful-decorator/lib/decorators");
const lazy_url_1 = __importDefault(require("lazy-url"));
const types_1 = require("./types");
const parse_1 = require("./site/parse");
const jsdom_1 = require("restful-decorator-plugin-jsdom/lib/decorators/jsdom");
const lib_1 = __importDefault(require("restful-decorator-plugin-jsdom/lib"));
const array_buffer_to_string_1 = require("@bluelovers/array-buffer-to-string");
const dot_values2_1 = require("dot-values2");
let LHScanClient = 
/**
 * @link https://lhscan.net/app/manga/controllers/search.single.php?q=%E9%AA%91%E5%A3%AB%E9%AD%94
 */
class LHScanClient extends lib_1.default {
    constructor(...argv) {
        let [defaults = {}] = argv;
        if (defaults.baseURL) {
            dot_values2_1.setValue(defaults, 'headers.Referer', defaults.baseURL);
        }
        argv[0] = defaults;
        super(...argv);
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
                    let id_key = parse_1.parseMangaKey(path);
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
    _manga(id_key) {
        const jsdom = this.$returnValue;
        const { $ } = jsdom;
        let manga_info = $('.manga-info');
        let _breadcrumb = $('.breadcrumb li[itemprop="itemListElement"]:eq(-1)');
        let _a = _breadcrumb.find('a[itemscope][itemid]');
        let title;
        let cover;
        if (/manga-.+-raw\.html$/.test(_a.attr('itemid'))) {
            title = _a.find('[itemprop="name"]').text().trim();
            cover = _a.find('[itemprop="image"]').prop('src');
        }
        if (!(title === null || title === void 0 ? void 0 : title.length)) {
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
            let body = _this.clone().remove('b:eq(0)');
            if (/Other names/i.test(label)) {
                other_names = body.text().trim()
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
            let { id_key, chapter_id } = parse_1.parseReadUrl(href);
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
            .then(response => array_buffer_to_string_1.arrayBufferToBuffer(response.data, 'binary', 'binary'));
    }
    mangaList(query) {
        return this._mangaList(query);
    }
    _mangaList(query) {
        const jsdom = this.$returnValue;
        const { $ } = jsdom;
        let list = [];
        $('.container .row.top > .row-list')
            .each((idx, elem) => {
            let _this = $(elem);
            let _a = _this.find('.media-heading a');
            let id = _a.attr('onmouseenter').match(/show\((\d+)\)/)[1];
            let id_key = parse_1.parseMangaKey(_a.prop('href'));
            let title = _a.text();
            let genre = [];
            _this.find('a[href*="manga-list-genre-"]')
                .each((idx, elem) => {
                let _this = $(elem);
                genre.push(_this.text());
            });
            _a = _this.find('a[href^="read-"]');
            let last_chapter = parse_1.parseReadUrl(_a.prop('href'));
            list.push({
                id,
                id_key,
                title,
                last_chapter,
            });
        });
        let page = $('.pagination-wrap .pagination .active').text();
        let page_max = $('.pagination-wrap .pagination li:eq(-2)').text();
        return {
            page,
            page_max,
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
__decorate([
    decorators_1.GET('app/manga/controllers/search.single.php'),
    decorators_1.methodBuilder(),
    __param(0, decorators_1.ParamData('q')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Object)
], LHScanClient.prototype, "_searchSingle", null);
__decorate([
    decorators_1.GET('manga-{id_key}.html')
    // @ts-ignore
    ,
    jsdom_1.ReturnValueToJSDOM(),
    decorators_1.methodBuilder(),
    __param(0, decorators_1.ParamPath('id_key')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], LHScanClient.prototype, "_manga", null);
__decorate([
    decorators_1.GET('read-{id_key}-chapter-{chapter_id}.html'),
    jsdom_1.ReturnValueToJSDOM(),
    decorators_1.methodBuilder(),
    __param(0, decorators_1.ParamMapAuto()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], LHScanClient.prototype, "read", null);
__decorate([
    decorators_1.GET('manga-list.html'),
    jsdom_1.ReturnValueToJSDOM(),
    decorators_1.methodBuilder(),
    __param(0, decorators_1.ParamMapAuto({
        listType: 'pagination',
        sort: 'last_update',
    })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], LHScanClient.prototype, "mangaList", null);
LHScanClient = __decorate([
    decorators_1.BaseUrl("https://loveheaven.net" /* LOVEHEAVEN */),
    decorators_1.Headers({
        'Accept': 'application/json',
        Referer: "https://loveheaven.net" /* LOVEHEAVEN */,
    }),
    decorators_1.RequestConfigs({
        responseType: 'json',
    }),
    decorators_1.CacheRequest({
        cache: {
            maxAge: 15 * 60 * 1000,
            readHeaders: false,
        },
    })
    /**
     * @link https://lhscan.net/app/manga/controllers/search.single.php?q=%E9%AA%91%E5%A3%AB%E9%AD%94
     */
    ,
    __metadata("design:paramtypes", [Object])
], LHScanClient);
exports.LHScanClient = LHScanClient;
exports.default = LHScanClient;
//# sourceMappingURL=index.js.map