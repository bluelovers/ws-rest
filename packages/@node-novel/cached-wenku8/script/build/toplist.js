"use strict";
/**
 * Created by user on 2019/7/7.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const fs_extra_1 = (0, tslib_1.__importDefault)(require("fs-extra"));
const util_1 = require("../util");
const index_1 = require("@node-novel/site-cache-util/lib/index");
const files_1 = (0, tslib_1.__importDefault)(require("../util/files"));
const free_gc_1 = require("free-gc");
exports.default = (0, index_1.lazyRun)(async () => {
    const { api, saveCache } = await (0, util_1.getApiClient)();
    const file = files_1.default.recentUpdate;
    let novelList = await fs_extra_1.default.readJSON(file)
        .catch(e => null);
    let page = 0;
    let pageTo = 0;
    let maxPage = novelList && novelList.end || 0;
    let API_METHOD = 'articleToplist';
    //API_METHOD = 'articleList';
    let data = await api[API_METHOD](++page);
    maxPage = data.end;
    let pageFrom = data.page;
    let { last_update_time } = data;
    let lastPage = page;
    let ids = [];
    let list = data.data.slice();
    list.forEach(row => {
        ids.push(row.id);
    });
    let _do = true;
    while (_do) {
        lastPage = page++;
        util_1.consoleDebug.debug('page:', page);
        let ret = await api[API_METHOD](page)
            .tap(data => {
            last_update_time = Math.max(last_update_time, data.last_update_time);
            page = data.page;
            data.data.forEach(row => {
                if (!ids.includes(row.id)) {
                    ids.push(row.id);
                    list.push(row);
                }
            });
        })
            .catch(e => null);
        (0, free_gc_1.freeGC)();
        if (!ret || lastPage == page || page == maxPage) {
            util_1.console.dir({
                ret,
                page,
                lastPage,
                maxPage,
            });
            _do = false;
            break;
        }
        if ((page - pageFrom) >= 5) {
            _do = false;
        }
    }
    let dataNewList = (novelList && novelList.data || [])
        .concat(list)
        .reduce((list, row) => {
        let old = list[row.id];
        if (!old || row.last_update_time > old.last_update_time) {
            list[row.id] = row;
        }
        last_update_time = Math.max(last_update_time, row.last_update_time);
        return list;
    }, {});
    let listNew = Object
        .values(dataNewList)
        .sort((a, b) => {
        //return b.last_update_time - a.last_update_time
        // @ts-ignore
        return b.id - a.id;
    });
    let dataNew = {
        from: pageFrom,
        to: page,
        end: maxPage,
        last_update_time,
        size: listNew.length,
        data: listNew,
    };
    await fs_extra_1.default.outputJSON(file, dataNew, {
        spaces: 2,
    });
}, {
    pkgLabel: __filename
});
//# sourceMappingURL=toplist.js.map