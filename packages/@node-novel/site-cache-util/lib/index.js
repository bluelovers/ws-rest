"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.lazyRun = exports.lazyImport = exports.consoleDebug = exports.console = exports.path = void 0;
const tslib_1 = require("tslib");
const upath2_1 = tslib_1.__importDefault(require("upath2"));
exports.path = upath2_1.default;
const bluebird_1 = tslib_1.__importDefault(require("bluebird"));
const ci_1 = tslib_1.__importDefault(require("./ci"));
if ((0, ci_1.default)()) {
    process.env.FORCE_COLOR = process.env.FORCE_COLOR || '1';
}
const debug_1 = require("restful-decorator/lib/util/debug");
Object.defineProperty(exports, "console", { enumerable: true, get: function () { return debug_1.console; } });
Object.defineProperty(exports, "consoleDebug", { enumerable: true, get: function () { return debug_1.consoleDebug; } });
require("./moment");
const free_gc_1 = require("free-gc");
debug_1.console.enabledColor = true;
debug_1.consoleDebug.enabledColor = true;
if ((0, ci_1.default)()) {
    //consoleDebug.enabled = false;
    let o = debug_1.consoleDebug.inspectOptions || {};
    o.colors = true;
    debug_1.consoleDebug.inspectOptions = o;
    let o2 = debug_1.consoleDebug.chalkOptions || {};
    o2.enabled = true;
    o2.level = o2.level || 2;
    debug_1.consoleDebug.chalkOptions = o2;
}
function lazyImport(name, _require) {
    (0, free_gc_1.freeGC)();
    debug_1.consoleDebug.debug(`lazyImport`, name);
    return bluebird_1.default.resolve()
        .then(e => {
        let target = _require.resolve(name);
        debug_1.consoleDebug.debug(target);
        return Promise.resolve(`${target}`).then(s => tslib_1.__importStar(require(s)));
    })
        .then(v => {
        (0, free_gc_1.freeGC)();
        return v.default;
    });
}
exports.lazyImport = lazyImport;
function lazyRun(cb, options) {
    let { pkgLabel } = options;
    let bool = upath2_1.default.isAbsolute(pkgLabel);
    if (bool) {
        debug_1.consoleDebug.magenta.info(`[lazyRun:start]`, pkgLabel);
    }
    else {
        debug_1.consoleDebug.black.bgGreenBright.info(`[lazyRun:start]`, pkgLabel);
    }
    (0, free_gc_1.freeGC)();
    return bluebird_1.default.resolve().then(cb)
        .tap(async (v) => {
        if (bool) {
            debug_1.consoleDebug.yellow.info(`[lazyRun:end]`, pkgLabel);
        }
        else {
            debug_1.consoleDebug.black.bgYellowBright.info(`[lazyRun:end]`, pkgLabel);
        }
        (0, free_gc_1.freeGC)();
    });
}
exports.lazyRun = lazyRun;
//# sourceMappingURL=index.js.map