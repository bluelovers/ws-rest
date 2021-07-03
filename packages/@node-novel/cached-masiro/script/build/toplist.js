"use strict";
/**
 * Created by user on 2019/7/7.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const fs_extra_1 = require("fs-extra");
const bluebird_1 = (0, tslib_1.__importDefault)(require("bluebird"));
const util_1 = require("../util");
const array_hyper_unique_1 = require("array-hyper-unique");
const files_1 = (0, tslib_1.__importDefault)(require("../util/files"));
const fs_1 = require("@node-novel/site-cache-util/lib/fs");
const index_1 = require("@node-novel/site-cache-util/lib/index");
const lib_1 = require("@bluelovers/axios-util/lib");
exports.default = (0, index_1.lazyRun)(async () => {
    const { api, saveCache } = await (0, util_1.getApiClient)();
    let listCache = await (0, fs_extra_1.readJSON)(files_1.default.task001)
        .catch(e => ({}));
    await _fn_forums([
        36,
        162,
        164,
        165,
        316,
        317,
        69,
        321,
        324,
    ])
        .then(async (ls) => {
        let fids = ls.reduce((a, data) => {
            data.subforums.forEach(data => {
                a.push(data.fid);
            });
            return a;
        }, []);
        fids.sort((a, b) => {
            // @ts-ignore
            return b - a;
        });
        util_1.consoleDebug.debug(`[subforums]`, 'length:', fids.length);
        await _fn_forums((0, array_hyper_unique_1.array_unique)(fids))
            .tap(async (ls2) => {
            ls.push(...ls2);
        });
        return ls;
    });
    function _fn_forums(fids) {
        return bluebird_1.default.resolve(fids)
            .mapSeries(async (fid) => {
            util_1.consoleDebug.gray.debug(`[forum:start]`, fid, listCache[fid]);
            let data = await api.forum({
                fid,
            })
                .finally(function () {
                if (!(0, lib_1.isResponseFromAxiosCache)(this.$response)) {
                    util_1.consoleDebug.debug(`[forum:fetch]`, fid);
                }
            });
            let old = listCache[fid];
            if (listCache[fid] == null) {
                listCache[fid] = null;
            }
            if (data.last_thread_time && data.last_thread_time > listCache[fid]) {
                listCache[fid] = null;
            }
            else if (!data.last_thread_time && data.subforums.length) {
                listCache[fid] = null;
            }
            if (old !== listCache[fid]) {
                util_1.consoleDebug.magenta.info(`[update]`, fid, data.forum_name);
            }
            //await fs.outputJSON(path.join(__root, 'data/fid', `${fid}.json`), data, outputJSONOptions);
            return data;
        });
    }
    await (0, fs_1.outputJSONLazy)(files_1.default.task001, listCache);
}, {
    pkgLabel: __filename
});
//# sourceMappingURL=toplist.js.map