"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.printIndexLabel = void 0;
function printIndexLabel(index, langth) {
    return `${index.toString().padStart(4, '0')}/${langth.toString().padStart(4, '0')}`;
}
exports.printIndexLabel = printIndexLabel;
//# sourceMappingURL=util.js.map