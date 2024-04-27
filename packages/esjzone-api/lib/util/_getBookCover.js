"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports._getBookCover = _getBookCover;
const _fixCoverUrl_1 = require("./_fixCoverUrl");
function _getBookCover($) {
    let _cover;
    $('.container .product-gallery')
        .find(`.gallery-item img[src], a img[src]`)
        .toArray()
        .some((elem) => {
        let cover = (0, _fixCoverUrl_1._fixCoverUrl)($(elem).prop('src'));
        if (cover = (0, _fixCoverUrl_1._fixCoverUrl)(cover)) {
            return _cover = cover;
        }
    });
    return _cover;
}
//# sourceMappingURL=_getBookCover.js.map