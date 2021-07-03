"use strict";
/**
 * Created by user on 2020/1/6.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const git_1 = require("@node-novel/site-cache-util/lib/git");
const git_2 = require("../lib/git");
const index_1 = require("@node-novel/site-cache-util/lib/index");
const index_2 = require("../lib/index");
const env_1 = require("../lib/env");
exports.default = (0, index_1.lazyRun)(async () => {
    let { GITHUB_ACTOR, GITHUB_TOKEN } = (0, env_1.getGitHubEnv)();
    let remote_repo = (0, git_2.buildGitRemote)({
        user: GITHUB_ACTOR,
        pass: GITHUB_TOKEN,
        host: 'github.com',
        repo: 'bluelovers/ws-rest',
    });
    //console.info(`remote:`, remote_repo);
    (0, git_1.crossSpawnSync)('git', [
        'push',
        remote_repo,
        `HEAD:master`,
    ], {
        cwd: index_2.__root,
        stdio: 'inherit',
    });
}, {
    pkgLabel: __filename,
});
//# sourceMappingURL=git-push.js.map