"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAxiosErrorResponseData = exports.getResponseRedirects = exports.getResponseUrl = exports.isResponseFromAxiosCache = exports.isAxiosError = exports.isAxiosStatic = exports.dotValue = void 0;
const get_value_1 = __importDefault(require("get-value"));
function dotValue(...argv) {
    return get_value_1.default(...argv);
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