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
exports.DmzjClient = void 0;
const lib_1 = require("restful-decorator/lib");
const decorators_1 = require("restful-decorator/lib/decorators");
const cookies_1 = require("restful-decorator/lib/decorators/config/cookies");
const bluebird_1 = __importDefault(require("bluebird"));
const util_1 = require("./util");
const array_hyper_unique_1 = require("array-hyper-unique");
const debug_1 = __importDefault(require("restful-decorator/lib/util/debug"));
const symbol_1 = require("restful-decorator/lib/helper/symbol");
const subobject_1 = __importDefault(require("restful-decorator/lib/helper/subobject"));
/**
 * https://gist.github.com/bluelovers/5e9bfeecdbff431c62d5b50e7bdc3e48
 * https://github.com/guuguo/flutter_dmzj/blob/master/lib/api.dart
 * https://github.com/tkkcc/flutter_dmzj/blob/269cb0d642c710626fe7d755f0b27b12ab477cc6/lib/util/api.dart
 */
let DmzjClient = class DmzjClient extends lib_1.AbstractHttpClient {
    constructor(defaults) {
        super(defaults);
        //consoleDebug.debug(`constructor`);
        //consoleDebug.dir(this.$http.defaults);
        //console.dir(this.$http.defaults.jar);
        //process.exit();
    }
    _init(defaults) {
        defaults = super._init(defaults);
        //consoleDebug.debug(`_init`);
        //consoleDebug.dir(defaults);
        return defaults;
    }
    /**
     * 使用帳號密碼來登入
     */
    loginConfirm(nickname, passwd) {
        let response = this.$returnValue;
        if (!response.result || !response.data) {
            throw new Error(`${response.data}`);
        }
        this.$sharedPreferences.set('user_info', response.data);
        return;
    }
    /**
     * 以 cookies 來登入
     */
    loginByCookies(cookies_data) {
        const jar = cookies_1.getCookieJar(this);
        jar.setData(cookies_data || {});
        //consoleDebug.dir(jar);
        return bluebird_1.default.resolve(this);
    }
    /**
     * @fixme
     */
    webSubscribe(data) {
        //consoleDebug.dir(this.$requestConfig);
        //consoleDebug.dir(this.$http.defaults.jar);
        //console.dir(this.$responseUrl);
        //console.dir(this.$requestConfig);
        //console.dir(this.$http.defaults);
        // @ts-ignore
        //return this.$http(this.$requestConfig);
        // @ts-ignore
        //		console.dir(this.$responseUrl);
        //const jar = getCookieJar(this);
        //consoleDebug.dir(jar);
        //console.dir(this.$returnValue.headers);
        return;
    }
    /**
     * 推荐列表
     */
    articleRecommendHeader() {
        //let data = arguments[0];
        return null;
    }
    /**
     * 文章分类
     */
    articleCategory() {
        //let data = arguments[0];
        return null;
    }
    /**
     * 文章列表
     */
    articleList(_tag_id, _page) {
        //let data = arguments[0];
        return null;
    }
    /**
     * 文章列表
     */
    articleShow(object_id) {
        //let data = arguments[0];
        return null;
    }
    /**
     * 推荐
     */
    novelRecommend() {
        return;
    }
    /**
     * 最近更新
     */
    _novelRecentUpdate(page, delay) {
        if (delay && !this.$response.request.fromCache) {
            // @ts-ignore
            return bluebird_1.default.delay(delay | 0)
                .thenReturn(this.$returnValue);
        }
        //let data = arguments[0];
        return null;
    }
    /**
     * 最近更新(非原始資料 而是 經過修正處理)
     */
    novelRecentUpdate(page, delay) {
        return this._novelRecentUpdate(page, delay)
            .then(data => {
            return data.map(util_1.fixDmzjNovelInfo);
        });
    }
    /**
     * 一次性取得全部小說列表(如果遇到網路錯誤 或者 其他意外狀況則會停止)
     */
    _novelRecentUpdateAll(from = 0, to = Infinity, { throwError, delay, } = {}) {
        let i = from;
        delay |= 0;
        return bluebird_1.default
            .resolve()
            .then(async () => {
            let list = [];
            let last = [];
            while (i < to) {
                let cur = await this.novelRecentUpdate(i, delay)
                    .catch(e => {
                    if (throwError) {
                        return Promise.reject(e);
                    }
                    debug_1.default.error(i, e.message);
                    return null;
                });
                let cur_ids;
                if (cur == null || !Array.isArray(cur)) {
                    if (i > 0) {
                        i -= 1;
                    }
                    cur && debug_1.default.error(i, cur);
                    break;
                }
                else if (!cur.length) {
                    debug_1.default.debug(i, `沒有內容 此頁次可能已超過範圍`);
                    if (i > 0) {
                        i -= 1;
                    }
                    break;
                }
                else {
                    cur_ids = cur.map((v) => v.id);
                    if (!cur_ids.some(id => id && !last.includes(id))) {
                        debug_1.default.debug(i, `沒有新內容 本次查詢資料可能與上次相同`, {
                            cur_ids,
                            last_ids: last,
                        });
                        break;
                    }
                }
                debug_1.default.debug(i, cur.length, cur_ids);
                list.push(...cur);
                last = cur_ids;
                i++;
            }
            return array_hyper_unique_1.array_unique(list);
        })
            .then(list => {
            let last_update_time = list.reduce((a, b) => {
                return Math.max(a, b.last_update_time | 0);
            }, 0);
            return {
                from,
                to,
                end: i,
                last_update_time,
                list,
            };
        });
    }
    /**
     * 一次性取得全部小說列表(如果遇到網路錯誤 或者 其他意外狀況則會停止)
     * (非原始資料 而是 經過修正處理)
     */
    novelRecentUpdateAll(from = 0, to = Infinity, options = {}) {
        return this._novelRecentUpdateAll(from, to, options)
            .then(data => {
            data.list = data.list.map(util_1.fixDmzjNovelInfo);
            return data;
        });
    }
    /**
     * 小说详情
     */
    _novelInfo(novel_id) {
        //let data = arguments[0];
        return null;
    }
    /**
     * 小说详情(非原始資料 而是 經過修正處理)
     */
    novelInfo(novel_id) {
        return this._novelInfo(novel_id).then(util_1.fixDmzjNovelInfo);
    }
    /**
     * 小说卷列表
     */
    novelChapter(novel_id) {
        //let data = arguments[0];
        return null;
    }
    /**
     * 取得小說資料的同時一起取得章節列表
     */
    _novelInfoWithChapters(novel_id) {
        let selfTop = subobject_1.default({}, this);
        let self = selfTop;
        return bluebird_1.default.props({
            info: this.novelInfo(novel_id),
            chapters: this.novelChapter(novel_id)
                .tap(function () {
                // @ts-ignore
                self = this;
            }),
        })
            .then(result => {
            const { info, chapters } = result;
            selfTop.$response = self.$response;
            return {
                ...info,
                chapters,
                [symbol_1.SymSelf]: self,
            };
        })
            .bind(self);
    }
    /**
     * 取得小說資料的同時一起取得章節列表(非原始資料 而是 經過修正處理)
     */
    novelInfoWithChapters(novel_id) {
        return this._novelInfoWithChapters(novel_id).then(util_1.fixDmzjNovelInfo);
    }
    /**
     * 小说章节正文
     * @example novelDownload(2661, 10099, 95922)
     */
    novelDownload(id, volume_id, chapter_id) {
        //let data = arguments[0];
        return null;
    }
    /**
     * 小说分类
     */
    novelCategory() {
        //let data = arguments[0];
        return null;
    }
    /**
     * 小说筛选条件
     */
    novelFilter() {
        //let data = arguments[0];
        return null;
    }
    /**
     * 小说列表
     *
     * @param {number} cat_id 分类id
     * @param {EnumDmzjAcgnStatusID} status_id 连载情况
     * @param {EnumDmzjAcgnOrderID} order_id 排序 0为人气从高到低，1为更新时间从近到远
     * @param {number} page 页数
     */
    novelList(cat_id, status_id, order_id, page) {
        //let data = arguments[0];
        return null;
    }
    searchShow(big_cat_id, keywords, page) {
        return;
    }
    /**
     * 漫画 推荐
     */
    comicRecommend() {
        //let data = arguments[0];
        return null;
    }
    /**
     * 漫画
     * @example comicDetail(47195)
     */
    comicDetail(comic_id) {
        //let data = arguments[0];
        return null;
    }
    /**
     * 漫画
     * @example comicContent(47195, 85760)
     */
    comicContent(comic_id, chapter_id) {
        //let data = arguments[0];
        return null;
    }
    deviceBuilding(data) {
        return;
    }
};
__decorate([
    decorators_1.POST('https://user.dmzj.com/loginV2/m_confirm'),
    decorators_1.methodBuilder(),
    decorators_1.FormUrlencoded,
    __param(0, decorators_1.ParamData('nickname')),
    __param(1, decorators_1.ParamData('passwd')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Object)
], DmzjClient.prototype, "loginConfirm", null);
__decorate([
    decorators_1.POST('https://i.dmzj.com/subscribe'),
    decorators_1.Headers({
        Referer: 'https://i.dmzj.com/subscribe',
    }),
    decorators_1.methodBuilder(),
    __param(0, decorators_1.ParamMapData({
        page: 1,
        type_id: 4 /* NOVEL */,
        letter_id: 0,
        read_id: 1,
    })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Object)
], DmzjClient.prototype, "webSubscribe", null);
__decorate([
    decorators_1.GET('article/recommend/header.json'),
    decorators_1.methodBuilder(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Object)
], DmzjClient.prototype, "articleRecommendHeader", null);
__decorate([
    decorators_1.GET('article/category.json'),
    decorators_1.methodBuilder(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Object)
], DmzjClient.prototype, "articleCategory", null);
__decorate([
    decorators_1.GET('article/list/v2/{tag_id}/2/{page}.json'),
    decorators_1.methodBuilder(),
    __param(0, decorators_1.ParamPath('tag_id')), __param(1, decorators_1.ParamPath('page', 0)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", Object)
], DmzjClient.prototype, "articleList", null);
__decorate([
    decorators_1.GET('article/show/v2/{object_id}.html'),
    decorators_1.methodBuilder(),
    __param(0, decorators_1.ParamPath('object_id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Object)
], DmzjClient.prototype, "articleShow", null);
__decorate([
    decorators_1.GET('novel/recommend.json'),
    decorators_1.methodBuilder(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Object)
], DmzjClient.prototype, "novelRecommend", null);
__decorate([
    decorators_1.GET('novel/recentUpdate/{page}.json'),
    decorators_1.methodBuilder(),
    __param(0, decorators_1.ParamPath('page', 0)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", Object)
], DmzjClient.prototype, "_novelRecentUpdate", null);
__decorate([
    decorators_1.GET('novel/{novel_id}.json'),
    decorators_1.methodBuilder(),
    __param(0, decorators_1.ParamPath('novel_id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Object)
], DmzjClient.prototype, "_novelInfo", null);
__decorate([
    decorators_1.GET('novel/chapter/{novel_id}.json'),
    decorators_1.methodBuilder(),
    __param(0, decorators_1.ParamPath('novel_id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Object)
], DmzjClient.prototype, "novelChapter", null);
__decorate([
    decorators_1.GET('novel/download/{id}_{volume_id}_{chapter_id}.txt'),
    decorators_1.methodBuilder(),
    __param(0, decorators_1.ParamPath('id')),
    __param(1, decorators_1.ParamPath('volume_id')),
    __param(2, decorators_1.ParamPath('chapter_id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, Number]),
    __metadata("design:returntype", Object)
], DmzjClient.prototype, "novelDownload", null);
__decorate([
    decorators_1.GET('1/category.json'),
    decorators_1.methodBuilder(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Object)
], DmzjClient.prototype, "novelCategory", null);
__decorate([
    decorators_1.GET('novel/filter.json'),
    decorators_1.methodBuilder(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Object)
], DmzjClient.prototype, "novelFilter", null);
__decorate([
    decorators_1.GET('novel/{cat_id}/{status_id}/{order_id}/{page}.json'),
    decorators_1.methodBuilder(),
    __param(0, decorators_1.ParamPath('cat_id')),
    __param(1, decorators_1.ParamPath('status_id')),
    __param(2, decorators_1.ParamPath('order_id')),
    __param(3, decorators_1.ParamPath('page', 0)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, Number, Number]),
    __metadata("design:returntype", Object)
], DmzjClient.prototype, "novelList", null);
__decorate([
    decorators_1.GET('search/show/{big_cat_id}/{keywords}/{page}.json'),
    decorators_1.methodBuilder(),
    __param(0, decorators_1.ParamPath('big_cat_id')),
    __param(1, decorators_1.ParamPath('keywords')),
    __param(2, decorators_1.ParamPath('page', 0)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String, Number]),
    __metadata("design:returntype", Object)
], DmzjClient.prototype, "searchShow", null);
__decorate([
    decorators_1.GET('v3/recommend.json'),
    decorators_1.methodBuilder(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Object)
], DmzjClient.prototype, "comicRecommend", null);
__decorate([
    decorators_1.GET('comic/{comic_id}.json'),
    decorators_1.methodBuilder(),
    __param(0, decorators_1.ParamPath('comic_id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Object)
], DmzjClient.prototype, "comicDetail", null);
__decorate([
    decorators_1.GET('chapter/{comic_id}/{chapter_id}.json'),
    decorators_1.methodBuilder(),
    __param(0, decorators_1.ParamPath('comic_id')), __param(1, decorators_1.ParamPath('chapter_id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", Object)
], DmzjClient.prototype, "comicContent", null);
__decorate([
    decorators_1.POST('device/building'),
    decorators_1.methodBuilder(),
    decorators_1.BodyData({
        device: util_1.buildVersion().channel,
    }),
    __param(0, decorators_1.ParamMapData({
        user_id: 1,
        channel_id: 2,
    })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Object)
], DmzjClient.prototype, "deviceBuilding", null);
DmzjClient = __decorate([
    decorators_1.BaseUrl('http://v2.api.dmzj.com'),
    decorators_1.Headers({
        Referer: 'http://www.dmzj.com/',
    }),
    decorators_1.TransformResponse((data) => {
        if (typeof data === 'string') {
            try {
                return JSON.parse(data);
            }
            catch (e) {
                try {
                    return JSON.parse(data.replace(/(?<=\})test$/, ''));
                }
                catch (e) {
                }
            }
        }
        return data;
    }),
    decorators_1.RequestConfigs({
        responseType: 'json',
        //	data: {
        //		...buildVersion(),
        //	},
    }),
    decorators_1.CacheRequest({
        cache: {
            maxAge: 6 * 60 * 60 * 1000,
        },
    }),
    __metadata("design:paramtypes", [Object])
], DmzjClient);
exports.DmzjClient = DmzjClient;
exports.default = DmzjClient;
//# sourceMappingURL=index.js.map