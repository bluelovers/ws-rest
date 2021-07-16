"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports._handleBookInfo = void 0;
function _handleBookInfo(book) {
    var _a;
    Object.entries(book)
        .forEach(([key, value]) => {
        if (Array.isArray(value) && !value.length) {
            book[key] = void 0;
        }
    });
    if (!((_a = book.content) === null || _a === void 0 ? void 0 : _a.length)) {
        book.content = void 0;
    }
    return book;
}
exports._handleBookInfo = _handleBookInfo;
//# sourceMappingURL=_handleBookInfo.js.map