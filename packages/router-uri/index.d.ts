/**
 * Created by user on 2019/6/9.
 */
/**
 * replace :varname with {varname} to make it RFC 6570 compatible
 * https://github.com/octokit/endpoint.js/blob/master/src/parse.ts
 */
export declare function routerToRfc6570(url: string): string;
export declare function rfc6570ToRouter(url: string): string;
export declare function _notSupport(w: string, throwError?: boolean): boolean;
export default routerToRfc6570;
