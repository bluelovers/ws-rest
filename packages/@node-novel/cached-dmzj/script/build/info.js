"use strict";
/**
 * Created by user on 2019/7/28.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const util_1 = require("../util");
const upath2_1 = tslib_1.__importDefault(require("upath2"));
const fs_extra_1 = require("fs-extra");
const bluebird_1 = tslib_1.__importDefault(require("bluebird"));
const moment_1 = require("@node-novel/site-cache-util/lib/moment");
const symbol_1 = require("restful-decorator/lib/helper/symbol");
const axios_util_1 = require("@bluelovers/axios-util");
const index_1 = require("@node-novel/site-cache-util/lib/index");
const files_1 = tslib_1.__importDefault(require("../util/files"));
const free_gc_1 = require("free-gc");
exports.default = (0, index_1.lazyRun)(async () => {
    const { api, saveCache } = await (0, util_1.getDmzjClient)();
    const file = files_1.default.recentUpdate;
    const file2 = files_1.default.task001;
    let novelList = await (0, fs_extra_1.readJSON)(file)
        .catch(e => null);
    const taskList = await ((0, fs_extra_1.readJSON)(file2)
        .catch(e => { })) || {};
    const updatedList = {};
    let jjj = 0;
    let delay_i = 0;
    let _do = true;
    await bluebird_1.default
        .resolve(novelList.list)
        .filter(v => !taskList[v.id])
        .tap(list => {
        util_1.consoleDebug.info(`發現`, list.length, `個小說待處理`);
    })
        .mapSeries(async (v, index, length) => {
        if (_do && !taskList[v.id]) {
            (0, free_gc_1.freeGC)();
            let fromCache;
            util_1.consoleDebug.debug(`novelInfoWithChapters`, v.id, v.name);
            let info = await api.novelInfoWithChapters(v.id)
                .catch((e) => {
                _do = false;
                util_1.consoleDebug.error(v.id, v.name, e.message);
                util_1.console.dir(e.request);
                util_1.console.dir(e.config);
                return null;
            })
                .tap(function (data) {
                if ((0, axios_util_1.isResponseFromAxiosCache)(data[symbol_1.SymSelf].$response) || (0, axios_util_1.isResponseFromAxiosCache)(this.$response)) {
                    fromCache = true;
                }
            });
            if (info && info.id == v.id) {
                (fromCache ? util_1.consoleDebug.gray : util_1.consoleDebug).success('[' + String(++jjj)
                    .padStart(4, '0') + '/' + String(length)
                    .padStart(4, '0') + ']', v.id, (0, util_1.trim)(v.name), moment_1.moment.unix(v.last_update_time)
                    .format(), (0, util_1.trim)(v.last_update_volume_name), (0, util_1.trim)(v.last_update_chapter_name));
                let _file = upath2_1.default.join(util_1.__root, 'data', 'novel/info', `${v.id}.json`);
                await (0, fs_extra_1.outputJSON)(_file, info, {
                    spaces: 2,
                });
                updatedList[v.id] = info;
                taskList[v.id] = Math.max(v.last_update_time, info.last_update_time);
                if (!fromCache) {
                    if (!(index % 5)) {
                        await _saveCache();
                    }
                    else {
                        await _saveCacheTaskList();
                    }
                    //let delay = Math.min(10000 + Math.min(index, 15) * 1000 * Math.random(), 20 * 1000);
                    let delay = Math.min(Math.min(++delay_i, 15) * 1000 * Math.random(), 5 * 1000);
                    util_1.consoleDebug.debug(`delay:`, delay);
                    await bluebird_1.default.delay(delay);
                }
            }
            else {
                _do = false;
            }
        }
    })
        .catch(e => null)
        .tap(v => {
        util_1.consoleDebug.info(`結束抓取小說資料`);
    });
    await bluebird_1.default
        .resolve(Object.entries(updatedList))
        .each(([novel_id, v]) => {
        util_1.console.info(novel_id.toString().padStart(4, '0'), (0, util_1.trim)(v.name), moment_1.moment.unix(v.last_update_time)
            .format(), (0, util_1.trim)(v.last_update_volume_name), (0, util_1.trim)(v.last_update_chapter_name));
    })
        .tap(ls => {
        util_1.console.info(`本次總共更新`, ls.length);
    });
    await _saveCache();
    function _saveCacheTaskList() {
        return (0, fs_extra_1.outputJSON)(file2, taskList, {
            spaces: 2,
        });
    }
    function _saveCache() {
        return Promise.all([
            _saveCacheTaskList(),
            saveCache(),
        ]);
    }
}, {
    pkgLabel: __filename
});
//# sourceMappingURL=info.js.map