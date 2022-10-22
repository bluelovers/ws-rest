"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
/**
 * Created by user on 2019/11/24.
 */
const fs_extra_1 = require("fs-extra");
const files_1 = tslib_1.__importStar(require("../util/files"));
const bluebird_1 = tslib_1.__importDefault(require("bluebird"));
const util_1 = require("../util");
const index_1 = require("@node-novel/site-cache-util/lib/index");
const path_1 = tslib_1.__importDefault(require("path"));
const bluebird_2 = tslib_1.__importDefault(require("@bluelovers/fast-glob/bluebird"));
const zero_width_1 = require("zero-width");
exports.default = (0, index_1.lazyRun)(async () => {
    let recentUpdate = await (0, fs_extra_1.readJSON)(files_1.default.recentUpdate);
    let task001 = await (0, fs_extra_1.readJSON)(files_1.default.task001);
    let max_last_update_time = recentUpdate.last_update_time;
    await bluebird_1.default
        .resolve(recentUpdate.data)
        .each(async (row) => {
        let { last_update_time, id, cid, last_update_chapter_name } = row;
        let _file = (0, files_1.cacheFileInfoPath)(id);
        let info = await (0, fs_extra_1.readJSON)(_file).catch(e => null);
        if (info == null)
            return;
        let _changed = false;
        if (!info.last_update_time && !info.copyright_remove) {
            info.copyright_remove = true;
            _changed = true;
        }
        last_update_time = Math.max(last_update_time, info.last_update_time);
        if (last_update_time != info.last_update_time) {
            info.last_update_time = last_update_time;
            _changed = true;
        }
        else {
            task001[id] = last_update_time;
        }
        row.last_update_time = last_update_time;
        max_last_update_time = Math.max(max_last_update_time, last_update_time);
        if (last_update_chapter_name != info.last_update_chapter_name) {
            if (!info.last_update_chapter_name) {
                info.last_update_chapter_name = last_update_chapter_name;
                _changed = true;
            }
            if (!last_update_chapter_name) {
                row.last_update_chapter_name = last_update_chapter_name;
            }
        }
        if (_changed) {
            util_1.consoleDebug.info(`[fix]`, id, info.name);
            await (0, fs_extra_1.writeJSON)(_file, info, {
                spaces: 2,
            });
        }
    });
    await bluebird_2.default.async([
        '*.json',
    ], {
        cwd: path_1.default.join(files_1.default.dirDataRoot, 'novel/info'),
        absolute: true,
    })
        .each(async (file) => {
        let novel = await (0, fs_extra_1.readJSON)(file);
        let old = novel.desc;
        novel.desc = (0, zero_width_1.trimWithZeroWidth)(old);
        if (novel.desc !== old) {
            console.log(`fix`, novel.id, novel.name);
            return (0, fs_extra_1.writeJSON)(file, novel, {
                spaces: 2,
            });
        }
    });
    await (0, fs_extra_1.writeJSON)(files_1.default.recentUpdate, recentUpdate, {
        spaces: 2,
    });
    await (0, fs_extra_1.writeJSON)(files_1.default.task001, task001, {
        spaces: 2,
    });
}, {
    pkgLabel: __filename
});
//# sourceMappingURL=fix.js.map