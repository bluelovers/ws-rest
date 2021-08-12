"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports._getRecentUpdate = void 0;
const _parseUrlInfo_1 = require("./_parseUrlInfo");
function _getRecentUpdate($, page, baseURL, extra) {
    let range = {};
    $('.container .page-m li:not(.arrr) a')
        .each((i, elem) => {
        var _b, _c;
        let _a = $(elem);
        let p = parseInt(_a.text());
        if (_a.is('active')) {
            page = p;
        }
        range.min = Math.min((_b = range.min) !== null && _b !== void 0 ? _b : p, p);
        range.max = Math.max((_c = range.max) !== null && _c !== void 0 ? _c : p, p);
    });
    let list = [];
    $('section .container .pd-list .item')
        .each((i, elem) => {
        let _this = $(elem);
        let _src = _this.find('.img-wrap .cover-true .pd-default-img img').prop('src');
        let cover;
        if ((_src === null || _src === void 0 ? void 0 : _src.length) && !/\.jpg$/.test(_src)) {
            cover = _src;
        }
        let _a = _this.find('.pd-tt a[href*="books"]');
        let title = _a.text();
        let _m = (0, _parseUrlInfo_1._parseUrlInfo)(_a.prop('href'));
        let content = _this.find('.pd-desc').text();
        let last_update_name = _this.find('.pd-latest-update a').text();
        let novel_r18 = _this.find('.pd-tt .pd-tag .restrict18').length > 0;
        list.push({
            id: _m.novel_id,
            title,
            novel_r18,
            cover,
            last_update_name,
            content,
        });
    });
    return {
        page,
        extra,
        range: {
            ...range,
        },
        list,
    };
}
exports._getRecentUpdate = _getRecentUpdate;
//# sourceMappingURL=_getRecentUpdate.js.map