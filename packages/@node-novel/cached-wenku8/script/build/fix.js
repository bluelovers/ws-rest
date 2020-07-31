"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Created by user on 2019/11/24.
 */
const fs_extra_1 = require("fs-extra");
const files_1 = __importStar(require("../util/files"));
const bluebird_1 = __importDefault(require("bluebird"));
const util_1 = require("../util");
const index_1 = require("@node-novel/site-cache-util/lib/index");
exports.default = index_1.lazyRun(async () => {
    let recentUpdate = await fs_extra_1.readJSON(files_1.default.recentUpdate);
    let task001 = await fs_extra_1.readJSON(files_1.default.task001);
    let max_last_update_time = recentUpdate.last_update_time;
    await bluebird_1.default
        .resolve(recentUpdate.data)
        .each(async (row) => {
        let { last_update_time, id, cid, last_update_chapter_name } = row;
        let _file = files_1.cacheFileInfoPath(id);
        let info = await fs_extra_1.readJSON(_file).catch(e => null);
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
            await fs_extra_1.writeJSON(_file, info, {
                spaces: 2,
            });
        }
    });
    await fs_extra_1.writeJSON(files_1.default.recentUpdate, recentUpdate, {
        spaces: 2,
    });
    await fs_extra_1.writeJSON(files_1.default.task001, task001, {
        spaces: 2,
    });
}, {
    pkgLabel: __filename
});
//# sourceMappingURL=fix.js.map