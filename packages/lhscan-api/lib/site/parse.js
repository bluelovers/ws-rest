"use strict";
/**
 * Created by user on 2020/5/8.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseReadUrl = exports.parseMangaKey = void 0;
function parseMangaKey(pathname) {
    var _a, _b;
    return (_b = ((_a = pathname.pathname) !== null && _a !== void 0 ? _a : pathname).match(/\bmanga-(.+).html$/)) === null || _b === void 0 ? void 0 : _b[1];
}
exports.parseMangaKey = parseMangaKey;
function parseReadUrl(pathname) {
    var _a;
    let m = ((_a = pathname.pathname) !== null && _a !== void 0 ? _a : pathname).match(/\bread-(.+)-chapter-(.+).html$/);
    return {
        id_key: m[1],
        chapter_id: m[2],
    };
}
exports.parseReadUrl = parseReadUrl;
//# sourceMappingURL=parse.js.map