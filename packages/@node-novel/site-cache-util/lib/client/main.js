"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports._getApiClient = void 0;
const tslib_1 = require("tslib");
const __1 = require("..");
const axios_util_1 = require("@bluelovers/axios-util");
const fs_extra_1 = require("fs-extra");
const cookies_1 = require("restful-decorator-plugin-jsdom/lib/cookies");
const ci_1 = tslib_1.__importDefault(require("../ci"));
const pass_1 = tslib_1.__importDefault(require("../pass"));
const lodash_1 = require("lodash");
const save_1 = require("./save");
const free_gc_1 = require("free-gc");
const get_http_result_url_1 = require("get-http-result-url");
async function _getApiClient(opts) {
    let { api, jar, __path, saveCache, ApiClient, apiOptions, setupCacheFile, saveCacheFileBySelf } = opts;
    const { __root, cacheFilePaths } = __path;
    if (api == null) {
        let setting = (0, lodash_1.defaultsDeep)(apiOptions || {}, {
            cache: {
                maxAge: 24 * 60 * 60 * 1000,
            },
            raxConfig: {
                retry: 1,
                retryDelay: 1000,
                onRetryAttempt: (err) => {
                    var _a;
                    (0, free_gc_1.freeGC)();
                    let currentRetryAttempt = (0, axios_util_1.dotValue)(err, 'config.raxConfig.currentRetryAttempt');
                    __1.consoleDebug.debug(`Retry attempt #${currentRetryAttempt}`, (_a = (0, get_http_result_url_1.resultToURL)(err === null || err === void 0 ? void 0 : err.response, {
                        ignoreError: true,
                    })) === null || _a === void 0 ? void 0 : _a.href);
                },
            },
            //			proxy: {
            //				host: '49.51.155.45',
            //				port: 8081,
            //			},
        });
        //consoleDebug.dir(setting);
        const cookiesCacheFile = cacheFilePaths.cookiesCacheFile;
        __1.consoleDebug.debug(`cookiesCacheFile`, cookiesCacheFile);
        if ((0, fs_extra_1.existsSync)(cookiesCacheFile)) {
            __1.consoleDebug.debug(`axios.cookies.json 已存在，嘗試載入內容`);
            api = await (0, fs_extra_1.readJSON)(cookiesCacheFile)
                .then(r => (0, cookies_1.deserializeCookieJar)(r))
                .then(_jar => {
                if (_jar) {
                    !(0, ci_1.default)() && __1.consoleDebug.debug(jar = _jar);
                    return new ApiClient({
                        ...setting,
                        jar: _jar,
                    });
                }
            })
                .catch(e => {
                __1.console.error(e);
                return null;
            });
        }
        if (!api) {
            api = new ApiClient(setting);
        }
        if (typeof api._beforeStart === 'function') {
            await api._beforeStart();
        }
        // @ts-ignore
        if (typeof api.isLogin === 'function') {
            // @ts-ignore
            let isLogin = await api.isLogin()
                .catch((e) => {
                __1.console.error(`[isLogin]`, String(e));
                return null;
            });
            __1.console.magenta.info('isLogin', isLogin);
            // @ts-ignore
            if (!isLogin && typeof api.loginByForm === 'function') {
                __1.consoleDebug.gray.info(`目前為未登入狀態，嘗試使用帳號密碼登入`);
                let { default: localPassword, DISABLE_LOGIN } = await (0, pass_1.default)({
                    file: cacheFilePaths.passwordLocalFile,
                    __root,
                    envPrefix: opts.envPrefix,
                });
                if (!localPassword) {
                    __1.consoleDebug.red.info(`帳密不存在`);
                }
                else if (DISABLE_LOGIN) {
                    __1.consoleDebug.red.info(`[DISABLE_LOGIN] 選項已啟用，忽略使用帳密登入`);
                }
                else {
                    // @ts-ignore
                    await api.loginByForm({
                        ...localPassword,
                    })
                        // @ts-ignore
                        .then(async (r) => {
                        __1.console.dir(r);
                        // @ts-ignore
                        __1.console.magenta.info('isLogin', await api.isLogin());
                    })
                        // @ts-ignore
                        .catch(e => {
                        __1.console.error(`[loginByForm]`, String(e));
                        return null;
                    });
                }
            }
        }
        if (!setupCacheFile) {
            saveCache = await (0, save_1._setupCacheFile)({
                api,
                saveCacheFileBySelf,
                __path,
            });
        }
        else {
            saveCache = await setupCacheFile(api);
        }
    }
    return {
        api, jar, saveCache,
    };
}
exports._getApiClient = _getApiClient;
//# sourceMappingURL=main.js.map