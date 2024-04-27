"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports._getImgSrc = _getImgSrc;
exports._handleImgURL = _handleImgURL;
const img_better_quality_url_1 = require("img-better-quality-url");
function _getImgSrc(_img, baseURL) {
    let src = _img.prop('lay-src') || _img.prop('src') || _img.attr('lay-src') || _img.attr('src');
    if (src === null || src === void 0 ? void 0 : src.length) {
        return _handleImgURL(new URL(src, baseURL)).href;
    }
}
function _handleImgURL(url) {
    return (0, img_better_quality_url_1.betterQualityURL)(url).url;
}
//# sourceMappingURL=_getImgSrc.js.map