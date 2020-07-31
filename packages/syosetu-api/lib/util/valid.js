"use strict";
/**
 * Created by user on 2020/4/9.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.validNcode = void 0;
function validNcode(ncode) {
    return /^(n[\w]{5,6})$/.test(ncode);
}
exports.validNcode = validNcode;
//# sourceMappingURL=valid.js.map