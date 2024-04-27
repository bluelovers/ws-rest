"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports._parseSiteLink = _parseSiteLink;
function _parseSiteLink(chapter_link) {
    let _m = chapter_link
        .match(/esjzone\.cc\/forum\/(\d+)\/(\d+)\.html?/);
    let novel_id;
    let chapter_id;
    if (_m) {
        novel_id = _m[1];
        chapter_id = _m[2];
        return {
            novel_id,
            chapter_id,
        };
    }
    _m = chapter_link
        .match(/esjzone\.cc\/detail\/(\d+)/);
    if (_m) {
        novel_id = _m[1];
        return {
            novel_id,
        };
    }
}
//# sourceMappingURL=_parseSiteLink.js.map