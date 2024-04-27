"use strict";
/**
 * Created by user on 2019/7/7.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.__root = exports.console = exports.consoleDebug = void 0;
exports.getApiClient = getApiClient;
exports.trim = trim;
const tslib_1 = require("tslib");
const index_1 = tslib_1.__importDefault(require("lhscan-api/lib/index"));
const lib_1 = require("@node-novel/site-cache-util/lib");
Object.defineProperty(exports, "console", { enumerable: true, get: function () { return lib_1.console; } });
Object.defineProperty(exports, "consoleDebug", { enumerable: true, get: function () { return lib_1.consoleDebug; } });
const files_1 = require("./util/files");
Object.defineProperty(exports, "__root", { enumerable: true, get: function () { return files_1.__root; } });
const client_1 = require("@node-novel/site-cache-util/lib/client");
let api;
let saveCache;
let jar;
async function getApiClient() {
    ({ api, saveCache, jar } = await (0, client_1._getApiClient)({
        api,
        saveCache,
        ApiClient: index_1.default,
        __path: files_1.__path,
        jar,
        envPrefix: 'LHSCAN',
        apiOptions: {
            cache: {
                maxAge: 24 * 60 * 60 * 1000,
            },
        }
    }));
    return {
        api,
        saveCache,
    };
}
function trim(input) {
    return input
        .replace(/^\s+|\s+$/gu, '')
        .replace(/\r|\n|[\u00A0]/gu, ' ')
        .replace(/\s+/gu, ' ')
        .trim();
}
//# sourceMappingURL=util.js.map