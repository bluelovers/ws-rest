"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports._handleBookInfo = void 0;
const trim_1 = require("./trim");
const asserts_1 = require("./asserts");
const ts_type_predicates_1 = require("ts-type-predicates");
function _handleBookInfo(book) {
    var _a, _b, _c;
    (0, ts_type_predicates_1.typePredicates)(book);
    if ((_a = book.tags) === null || _a === void 0 ? void 0 : _a.length) {
        book.tags = book.tags
            .filter(Boolean)
            .map(s => s.split('/').map(s => (0, trim_1.trimUnsafe)(s)))
            .flat()
            .filter(Boolean);
    }
    Object.entries(book)
        .forEach(([key, value]) => {
        if (value === null || (typeof value === 'string' || Array.isArray(value)) && !value.length) {
            book[key] = void 0;
        }
    });
    if ((_b = book.cover) === null || _b === void 0 ? void 0 : _b.length) {
        if (book.cover.includes('other-210706104151-kJQE.jpg')) {
            book.cover = void 0;
        }
    }
    else if (!((_c = book.cover) === null || _c === void 0 ? void 0 : _c.length)) {
        book.cover = void 0;
    }
    if ((0, asserts_1.isBookWithChapters)(book)) {
        if (!book.updated && book.chapters.length) {
            let timestamp = 0;
            book.chapters.forEach((vol) => {
                vol.chapters.forEach((ch) => {
                    timestamp = Math.max(ch.chapter_updated, timestamp);
                });
            });
            if (timestamp) {
                book.updated = timestamp;
            }
        }
    }
    return book;
}
exports._handleBookInfo = _handleBookInfo;
//# sourceMappingURL=_handleBookInfo.js.map