"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports._handleImgURL = exports._getImgSrc = void 0;
const img_better_quality_url_1 = require("img-better-quality-url");
function _getImgSrc(_img, baseURL) {
    let src = _img.prop('lay-src') || _img.prop('src') || _img.attr('lay-src') || _img.attr('src');
    if (src === null || src === void 0 ? void 0 : src.length) {
        return _handleImgURL(new URL(src, baseURL)).href;
    }
}
exports._getImgSrc = _getImgSrc;
function _handleImgURL(url) {
    return (0, img_better_quality_url_1.betterQualityURL)(url).url;
}
exports._handleImgURL = _handleImgURL;
//# sourceMappingURL=_getImgSrc.js.map