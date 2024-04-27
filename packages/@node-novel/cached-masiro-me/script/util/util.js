"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.printIndexLabel = printIndexLabel;
function printIndexLabel(index, langth) {
    return `${index.toString().padStart(4, '0')}/${langth.toString().padStart(4, '0')}`;
}
//# sourceMappingURL=util.js.map