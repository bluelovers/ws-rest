"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DmzjClient = void 0;
const tslib_1 = require("tslib");
const lib_1 = require("restful-decorator/lib");
const decorators_1 = require("restful-decorator/lib/decorators");
const cookies_1 = require("restful-decorator/lib/decorators/config/cookies");
const bluebird_1 = tslib_1.__importDefault(require("bluebird"));
const util_1 = require("./util");
const array_hyper_unique_1 = require("array-hyper-unique");
const debug_1 = tslib_1.__importDefault(require("restful-decorator/lib/util/debug"));
const symbol_1 = require("restful-decorator/lib/helper/symbol");
const subobject_1 = tslib_1.__importDefault(require("restful-decorator/lib/helper/subobject"));
const crypto_1 = require("./v4/crypto");
const protobuf_1 = require("./v4/protobuf");
/**
 * https://gist.github.com/bluelovers/5e9bfeecdbff431c62d5b50e7bdc3e48
 * https://github.com/guuguo/flutter_dmzj/blob/master/lib/api.dart
 * https://github.com/tkkcc/flutter_dmzj/blob/269cb0d642c710626fe7d755f0b27b12ab477cc6/lib/util/api.dart
 */
//@BaseUrl('http://v2.api.dmzj.com')
//@BaseUrl('http://nnv3api.dmzj1.com')
let DmzjClient = exports.DmzjClient = class DmzjClient extends lib_1.AbstractHttpClient {
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
        const jar = (0, cookies_1.getCookieJar)(this);
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
            return (0, array_hyper_unique_1.array_unique)(list);
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
    //@GET('novel/{novel_id}.json')
    _novelInfo(novel_id) {
        const decrypted = (0, crypto_1.decryptBase64V4)(this.$response.data);
        const result = (0, protobuf_1.lookupTypeNovelDetailResponse)().decode(decrypted);
        // console.log(result.toJSON())
        const apiresult = {
            id: result.Data.NovelId,
            name: result.Data.Name,
            zone: result.Data.Zone,
            status: result.Data.Status,
            last_update_volume_name: result.Data.LastUpdateVolumeName,
            last_update_chapter_name: result.Data.LastUpdateChapterName,
            last_update_volume_id: result.Data.LastUpdateVolumeId,
            last_update_chapter_id: result.Data.LastUpdateChapterId,
            last_update_time: +result.Data.LastUpdateTime,
            cover: result.Data.Cover,
            hot_hits: result.Data.HotHits,
            introduction: result.Data.Introduction,
            types: result.Data.Types,
            authors: result.Data.Authors,
            first_letter: result.Data.FirstLetter,
            subscribe_num: result.Data.SubscribeNum,
            volume: result.Data.Volume.map((v) => {
                return {
                    id: v.VolumeId,
                    lnovel_id: v.LnovelId,
                    volume_name: v.VolumeName,
                    volume_order: v.VolumeOrder,
                    addtime: +v.Addtime,
                    sum_chapters: v.SumChapters,
                };
            }),
        };
        return apiresult;
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
        const decrypted = (0, crypto_1.decryptBase64V4)(this.$response.data);
        const result = (0, protobuf_1.lookupTypeNovelChapterResponse)().decode(decrypted);
        const apiresult = result.Data.map((v) => {
            return {
                volume_id: v.VolumeId,
                id: v.VolumeId,
                volume_name: v.VolumeName,
                volume_order: v.VolumeOrder,
                chapters: v.Chapters.map((c) => {
                    return {
                        chapter_id: c.ChapterId,
                        chapter_name: c.ChapterName,
                        chapter_order: c.ChapterOrder,
                    };
                }),
            };
        });
        return (0, util_1.sortDmzjNovelInfoChapters)(apiresult);
    }
    /**
     * 取得小說資料的同時一起取得章節列表
     */
    _novelInfoWithChapters(novel_id) {
        let selfTop = (0, subobject_1.default)({}, this);
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
tslib_1.__decorate([
    (0, decorators_1.POST)('https://user.dmzj.com/loginV2/m_confirm'),
    (0, decorators_1.methodBuilder)(),
    decorators_1.FormUrlencoded,
    tslib_1.__param(0, (0, decorators_1.ParamData)('nickname')),
    tslib_1.__param(1, (0, decorators_1.ParamData)('passwd')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, String]),
    tslib_1.__metadata("design:returntype", Object)
], DmzjClient.prototype, "loginConfirm", null);
tslib_1.__decorate([
    (0, decorators_1.POST)('https://i.dmzj.com/subscribe'),
    (0, decorators_1.Headers)({
        Referer: 'https://i.dmzj.com/subscribe',
    }),
    (0, decorators_1.methodBuilder)(),
    tslib_1.__param(0, (0, decorators_1.ParamMapData)({
        page: 1,
        type_id: 4 /* EnumWebSubscribeTypeID.NOVEL */,
        letter_id: 0,
        read_id: 1,
    })),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Object)
], DmzjClient.prototype, "webSubscribe", null);
tslib_1.__decorate([
    (0, decorators_1.GET)('article/recommend/header.json'),
    (0, decorators_1.methodBuilder)(),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", Object)
], DmzjClient.prototype, "articleRecommendHeader", null);
tslib_1.__decorate([
    (0, decorators_1.GET)('article/category.json'),
    (0, decorators_1.methodBuilder)(),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", Object)
], DmzjClient.prototype, "articleCategory", null);
tslib_1.__decorate([
    (0, decorators_1.GET)('article/list/v2/{tag_id}/2/{page}.json'),
    (0, decorators_1.methodBuilder)(),
    tslib_1.__param(0, (0, decorators_1.ParamPath)('tag_id')),
    tslib_1.__param(1, (0, decorators_1.ParamPath)('page', 0)),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Number, Number]),
    tslib_1.__metadata("design:returntype", Object)
], DmzjClient.prototype, "articleList", null);
tslib_1.__decorate([
    (0, decorators_1.GET)('article/show/v2/{object_id}.html'),
    (0, decorators_1.methodBuilder)(),
    tslib_1.__param(0, (0, decorators_1.ParamPath)('object_id')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Number]),
    tslib_1.__metadata("design:returntype", Object)
], DmzjClient.prototype, "articleShow", null);
tslib_1.__decorate([
    (0, decorators_1.GET)('novel/recommend.json'),
    (0, decorators_1.methodBuilder)(),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", Object)
], DmzjClient.prototype, "novelRecommend", null);
tslib_1.__decorate([
    (0, decorators_1.GET)('novel/recentUpdate/{page}.json'),
    (0, decorators_1.methodBuilder)(),
    tslib_1.__param(0, (0, decorators_1.ParamPath)('page', 0)),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Number, Number]),
    tslib_1.__metadata("design:returntype", Object)
], DmzjClient.prototype, "_novelRecentUpdate", null);
tslib_1.__decorate([
    (0, decorators_1.GET)('http://nnv4api.dmzj.com/novel/detail/{novel_id}'),
    (0, decorators_1.methodBuilder)(),
    tslib_1.__param(0, (0, decorators_1.ParamPath)('novel_id')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Object)
], DmzjClient.prototype, "_novelInfo", null);
tslib_1.__decorate([
    (0, decorators_1.GET)('http://nnv4api.dmzj.com/novel/chapter/{novel_id}'),
    (0, decorators_1.methodBuilder)(),
    tslib_1.__param(0, (0, decorators_1.ParamPath)('novel_id')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Object)
], DmzjClient.prototype, "novelChapter", null);
tslib_1.__decorate([
    (0, decorators_1.GET)('novel/download/{id}_{volume_id}_{chapter_id}.txt'),
    (0, decorators_1.methodBuilder)(),
    tslib_1.__param(0, (0, decorators_1.ParamPath)('id')),
    tslib_1.__param(1, (0, decorators_1.ParamPath)('volume_id')),
    tslib_1.__param(2, (0, decorators_1.ParamPath)('chapter_id')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Number, Number, Number]),
    tslib_1.__metadata("design:returntype", Object)
], DmzjClient.prototype, "novelDownload", null);
tslib_1.__decorate([
    (0, decorators_1.GET)('1/category.json'),
    (0, decorators_1.methodBuilder)(),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", Object)
], DmzjClient.prototype, "novelCategory", null);
tslib_1.__decorate([
    (0, decorators_1.GET)('novel/filter.json'),
    (0, decorators_1.methodBuilder)(),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", Object)
], DmzjClient.prototype, "novelFilter", null);
tslib_1.__decorate([
    (0, decorators_1.GET)('novel/{cat_id}/{status_id}/{order_id}/{page}.json'),
    (0, decorators_1.methodBuilder)(),
    tslib_1.__param(0, (0, decorators_1.ParamPath)('cat_id')),
    tslib_1.__param(1, (0, decorators_1.ParamPath)('status_id')),
    tslib_1.__param(2, (0, decorators_1.ParamPath)('order_id')),
    tslib_1.__param(3, (0, decorators_1.ParamPath)('page', 0)),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Number, Number, Number, Number]),
    tslib_1.__metadata("design:returntype", Object)
], DmzjClient.prototype, "novelList", null);
tslib_1.__decorate([
    (0, decorators_1.GET)('search/show/{big_cat_id}/{keywords}/{page}.json'),
    (0, decorators_1.methodBuilder)(),
    tslib_1.__param(0, (0, decorators_1.ParamPath)('big_cat_id')),
    tslib_1.__param(1, (0, decorators_1.ParamPath)('keywords')),
    tslib_1.__param(2, (0, decorators_1.ParamPath)('page', 0)),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Number, String, Number]),
    tslib_1.__metadata("design:returntype", Object)
], DmzjClient.prototype, "searchShow", null);
tslib_1.__decorate([
    (0, decorators_1.GET)('v3/recommend.json'),
    (0, decorators_1.methodBuilder)(),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", Object)
], DmzjClient.prototype, "comicRecommend", null);
tslib_1.__decorate([
    (0, decorators_1.GET)('comic/{comic_id}.json'),
    (0, decorators_1.methodBuilder)(),
    tslib_1.__param(0, (0, decorators_1.ParamPath)('comic_id')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Number]),
    tslib_1.__metadata("design:returntype", Object)
], DmzjClient.prototype, "comicDetail", null);
tslib_1.__decorate([
    (0, decorators_1.GET)('chapter/{comic_id}/{chapter_id}.json'),
    (0, decorators_1.methodBuilder)(),
    tslib_1.__param(0, (0, decorators_1.ParamPath)('comic_id')),
    tslib_1.__param(1, (0, decorators_1.ParamPath)('chapter_id')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Number, Number]),
    tslib_1.__metadata("design:returntype", Object)
], DmzjClient.prototype, "comicContent", null);
tslib_1.__decorate([
    (0, decorators_1.POST)('device/building'),
    (0, decorators_1.methodBuilder)(),
    (0, decorators_1.BodyData)({
        device: (0, util_1.buildVersion)().channel,
    }),
    tslib_1.__param(0, (0, decorators_1.ParamMapData)({
        user_id: 1,
        channel_id: 2,
    })),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Object)
], DmzjClient.prototype, "deviceBuilding", null);
exports.DmzjClient = DmzjClient = tslib_1.__decorate([
    (0, decorators_1.BaseUrl)('https://nnv3api.dmzj.com'),
    (0, decorators_1.Headers)({
        Referer: 'http://www.dmzj.com/',
    }),
    (0, decorators_1.TransformResponse)((data) => {
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
    (0, decorators_1.RequestConfigs)({
        responseType: 'json',
        //	data: {
        //		...buildVersion(),
        //	},
    }),
    (0, decorators_1.CacheRequest)({
        cache: {
            maxAge: 6 * 60 * 60 * 1000,
        },
    }),
    tslib_1.__metadata("design:paramtypes", [Object])
], DmzjClient);
exports.default = DmzjClient;
//# sourceMappingURL=index.js.map