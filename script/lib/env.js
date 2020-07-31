"use strict";
/**
 * Created by user on 2020/1/6.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.getGitHubEnv = void 0;
function getGitHubEnv() {
    let { GITHUB_TOKEN, GITHUB_ACTOR } = process.env;
    return {
        GITHUB_TOKEN,
        GITHUB_ACTOR,
    };
}
exports.getGitHubEnv = getGitHubEnv;
//# sourceMappingURL=env.js.map