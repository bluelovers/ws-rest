"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports._getBookTags = void 0;
const util_1 = require("../util");
const array_hyper_unique_1 = require("array-hyper-unique");
function _getBookTags($, tags = []) {
    $('.widget-tags a.tag[href*="tag"]')
        .each((i, elem) => {
        let _this = $(elem);
        let name = (0, util_1.trimUnsafe)(_this.text());
        if (name.length) {
            tags.push(name);
        }
    });
    $('.page-title .container .column h1')
        .each((i, elem) => {
        let _this = $(elem);
        let name = (0, util_1.trimUnsafe)(_this.text());
        if (name.length) {
            tags.push(name);
        }
    });
    (0, array_hyper_unique_1.array_unique_overwrite)(tags);
    return tags;
}
exports._getBookTags = _getBookTags;
//# sourceMappingURL=_getBookTags.js.map