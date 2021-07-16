"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports._handleBookInfo = void 0;
const trim_1 = require("./trim");
function _handleBookInfo(book) {
    var _a, _b, _c, _d, _e;
    if ((_a = book.tags) === null || _a === void 0 ? void 0 : _a.length) {
        book.tags = book.tags
            .filter(Boolean)
            .map(s => s.split('/').map(s => (0, trim_1.trimUnsafe)(s)))
            .flat()
            .filter(Boolean);
    }
    Object.entries(book)
        .forEach(([key, value]) => {
        if (Array.isArray(value) && !value.length) {
            book[key] = void 0;
        }
    });
    // @ts-ignore
    if (!((_b = book.content) === null || _b === void 0 ? void 0 : _b.length)) {
        // @ts-ignore
        book.content = void 0;
    }
    if (!((_c = book.last_update_name) === null || _c === void 0 ? void 0 : _c.length)) {
        book.last_update_name = void 0;
    }
    if ((_d = book.cover) === null || _d === void 0 ? void 0 : _d.length) {
        if (book.cover.includes('other-210706104151-kJQE.jpg')) {
            book.cover = void 0;
        }
    }
    if (!((_e = book.cover) === null || _e === void 0 ? void 0 : _e.length)) {
        book.cover = void 0;
    }
    return book;
}
exports._handleBookInfo = _handleBookInfo;
//# sourceMappingURL=_handleBookInfo.js.map