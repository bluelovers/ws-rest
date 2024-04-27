"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports._handle = _handle;
exports.toRecord = toRecord;
exports.toArray = toArray;
function _handle(list) {
    return list.sort((a, b) => {
        return b.updated - a.updated;
    });
}
function toRecord(list) {
    list = _handle(list);
    let record = list
        .reduce((a, b) => {
        a[b.uuid] = b;
        return a;
    }, {});
    return record;
}
function toArray(record) {
    let list = Object.values(record);
    list = _handle(list);
    return list;
}
//# sourceMappingURL=convert.js.map