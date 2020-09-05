"use strict";
/**
 * Created by user on 2019/7/7.
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const diff_staged_1 = require("@git-lazy/diff-staged");
const match_1 = __importDefault(require("@git-lazy/util/util/match"));
const path_1 = require("path");
const git_1 = require("@git-lazy/util/spawn/git");
const util_1 = require("./util");
const ci_1 = require("@node-novel/site-cache-util/lib/ci");
const lib_1 = require("@node-novel/site-cache-util/lib");
const main_1 = require("./util/main");
const index_1 = require("@node-novel/site-cache-util/lib/index");
exports.default = index_1.lazyRun(async () => {
    git_1.crossSpawnSync('git', [
        'add',
        '.',
    ], {
        cwd: path_1.join(util_1.__root, 'data'),
        stdio: 'inherit',
    });
    let ls1 = diff_staged_1.gitDiffStagedFile(path_1.join(util_1.__root, 'data'));
    let ls2 = match_1.default(ls1, [
        '**/*',
    ]);
    if (ls2.length) {
        lib_1.console.dir(ls2);
        git_1.crossSpawnSync('git', [
            'add',
            '.',
        ], {
            cwd: path_1.join(util_1.__root, 'test', 'temp'),
            stdio: 'inherit',
        });
        let msg = `${main_1.pkgLabel}update cache ${ls2.length} ${ci_1.skipCi()}`;
        git_1.crossSpawnSync('git', [
            'commit',
            '-m',
            msg,
        ], {
            cwd: path_1.join(util_1.__root, 'data'),
            stdio: 'inherit',
        });
        if (msg) {
            lib_1.console.success(msg);
        }
    }
}, {
    pkgLabel: __filename,
});
//# sourceMappingURL=build-commit.js.map