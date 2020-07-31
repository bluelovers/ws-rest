"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getThreadsByFid = void 0;
const fs_extra_1 = require("fs-extra");
// @ts-ignore
const deep_eql_1 = __importDefault(require("deep-eql"));
const uniqBy_1 = __importDefault(require("lodash/uniqBy"));
const util_1 = require("../util");
function getThreadsByFid(api, threadOptions, extraOptions) {
    let cacheForum;
    let cacheThreads;
    return api.forumThreads(threadOptions, {
        async next(cur, forum) {
            let oldExists;
            //consoleDebug.debug('page:', cur.page);
            if (typeof cacheForum === 'undefined') {
                cacheForum = await fs_extra_1.readJSON(extraOptions.cacheFileInfoPath(threadOptions.fid)).catch(e => null);
                if (cacheForum == null) {
                    cacheForum = null;
                }
                else {
                    cacheThreads = cacheForum.threads.reduce((a, v) => {
                        a[v.tid] = v;
                        return a;
                    }, {});
                }
            }
            else if (cacheForum === null) {
                return true;
            }
            let i = 0;
            let len = cur.threads.length;
            if (len && !cacheThreads) {
                return true;
            }
            let bool = !cur.threads.every(v => {
                let old = cacheThreads[v.tid];
                let isNotExists = typeof old === 'undefined';
                let bool = deep_eql_1.default(v, old);
                if (!bool) {
                    if (typeof oldExists === 'undefined' && isNotExists) {
                        i++;
                        bool = true;
                    }
                    //					else if (oldExists)
                    //					{
                    //						oldExists++;
                    //					}
                    else if (oldExists < 2) {
                        oldExists = 2;
                    }
                }
                //				else if (oldExists)
                //				{
                //					oldExists++
                //				}
                //				else if (typeof oldExists === 'undefined')
                //				{
                //					oldExists = 1;
                //				}
                else if (!oldExists) {
                    oldExists = 1;
                }
                if (!oldExists && !isNotExists) {
                    oldExists = 0;
                }
                //console.log(bool, oldExists);
                //				if (!bool && typeof old !== 'undefined')
                //				{
                //					console.dir({
                //						bool,
                //						old,
                //						v,
                //					})
                //				}
                return bool;
            });
            if (i === len) {
                bool = true;
            }
            if (!bool) {
                if (i > 0) {
                    util_1.consoleDebug.debug(`fid: ${forum.fid} 發現 threads 增加，但其他相同，略過檢查後續頁數 (${cur.page} / ${cur.pages})`);
                }
                else {
                    util_1.consoleDebug.debug(`fid: ${forum.fid} 沒有發現 threads 變化，略過檢查後續頁數 (${cur.page} / ${cur.pages})`);
                }
                forum.threads = uniqBy_1.default(forum.threads.concat(cacheForum.threads), 'tid');
            }
            else {
                //consoleDebug.debug(`fid: ${forum.fid} (${cur.page} / ${cur.pages})`);
            }
            return bool;
        }
    });
}
exports.getThreadsByFid = getThreadsByFid;
exports.default = getThreadsByFid;
//# sourceMappingURL=getThreads.js.map