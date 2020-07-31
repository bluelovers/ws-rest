"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deserializeCookieJar = void 0;
const lazy_cookies_1 = require("lazy-cookies");
function deserializeCookieJar(serialized, store) {
    return lazy_cookies_1.LazyCookieJar.deserializeSync(serialized, store);
}
exports.deserializeCookieJar = deserializeCookieJar;
//# sourceMappingURL=cookies.js.map