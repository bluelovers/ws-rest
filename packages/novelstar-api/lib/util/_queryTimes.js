"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports._queryTimes = _queryTimes;
const types_1 = require("../types");
const _parseInt_1 = require("./_parseInt");
function _queryTimes(times, unit) {
    if (times !== null && typeof times === 'object') {
        if (Array.isArray(times)) {
            ([times, unit] = times);
        }
        else {
            throw new TypeError(`Invalid times: ${times}`);
        }
    }
    if (typeof times === 'string' && /\D/.test(times)) {
        return times;
    }
    times = (0, _parseInt_1._parseInt)(times);
    if (times) {
        return `${times} ${unit || types_1.EnumTimesUnit.days}`;
    }
}
//# sourceMappingURL=_queryTimes.js.map