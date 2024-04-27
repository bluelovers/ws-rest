"use strict";
/**
 * Created by user on 2020/1/6.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.getGitHubEnv = getGitHubEnv;
function getGitHubEnv() {
    let { GITHUB_TOKEN, GITHUB_ACTOR } = process.env;
    return {
        GITHUB_TOKEN,
        GITHUB_ACTOR,
    };
}
//# sourceMappingURL=env.js.map