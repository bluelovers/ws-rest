"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports._handleBookInfo = _handleBookInfo;
const trim_1 = require("./trim");
const asserts_1 = require("./asserts");
const ts_type_predicates_1 = require("ts-type-predicates");
const _sortBookFields_1 = require("./_sortBookFields");
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
        let timestamp = 0;
        let chapters_num = 0;
        if (book.chapters.length) {
            book.chapters.forEach((vol) => {
                vol.chapters.forEach((ch) => {
                    timestamp = Math.max(ch.chapter_updated, timestamp);
                    chapters_num++;
                });
            });
        }
        if (!book.updated && timestamp) {
            book.updated = timestamp;
        }
        book.chapters_num = chapters_num;
    }
    return (0, _sortBookFields_1._sortBookFields)(book);
}
//# sourceMappingURL=_handleBookInfo.js.map