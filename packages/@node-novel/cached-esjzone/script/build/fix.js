"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
/**
 * Created by user on 2019/11/24.
 */
const fs_extra_1 = require("fs-extra");
const files_1 = (0, tslib_1.__importDefault)(require("../util/files"));
const bluebird_1 = (0, tslib_1.__importDefault)(require("bluebird"));
const util_1 = require("../util");
const index_1 = require("@node-novel/site-cache-util/lib/index");
const orderBy_1 = (0, tslib_1.__importDefault)(require("lodash/orderBy"));
const bluebird_2 = (0, tslib_1.__importDefault)(require("@bluelovers/fast-glob/bluebird"));
const path_1 = require("path");
const path_2 = require("path");
const fs_1 = require("@node-novel/site-cache-util/lib/fs");
const upath2_1 = require("upath2");
const site_1 = require("esjzone-api/lib/util/site");
exports.default = (0, index_1.lazyRun)(async () => {
    const { api, saveCache } = await (0, util_1.getApiClient)();
    let recentUpdate = await (0, fs_extra_1.readJSON)(files_1.default.recentUpdate);
    let listCache = await (0, fs_extra_1.readJSON)(files_1.default.task001).catch(e => {
        return {};
    });
    let recentUpdateDayOld = await (0, fs_extra_1.readJSON)(files_1.default.recentUpdateDay).catch(e => null);
    let recentUpdateDay = await api.recentUpdateDay();
    let ids = [];
    if (recentUpdateDayOld && recentUpdateDayOld.data && recentUpdateDayOld.summary) {
        Object.entries(recentUpdateDay.data)
            .forEach(([t, list]) => {
            let old = recentUpdateDayOld.data[t];
            if (old) {
                // @ts-ignore
                let ls = list.concat(old);
                ls = Object.values(ls.reduce((a, v) => {
                    if (!a[v.id]) {
                        a[v.id] = v;
                    }
                    return a;
                }, {}));
                recentUpdateDay.data[t] = (0, orderBy_1.default)(ls, ["id"], ["asc"]);
            }
        });
        recentUpdateDay.summary = Object.entries(recentUpdateDay.summary)
            .reduce((a, [k, v]) => {
            let old = recentUpdateDayOld.summary[k];
            if (old && old > v) {
                v = old;
            }
            a[k] = v;
            return a;
        }, {});
    }
    Object.entries(recentUpdateDay.summary)
        .forEach(([id, timestamp]) => {
        if (typeof listCache[id] === 'undefined') {
            ids.push(id);
        }
        if (listCache[id] != timestamp) {
            listCache[id] = null;
        }
    });
    await bluebird_1.default.all([
        (0, fs_extra_1.writeJSON)(files_1.default.recentUpdateDay, recentUpdateDay, {
            spaces: 2,
        }),
        (0, fs_extra_1.writeJSON)(files_1.default.task001, listCache, {
            spaces: 2,
        }),
    ]);
    await bluebird_2.default.async([
        '*.json',
    ], {
        cwd: (0, path_1.join)((0, path_2.dirname)(files_1.default.infoPack), 'info'),
        absolute: true,
    })
        .mapSeries(async (file) => {
        var _a, _b;
        let bool;
        let row = await (0, fs_extra_1.readJSON)(file);
        row.links = (_b = (_a = row.links) === null || _a === void 0 ? void 0 : _a.filter) === null || _b === void 0 ? void 0 : _b.call(_a, item => {
            var _a;
            if ('name' in item && !((_a = item.name) === null || _a === void 0 ? void 0 : _a.length)) {
                delete item.name;
                bool = true;
            }
            if (!item.href.length || item.href === 'https://www.esjzone.cc/tags//') {
                bool = true;
                return false;
            }
            return true;
        });
        if (row.cover !== (row.cover = (0, site_1._fixCoverUrl)(row.cover))) {
            bool = true;
        }
        if (bool) {
            util_1.consoleDebug.success(`fix`, (0, upath2_1.basename)(file), row.name);
            return (0, fs_1.outputJSONLazy)(file, row);
        }
        else {
            util_1.consoleDebug.gray.info(`checked`, (0, upath2_1.basename)(file), row.name);
        }
    });
}, {
    pkgLabel: __filename,
});
//# sourceMappingURL=fix.js.map