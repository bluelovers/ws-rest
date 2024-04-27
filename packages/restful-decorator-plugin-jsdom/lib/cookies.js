"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deserializeCookieJar = deserializeCookieJar;
const lazy_cookies_1 = require("lazy-cookies");
function deserializeCookieJar(serialized, store) {
    return lazy_cookies_1.LazyCookieJar.deserializeSync(serialized, store);
}
//# sourceMappingURL=cookies.js.map