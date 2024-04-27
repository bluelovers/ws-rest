"use strict";
/**
 * Created by user on 2020/4/9.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.validNcode = validNcode;
function validNcode(ncode) {
    return /^(n[\w]{5,6})$/.test(ncode);
}
//# sourceMappingURL=valid.js.map