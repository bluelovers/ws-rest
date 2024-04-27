"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports._queryWords = _queryWords;
exports._parseWords = _parseWords;
const _parseInt_1 = require("./_parseInt");
function _queryWords(min, max) {
    if (typeof min === 'string' && min.includes('-')) {
        return min;
    }
    else if (min !== null && typeof min === 'object') {
        if (Array.isArray(min)) {
            ([min, max] = min);
        }
        else {
            ({ min, max } = min);
        }
    }
    min = (0, _parseInt_1._parseInt)(min);
    max = (0, _parseInt_1._parseInt)(max);
    if (min || max) {
        return `${min !== null && min !== void 0 ? min : 0}-${max !== null && max !== void 0 ? max : ''}`;
    }
}
function _parseWords(words) {
    if (words === '') {
        return;
    }
    let ls = words === null || words === void 0 ? void 0 : words.split('-');
    if (typeof words === 'undefined' || words === null || (ls === null || ls === void 0 ? void 0 : ls.length) === 2) {
        if (ls.length === 2) {
            let [min, max] = ls;
            min = (0, _parseInt_1._parseInt)(min);
            max = (0, _parseInt_1._parseInt)(max);
            if (!min && !max) {
                throw new TypeError(`Invalid query words: ${words} = ${ls}`);
            }
            return {
                min,
                max,
            };
        }
        return;
    }
    throw new TypeError(`Invalid query words: ${words}`);
}
//# sourceMappingURL=_queryWords.js.map