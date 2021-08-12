"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports._remove_ad = void 0;
function _remove_ad($) {
    $('p[class]:has(> script), script[src*=google], > .adsbygoogle').remove();
}
exports._remove_ad = _remove_ad;
//# sourceMappingURL=_remove_ad.js.map