"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseDateStringToMoment = parseDateStringToMoment;
const moment_1 = require("@node-novel/site-cache-util/lib/moment");
function parseDateStringToMoment(dateString, format = 'YYYY-MM-DD hh:mm:ss') {
    return moment_1.moment.tz(dateString, format, 'Asia/Tokyo');
}
//# sourceMappingURL=parseDate.js.map