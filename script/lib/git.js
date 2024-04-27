"use strict";
/**
 * Created by user on 2020/1/6.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildGitRemote = buildGitRemote;
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
//# sourceMappingURL=git.js.map