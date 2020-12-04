"use strict";
/**
 * Created by user on 2019/7/7.
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.trim = exports.getApiClient = exports.__root = exports.console = exports.consoleDebug = void 0;
const lib_1 = __importDefault(require("discuz-api/lib"));
const lib_2 = require("@node-novel/site-cache-util/lib");
Object.defineProperty(exports, "console", { enumerable: true, get: function () { return lib_2.console; } });
Object.defineProperty(exports, "consoleDebug", { enumerable: true, get: function () { return lib_2.consoleDebug; } });
const files_1 = require("./util/files");
Object.defineProperty(exports, "__root", { enumerable: true, get: function () { return files_1.__root; } });
const client_1 = require("@node-novel/site-cache-util/lib/client");
let api;
let saveCache;
let jar;
async function getApiClient() {
    let baseURL = 'https://masiro.moe/';
    ({ api, saveCache, jar } = await client_1._getApiClient({
        api,
        saveCache,
        ApiClient: lib_1.default,
        // @ts-ignore
        __path: files_1.__path,
        jar,
        envPrefix: 'MASIRO',
        apiOptions: {
            baseURL,
            //			cache: {
            //				maxAge: 24 * 60 * 60 * 1000,
            //			},
        },
    }));
    return {
        api,
        saveCache,
    };
}
exports.getApiClient = getApiClient;
function trim(input) {
    return input
        .replace(/^\s+|\s+$/gu, '')
        .replace(/\r|\n|[\u00A0]/gu, ' ')
        .replace(/\s+/gu, ' ')
        .trim();
}
exports.trim = trim;
//# sourceMappingURL=util.js.map