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
exports.lazyRun = exports.lazyImport = exports.consoleDebug = exports.console = exports.path = void 0;
const upath2_1 = __importDefault(require("upath2"));
exports.path = upath2_1.default;
const bluebird_1 = __importDefault(require("bluebird"));
const ci_1 = __importDefault(require("./ci"));
if (ci_1.default()) {
    process.env.FORCE_COLOR = process.env.FORCE_COLOR || '1';
}
const debug_1 = require("restful-decorator/lib/util/debug");
Object.defineProperty(exports, "console", { enumerable: true, get: function () { return debug_1.console; } });
Object.defineProperty(exports, "consoleDebug", { enumerable: true, get: function () { return debug_1.consoleDebug; } });
require("./moment");
debug_1.console.enabledColor = true;
debug_1.consoleDebug.enabledColor = true;
if (ci_1.default()) {
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
    debug_1.consoleDebug.debug(`lazyImport`, name);
    return bluebird_1.default.resolve()
        .then(e => {
        let target = _require.resolve(name);
        debug_1.consoleDebug.debug(target);
        return Promise.resolve().then(() => __importStar(require(target)));
    })
        .then(v => v.default);
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
    return bluebird_1.default.resolve().then(cb)
        .tap(async (v) => {
        if (bool) {
            debug_1.consoleDebug.yellow.info(`[lazyRun:end]`, pkgLabel);
        }
        else {
            debug_1.consoleDebug.black.bgYellowBright.info(`[lazyRun:end]`, pkgLabel);
        }
    });
}
exports.lazyRun = lazyRun;
//# sourceMappingURL=index.js.map