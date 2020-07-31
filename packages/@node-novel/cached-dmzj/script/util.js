"use strict";
/**
 * Created by user on 2019/7/7.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.trim = exports.getDmzjClient = exports.getApiClient = exports.__root = exports.console = exports.consoleDebug = void 0;
const dmzj_api_1 = require("dmzj-api");
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
    ({ api, saveCache, jar } = await client_1._getApiClient({
        api,
        saveCache,
        ApiClient: dmzj_api_1.DmzjClient,
        __path: files_1.__path,
        jar,
        envPrefix: 'DMZJ',
        apiOptions: {
            cache: {
                maxAge: 25 * 60 * 60 * 1000,
            },
        }
    }));
    return {
        api,
        saveCache,
    };
}
exports.getApiClient = getApiClient;
exports.getDmzjClient = getApiClient;
function trim(input) {
    return input
        .replace(/^\s+|\s+$/gu, '')
        .replace(/\r|\n|[\u00A0]/gu, ' ')
        .replace(/\s+/gu, ' ')
        .trim();
}
exports.trim = trim;
//# sourceMappingURL=util.js.map