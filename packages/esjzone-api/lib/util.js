"use strict";
/**
 * Created by user on 2019/11/21.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.trimUnsafe = exports.removeZeroWidth = void 0;
const zero_width_1 = require("zero-width");
Object.defineProperty(exports, "removeZeroWidth", { enumerable: true, get: function () { return zero_width_1.removeZeroWidth; } });
const crlf_normalize_1 = require("crlf-normalize");
function trimUnsafe(input) {
    // @ts-ignore
    return (0, zero_width_1.removeZeroWidth)((0, crlf_normalize_1.crlf)(input))
        .replace(/^\s+|\s+$/gu, '')
        .replace(/[\u00A0]/gu, ' ')
        .replace(/[\t ]+/gu, ' ')
        .trim();
}
exports.trimUnsafe = trimUnsafe;
//# sourceMappingURL=util.js.map