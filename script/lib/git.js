"use strict";
/**
 * Created by user on 2020/1/6.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildGitRemote = void 0;
function buildGitRemote(options) {
    let auth = '';
    if (options.user) {
        auth += options.user;
        if (options.pass) {
            auth += ':' + options.pass;
        }
        auth += '@';
    }
    return `https://${auth}${options.host}/${options.repo}.git`;
}
exports.buildGitRemote = buildGitRemote;
//# sourceMappingURL=git.js.map