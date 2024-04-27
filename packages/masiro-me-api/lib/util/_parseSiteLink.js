"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports._parseSiteLink = _parseSiteLink;
const _parseUrlInfo_1 = require("./_parseUrlInfo");
/**
 * @deprecated
 */
function _parseSiteLink(chapter_link) {
    let _m = (0, _parseUrlInfo_1._parseUrlInfo)(chapter_link);
    if (_m.novel_id || _m.chapter_id) {
        return _m;
    }
}
//# sourceMappingURL=_parseSiteLink.js.map