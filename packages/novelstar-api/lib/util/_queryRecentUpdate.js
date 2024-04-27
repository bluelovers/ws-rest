"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports._queryRecentUpdate = _queryRecentUpdate;
const types_1 = require("../types");
const _queryWords_1 = require("./_queryWords");
const _queryTimes_1 = require("./_queryTimes");
function _queryRecentUpdate(page, extra) {
    if (typeof (extra === null || extra === void 0 ? void 0 : extra.words) !== 'undefined') {
        extra.words = (0, _queryWords_1._queryWords)(extra.words);
    }
    if (typeof (extra === null || extra === void 0 ? void 0 : extra.times) !== 'undefined') {
        extra.times = (0, _queryTimes_1._queryTimes)(extra.times);
    }
    if ((extra === null || extra === void 0 ? void 0 : extra.o) === types_1.EnumOrder.hot) {
        delete extra.o;
    }
    return [
        page,
        extra,
    ];
}
//# sourceMappingURL=_queryRecentUpdate.js.map