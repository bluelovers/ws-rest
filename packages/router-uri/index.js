"use strict";
/**
 * Created by user on 2019/6/9.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.routerToRfc6570 = routerToRfc6570;
exports.rfc6570ToRouter = rfc6570ToRouter;
exports._notSupport = _notSupport;
/**
 * replace :varname with {varname} to make it RFC 6570 compatible
 * https://github.com/octokit/endpoint.js/blob/master/src/parse.ts
 */
function routerToRfc6570(url) {
    return url.replace(/:([a-z]\w*)/g, "{+$1}");
}
function rfc6570ToRouter(url) {
    return url
        .replace(/\{([^{}:"']+)\}/g, (s, w) => {
        _notSupport(w, true);
        w = w.replace(/^\+(\w+)$/, '$1');
        return `:${w}`;
    });
}
function _notSupport(w, throwError) {
    if (/^\+?[^\w]+$/.test(w)) {
        if (throwError) {
            throw new TypeError(`only can convert base rule, but got {${w}}`);
        }
        return true;
    }
}
exports.default = routerToRfc6570;
//# sourceMappingURL=index.js.map