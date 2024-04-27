"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dotValue = dotValue;
exports.isAxiosStatic = isAxiosStatic;
exports.isAxiosError = isAxiosError;
exports.isResponseFromAxiosCache = isResponseFromAxiosCache;
exports.getResponseUrl = getResponseUrl;
exports.getResponseRedirects = getResponseRedirects;
exports.getAxiosErrorResponseData = getAxiosErrorResponseData;
const tslib_1 = require("tslib");
const get_value_1 = tslib_1.__importDefault(require("get-value"));
function dotValue(...argv) {
    return (0, get_value_1.default)(...argv);
}
function isAxiosStatic(axios) {
    let tmp = axios;
    return (typeof tmp.create === 'function') && (typeof tmp.request === 'function') && (typeof tmp.all === 'function') && (typeof tmp.spread === 'function');
}
function isAxiosError(err) {
    let e = err;
    return (err instanceof Error) && e.config && (e.request || e.response);
}
/**
 * @see https://github.com/RasCarlito/axios-cache-adapter
 */
function isResponseFromAxiosCache(rp) {
    return dotValue(rp, 'request.fromCache');
}
function getResponseUrl(rp) {
    return dotValue(rp, 'request.res.responseUrl');
}
function getResponseRedirects(rp) {
    return dotValue(rp, 'request.res.redirects');
}
function getAxiosErrorResponseData(err) {
    return dotValue(err, 'response.data');
}
exports.default = dotValue;
//# sourceMappingURL=index.js.map