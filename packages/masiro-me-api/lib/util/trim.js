"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.trimUnsafe = void 0;
const zero_width_1 = require("zero-width");
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
//# sourceMappingURL=trim.js.map