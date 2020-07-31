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
const util_1 = require("../util");
const fs_extra_1 = require("fs-extra");
const bluebird_1 = __importDefault(require("bluebird"));
const moment_1 = require("@node-novel/site-cache-util/lib/moment");
const files_1 = __importStar(require("../util/files"));
const lib_1 = require("@bluelovers/axios-util/lib");
const fs_1 = require("@node-novel/site-cache-util/lib/fs");
const util_2 = require("discuz-api/lib/util");
const index_1 = require("@node-novel/site-cache-util/lib/index");
const getThreads_1 = __importDefault(require("../util/getThreads"));
exports.default = index_1.lazyRun(async () => {
    const { api, saveCache } = await util_1.getApiClient();
    let listCache = await fs_extra_1.readJSON(files_1.default.task001)
        .catch(e => ({}));
    let index = 1;
    let boolCache;
    await bluebird_1.default
        .resolve(Object.entries(listCache))
        .mapSeries(async (row) => {
        let [fid, last_update_time] = row;
        if (listCache[fid] == null) {
            let _file = files_1.cacheFileInfoPath(fid);
            return getThreads_1.default(api, {
                fid
            }, {
                cacheFileInfoPath: files_1.cacheFileInfoPath,
            })
                .tap(async (data) => {
                listCache[fid] = Math.max(data.last_thread_time | 0, last_update_time | 0, 0);
                let thread_subject = util_2._getForumLastThreadSubject(data).thread_subject_full;
                if (data.last_thread_id) {
                    let thread;
                    data.threads.some(v => {
                        if (v.tid == data.last_thread_id) {
                            thread = v;
                            return true;
                        }
                    });
                    if (thread && thread.typeid) {
                        thread_subject = data.thread_types[thread.typeid] + ' ' + thread_subject;
                    }
                }
                util_1.consoleDebug.info(index, fid, data.forum_name, moment_1.moment.unix(listCache[fid]).format(), thread_subject, 'threads:', data.threads.length);
                index++;
                return bluebird_1.default.all([
                    fs_1.outputJSONLazy(_file, data),
                ]);
            })
                .tap(async function (r) {
                if (boolCache != false) {
                    // @ts-ignore
                    boolCache = lib_1.isResponseFromAxiosCache(this.$response);
                }
                if (!boolCache) {
                    if ((index % 10) == 0) {
                        await _saveDataCache();
                        boolCache = null;
                    }
                    if ((index % 100) == 0) {
                        await saveCache();
                        boolCache = null;
                    }
                    await bluebird_1.default.delay(3000);
                }
            });
        }
        else {
            //consoleDebug.gray.debug(`[SKIP]`, fid, moment.unix(last_update_time).format());
        }
    })
        .catch(e => util_1.console.error(e));
    await _saveDataCache();
    await saveCache();
    function _saveDataCache() {
        return bluebird_1.default.all([
            fs_1.outputJSONLazy(files_1.default.task001, listCache, {
                spaces: 2,
            })
                .then(e => {
                util_1.consoleDebug.info(`outputJSON`, files_1.__path.relative(files_1.default.task001));
                return e;
            }),
        ]);
    }
}, {
    pkgLabel: __filename
});
//# sourceMappingURL=task001.js.map