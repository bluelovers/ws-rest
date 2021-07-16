"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports._parseSiteLink = void 0;
function _parseSiteLink(chapter_link) {
    let novel_id;
    let chapter_id;
    let _m = chapter_link
        .match(/novelReading\?cid=(\d+)/);
    if (_m) {
        chapter_id = _m[1];
        return {
            chapter_id,
        };
    }
    _m = chapter_link
        .match(/novelView\?novel_id=(\d+)/);
    if (_m) {
        novel_id = _m[1];
        return {
            novel_id,
        };
    }
}
exports._parseSiteLink = _parseSiteLink;
//# sourceMappingURL=_parseSiteLink.js.map