"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports._fixCoverUrl = void 0;
const lazy_url_1 = require("lazy-url");
function _fixCoverUrl(cover) {
    if (!cover) {
        return;
    }
    let u = new lazy_url_1.LazyURL(cover);
    if (/esjzone/.test(u.host) && u.pathname.includes('empty.jpg')
        || /pinimg/.test(u.host) && u.pathname.includes('861e5157abc25f92f6b49af0f1465927.jpg')) {
        return;
    }
    return u.toRealString();
}
exports._fixCoverUrl = _fixCoverUrl;
//# sourceMappingURL=_fixCoverUrl.js.map