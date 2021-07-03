"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAxiosErrorResponseData = exports.getResponseRedirects = exports.getResponseUrl = exports.isResponseFromAxiosCache = exports.isAxiosError = exports.isAxiosStatic = exports.dotValue = void 0;
const tslib_1 = require("tslib");
const get_value_1 = (0, tslib_1.__importDefault)(require("get-value"));
function dotValue(...argv) {
    return (0, get_value_1.default)(...argv);
}
exports.dotValue = dotValue;
function isAxiosStatic(axios) {
    let tmp = axios;
    return (typeof tmp.create === 'function') && (typeof tmp.request === 'function') && (typeof tmp.all === 'function') && (typeof tmp.spread === 'function');
}
exports.isAxiosStatic = isAxiosStatic;
function isAxiosError(err) {
    let e = err;
    return (err instanceof Error) && e.config && (e.request || e.response);
}
exports.isAxiosError = isAxiosError;
/**
 * @see https://github.com/RasCarlito/axios-cache-adapter
 */
function isResponseFromAxiosCache(rp) {
    return dotValue(rp, 'request.fromCache');
}
exports.isResponseFromAxiosCache = isResponseFromAxiosCache;
function getResponseUrl(rp) {
    return dotValue(rp, 'request.res.responseUrl');
}
exports.getResponseUrl = getResponseUrl;
function getResponseRedirects(rp) {
    return dotValue(rp, 'request.res.redirects');
}
exports.getResponseRedirects = getResponseRedirects;
function getAxiosErrorResponseData(err) {
    return dotValue(err, 'response.data');
}
exports.getAxiosErrorResponseData = getAxiosErrorResponseData;
exports.default = dotValue;
//# sourceMappingURL=index.js.map