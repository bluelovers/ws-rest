"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchCache = void 0;
const tslib_1 = require("tslib");
const fs_extra_1 = require("fs-extra");
const cross_fetch_1 = (0, tslib_1.__importDefault)(require("cross-fetch"));
const bluebird_1 = (0, tslib_1.__importDefault)(require("bluebird"));
function fetchCache(url, file) {
    return bluebird_1.default.resolve()
        .then(e => {
        /*
        axios.get( url, {
            responseType: 'json',
            timeout: 1000,
            raxConfig: {
                retry: 1,
                noResponseRetries: 1,
            },
        })
        then(r => r.data)
         */
        return (0, cross_fetch_1.default)(url, {
            // @ts-ignore
            timeout: 1000,
        })
            .then(async (r) => {
            if (r.status >= 400) {
                return Promise.reject();
            }
            return r.json();
        });
    })
        .timeout(5 * 1000)
        .then(async (data) => {
        await (0, fs_extra_1.outputJSON)(file, data, {
            spaces: 0,
        });
        return data;
    });
}
exports.fetchCache = fetchCache;
exports.default = fetchCache;
//# sourceMappingURL=fetch.js.map