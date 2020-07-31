"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toArray = exports.toRecord = exports._handle = void 0;
function _handle(list) {
    return list.sort((a, b) => {
        return b.updated - a.updated;
    });
}
exports._handle = _handle;
function toRecord(list) {
    list = _handle(list);
    let record = list
        .reduce((a, b) => {
        a[b.uuid] = b;
        return a;
    }, {});
    return record;
}
exports.toRecord = toRecord;
function toArray(record) {
    let list = Object.values(record);
    list = _handle(list);
    return list;
}
exports.toArray = toArray;
//# sourceMappingURL=convert.js.map