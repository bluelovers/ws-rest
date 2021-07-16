"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports._getImgSrc = void 0;
function _getImgSrc(_img, baseURL) {
    let src = _img.prop('lay-src') || _img.prop('src') || _img.attr('lay-src') || _img.attr('src');
    return new URL(src, baseURL).href;
}
exports._getImgSrc = _getImgSrc;
//# sourceMappingURL=_getImgSrc.js.map