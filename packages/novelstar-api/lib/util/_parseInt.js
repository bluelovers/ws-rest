"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports._parseInt = _parseInt;
function _parseInt(n) {
    if (typeof n === 'string' || typeof n === 'undefined' || n === null) {
        // @ts-ignore
        if (!(n === null || n === void 0 ? void 0 : n.length)) {
            n = void 0;
        }
        else {
            n = Number.parseInt(n);
        }
    }
    if (typeof n === 'number' || typeof n === 'undefined') {
        if (!n) {
            return void 0;
        }
        return n;
    }
    throw new TypeError(`Invalid number: ${n}`);
}
//# sourceMappingURL=_parseInt.js.map