"use strict";
/**
 * Created by user on 2019/6/11.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.defaultFilter = exports.processExitHook = exports.exportCache = exports.importCache = void 0;
const tslib_1 = require("tslib");
const bluebird_1 = (0, tslib_1.__importDefault)(require("bluebird"));
function importCache(store, json, options) {
    const { importFilter = defaultFilter } = options || {};
    return bluebird_1.default
        .resolve(Object.entries(json))
        .each(([k, v]) => {
        let r = importFilter && importFilter(k, v);
        if (r || r == null) {
            if (r && typeof r === 'object') {
                v = r;
            }
            store.setItem(k, v);
        }
    })
        .thenReturn(store);
}
exports.importCache = importCache;
function exportCache(store, options) {
    if (typeof options === 'function') {
        options = {
            exportCb: options,
        };
    }
    const json = {};
    let { exportFilter = defaultFilter, exportCb } = options || {};
    if (!exportCb) {
        exportCb = () => json;
    }
    return store
        .iterate(function (value, key) {
        if (typeof value === 'string') {
            try {
                value = JSON.parse(value);
            }
            catch (e) {
            }
        }
        let r = exportFilter && exportFilter(key, value);
        if (r || r == null) {
            if (r && typeof r === 'object') {
                value = r;
            }
            json[key] = value;
        }
    })
        .then(r => exportCb(json));
}
exports.exportCache = exportCache;
/**
 * hook fn to process exit, return a fn for cancel
 * when process exit, can't take too many async , so if can try use sync
 */
function processExitHook(fn) {
    // @ts-ignore
    process.on('exit', fn);
    return () => {
        // @ts-ignore
        process.off('exit', fn);
    };
}
exports.processExitHook = processExitHook;
function defaultFilter(k, v) {
    const { status } = v.data;
    return status != 500 && status != 302 && status != 400;
}
exports.defaultFilter = defaultFilter;
exports.default = {
    importCache,
    exportCache,
};
//# sourceMappingURL=index.js.map