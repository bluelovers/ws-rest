"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports._getBookLinks = void 0;
const util_1 = require("../util");
function _getBookLinks($, links = []) {
    $('.book-detail')
        .find('a[href]')
        .not('.btn, .form-group *')
        .each((i, elem) => {
        let _this = $(elem);
        let name = (0, util_1.trimUnsafe)(_this.text());
        let href = _this.prop('href');
        if (name === href || name === '') {
            name = undefined;
        }
        if (!href.length || href === 'https://www.esjzone.cc/tags//') {
            return;
        }
        links.push({
            name,
            href,
        });
    });
    return links;
}
exports._getBookLinks = _getBookLinks;
//# sourceMappingURL=_getBookLinks.js.map