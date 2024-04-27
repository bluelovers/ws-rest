"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports._getBookTags = _getBookTags;
const trim_1 = require("./trim");
function _getBookTags($, tags = []) {
    $('.n-detail .tags a .label')
        .each((index, elem) => {
        let s = (0, trim_1.trimUnsafe)($(elem).text());
        if (s.length) {
            tags !== null && tags !== void 0 ? tags : (tags = []);
            tags.push(s);
        }
    });
    return tags;
}
//# sourceMappingURL=_getBookTags.js.map