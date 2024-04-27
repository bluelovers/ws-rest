"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports._remove_ad = _remove_ad;
function _remove_ad($) {
    $('p[class]:has(> script), script[src*=google], > .adsbygoogle').remove();
}
//# sourceMappingURL=_remove_ad.js.map