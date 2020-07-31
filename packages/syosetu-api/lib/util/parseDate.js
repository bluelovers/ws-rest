"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseDateStringToMoment = void 0;
const moment_1 = require("@node-novel/site-cache-util/lib/moment");
function parseDateStringToMoment(dateString, format = 'YYYY-MM-DD hh:mm:ss') {
    return moment_1.moment.tz(dateString, format, 'Asia/Tokyo');
}
exports.parseDateStringToMoment = parseDateStringToMoment;
//# sourceMappingURL=parseDate.js.map