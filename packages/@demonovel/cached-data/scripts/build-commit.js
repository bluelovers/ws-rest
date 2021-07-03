"use strict";
/**
 * Created by user on 2019/7/7.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = require("path");
const git_1 = require("@git-lazy/util/spawn/git");
const ci_1 = require("@node-novel/site-cache-util/lib/ci");
const index_1 = require("@node-novel/site-cache-util/lib/index");
const __root_1 = require("../lib/__root");
exports.default = (0, index_1.lazyRun)(async () => {
    const pkgLabel = `[@demonovel/cached-data]`;
    (0, git_1.crossSpawnSync)('git', [
        'add',
        '.',
    ], {
        cwd: (0, path_1.join)(__root_1.__root, 'cache'),
        stdio: 'inherit',
    });
    (0, git_1.crossSpawnSync)('git', [
        'commit',
        '-m',
        `${pkgLabel} update cache ${(0, ci_1.skipCi)()}`,
    ], {
        cwd: __root_1.__root,
        stdio: 'inherit',
    });
}, {
    pkgLabel: __filename,
});
//# sourceMappingURL=build-commit.js.map