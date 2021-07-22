"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("@node-novel/site-cache-util/lib/index");
const util_1 = require("../util");
const files_1 = require("../util/files");
const fs_extra_1 = require("fs-extra");
const fs_1 = require("@node-novel/site-cache-util/lib/fs");
exports.default = (0, index_1.lazyRun)(async () => {
    const { api, saveCache } = await (0, util_1.getApiClient)();
    const file_recentUpdate = files_1.cacheFilePaths.recentUpdate;
    const file_task001 = files_1.cacheFilePaths.task001;
    let recentUpdateList = await (0, fs_extra_1.readJSON)(file_recentUpdate).catch(e => null);
    let cacheTask001 = await (0, fs_extra_1.readJSON)(file_task001)
        .catch(e => ({}));
    let maxPage = (recentUpdateList === null || recentUpdateList === void 0 ? void 0 : recentUpdateList.end) | 0;
    if (recentUpdateList) {
        if (recentUpdateList.end) {
            maxPage += 2;
        }
        if (maxPage > recentUpdateList.pages) {
            maxPage = Math.max(maxPage, 5);
        }
    }
    await api.recentUpdateAll({
        start: 0,
        end: maxPage,
    })
        .then(async (data) => {
        var _a;
        if ((_a = recentUpdateList === null || recentUpdateList === void 0 ? void 0 : recentUpdateList.list) === null || _a === void 0 ? void 0 : _a.length) {
            let cache = new Map();
            let list = recentUpdateList.list.concat(data.list)
                .filter(novel => {
                var _a;
                if (cache.has(novel.id)) {
                    let old = cache.get(novel.id);
                    if (((_a = old.last_update_name) === null || _a === void 0 ? void 0 : _a.length) && novel.last_update_name !== old.last_update_name) {
                        cacheTask001[novel.id] = 0;
                    }
                    return false;
                }
                cache.set(novel.id, novel);
                return true;
            });
            data.list = list;
        }
        recentUpdateList = data;
    });
    return Promise.all([
        (0, fs_1.outputJSONLazy)(file_recentUpdate, recentUpdateList),
        (0, fs_1.outputJSONLazy)(file_task001, cacheTask001),
    ]);
}, {
    pkgLabel: __filename
});
//# sourceMappingURL=get-recent-update.js.map