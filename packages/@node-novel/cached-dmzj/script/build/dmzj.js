"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const fs_extra_1 = require("fs-extra");
const path_1 = (0, tslib_1.__importDefault)(require("path"));
const bluebird_1 = (0, tslib_1.__importDefault)(require("bluebird"));
const util_1 = require("../util");
const index_1 = require("@node-novel/site-cache-util/lib/index");
const files_1 = (0, tslib_1.__importDefault)(require("../util/files"));
exports.default = (0, index_1.lazyRun)(async () => {
    var _a, _b;
    const { api, saveCache } = await (0, util_1.getDmzjClient)();
    const file = files_1.default.recentUpdate;
    const file2 = files_1.default.task001;
    let novelList = await (0, fs_extra_1.readJSON)(file)
        .catch(e => null);
    const taskList = await ((0, fs_extra_1.readJSON)(file2)
        .catch(e => { })) || {};
    let n = Infinity;
    let old_len = ((_a = novelList === null || novelList === void 0 ? void 0 : novelList.list) === null || _a === void 0 ? void 0 : _a.length) | 0 || 0;
    if (((_b = novelList === null || novelList === void 0 ? void 0 : novelList.list) === null || _b === void 0 ? void 0 : _b.length) > 20 * 10) {
        n = 10;
    }
    util_1.consoleDebug.info(`novelRecentUpdateAll`, n);
    await api.novelRecentUpdateAll(0, n, {
        delay: 3000,
    })
        .then(async (data) => {
        if (data == null) {
            return novelList;
        }
        else if (novelList != null && (novelList.last_update_time != data.last_update_time || novelList.list.length != data.list.length)) {
            let ls = await bluebird_1.default
                .resolve(data.list || [])
                .reduce((a, v) => {
                a[v.id] = v;
                return a;
            }, {});
            novelList.list
                .forEach(v => {
                if (!(v.id in ls)) {
                    data.list.push(v);
                }
            });
        }
        return data;
    })
        .tap(async (data) => {
        data.list = await bluebird_1.default
            .resolve(data.list)
            .map(async (v) => {
            if (taskList[v.id] > v.last_update_time) {
                let _file = path_1.default.join(util_1.__root, 'data', 'novel/info', `${v.id}.json`);
                let json = await (0, fs_extra_1.readJSON)(_file).catch(e => null);
                if (json && json.last_update_time == taskList[v.id]) {
                    Object
                        .keys(v)
                        .forEach((k) => {
                        if (k in json) {
                            // @ts-ignore
                            v[k] = json[k];
                        }
                    });
                    return v;
                }
            }
            if (!taskList[v.id] || taskList[v.id] != v.last_update_time) {
                util_1.consoleDebug.debug(`taskList:add`, v.id, taskList[v.id], 'vs', v.last_update_time, v.name);
                taskList[v.id] = 0;
            }
            return v;
        });
    })
        .tap((data) => {
        data.list.sort((a, b) => {
            return b.id - a.id;
        });
        novelList = novelList || {};
        data.end = Math.max(data.end | 0, novelList.end | 0);
        data.last_update_time = Math.max(data.last_update_time | 0, novelList.last_update_time | 0);
        let length = data.list.length;
        util_1.consoleDebug.dir({
            length,
            add: length - old_len,
        });
        return bluebird_1.default.all([
            (0, fs_extra_1.outputJSON)(file, data, {
                spaces: 2,
            }),
            (0, fs_extra_1.outputJSON)(file2, taskList, {
                spaces: 2,
            }),
        ]);
    });
}, {
    pkgLabel: __filename
});
//# sourceMappingURL=dmzj.js.map