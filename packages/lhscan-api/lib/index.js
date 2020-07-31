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
    manga(id_key) {
        const jsdom = this.$returnValue;
        const { $ } = jsdom;
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
            chapters,
        };
        return ret;
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
    decorators_1.GET('manga-{id_key}.html'),
    jsdom_1.ReturnValueToJSDOM(),
    decorators_1.methodBuilder(),
    __param(0, decorators_1.ParamPath('id_key')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], LHScanClient.prototype, "manga", null);
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