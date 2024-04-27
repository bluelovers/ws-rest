"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildCachedByDate = buildCachedByDate;
const tslib_1 = require("tslib");
const path_1 = require("path");
const __root_1 = require("../../__root");
const bluebird_1 = tslib_1.__importDefault(require("bluebird"));
const moment_1 = require("../../util/moment");
const fs_1 = require("../../util/fs");
function buildCachedByDate(list) {
    let recordDays = {};
    let recordWeeks = {};
    let recordMonths = {};
    let recordUndefined = {};
    let len = {
        days: 0,
        weeks: 0,
        months: 0,
    };
    let max = {
        days: 30,
        weeks: 7,
        months: 0,
    };
    list
        .forEach(item => {
        let { updated = 0, uuid } = item;
        if (updated) {
            let m = (0, moment_1.createMomentByMilliseconds)(updated);
            let ud = m.clone()
                .startOf('day')
                //.unix()
                .valueOf();
            let uw = m.clone()
                .startOf('week')
                //.unix()
                .valueOf();
            let um = m.clone()
                .startOf('month')
                //.unix()
                .valueOf();
            if (len.days <= max.days && !(ud in recordDays)) {
                len.days++;
                console.log(`recordDays`.padEnd(13, ' '), String(len.days).padStart(3, ' '), ud, (0, moment_1.createMomentByMilliseconds)(ud).format());
            }
            if (len.weeks <= max.weeks && !(uw in recordWeeks)) {
                len.weeks++;
                console.log(`recordWeeks`.padEnd(13, ' '), String(len.weeks).padStart(3, ' '), uw, (0, moment_1.createMomentByMilliseconds)(uw).format());
            }
            if (len.days <= max.days) {
                recordDays[ud] = recordDays[ud] || [];
                recordDays[ud].push(uuid);
            }
            if (len.weeks <= max.weeks) {
                recordWeeks[uw] = recordWeeks[uw] || [];
                recordWeeks[uw].push(uuid);
            }
            if (!(um in recordMonths)) {
                len.months++;
                console.log(`recordMonths`.padEnd(13, ' '), String(len.months).padStart(3, ' '), um, (0, moment_1.createMomentByMilliseconds)(um).format());
            }
            recordMonths[um] = recordMonths[um] || [];
            recordMonths[um].push(uuid);
        }
        else {
            recordUndefined[0] = recordUndefined[0] || [];
            recordUndefined[0].push(uuid);
        }
    });
    return bluebird_1.default.all([
        (0, fs_1.outputJSONWithIndent)((0, path_1.join)(__root_1.__rootCache, 'preset', `date_days.json`), recordDays),
        (0, fs_1.outputJSONWithIndent)((0, path_1.join)(__root_1.__rootCache, 'preset', `date_weeks.json`), recordWeeks),
        (0, fs_1.outputJSONWithIndent)((0, path_1.join)(__root_1.__rootCache, 'preset', `date_months.json`), recordMonths),
        (0, fs_1.outputJSONWithIndent)((0, path_1.join)(__root_1.__rootCache, 'preset', `date_undefined.json`), recordUndefined),
    ]);
}
exports.default = buildCachedByDate;
//# sourceMappingURL=byDate.js.map