"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports._getRecentUpdate = void 0;
const trim_1 = require("./trim");
const _parseSiteLink_1 = require("./_parseSiteLink");
const regexp_cjk_1 = require("regexp-cjk");
const _handleBookInfo_1 = require("./_handleBookInfo");
const _getImgSrc_1 = require("./_getImgSrc");
function _getRecentUpdate($, json, baseURL, extra) {
    let data = {
        page: parseInt(json.page),
        pages: json.pages,
        total: json.total,
        extra,
        list: [],
    };
    $('.layui-card').each((i, elem) => {
        let _this = $(elem);
        let title = (0, trim_1.trimUnsafe)(_this.find('.layui-card-header').text());
        let _a = _this.find('a:has(.layui-card-header)');
        let novel_link = _a.prop('href');
        let _m = (0, _parseSiteLink_1._parseSiteLink)(novel_link);
        let _n_info = _this.find('.n-info');
        let authors = [];
        let _author = (0, trim_1.trimUnsafe)(_n_info.find('.author').text().replace(new regexp_cjk_1.zhRegExp(/^\s*作者(?:：|:)\s*/), ''));
        if (_author.length) {
            authors.push(_author);
        }
        let translator = [];
        _n_info.find('.translators .ts').each((i, elem) => {
            let s = (0, trim_1.trimUnsafe)($(elem).text());
            if (s.length) {
                translator.push(s);
            }
        });
        let tags = [];
        _n_info.find('.tag')
            .each((index, elem) => {
            let s = (0, trim_1.trimUnsafe)($(elem).text());
            if (s.length) {
                tags.push(s);
            }
        });
        let _img = _this.find('img.n-img');
        let cover = (0, _getImgSrc_1._getImgSrc)(_img, baseURL);
        let last_update_name = (0, trim_1.trimUnsafe)(_this.find('.new_up').text().replace(new regexp_cjk_1.zhRegExp(/^\s*最新(?:：|:)\s*/), ''));
        data.list.push((0, _handleBookInfo_1._handleBookInfo)({
            id: _m.novel_id,
            title,
            cover,
            authors,
            translator,
            tags,
            last_update_name,
        }));
    });
    return data;
}
exports._getRecentUpdate = _getRecentUpdate;
//# sourceMappingURL=_getRecentUpdate.js.map