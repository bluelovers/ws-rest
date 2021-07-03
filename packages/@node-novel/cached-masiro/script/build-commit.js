"use strict";
/**
 * Created by user on 2019/7/7.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const diff_staged_1 = require("@git-lazy/diff-staged");
const match_1 = (0, tslib_1.__importDefault)(require("@git-lazy/util/util/match"));
const path_1 = require("path");
const git_1 = require("@git-lazy/util/spawn/git");
const util_1 = require("./util");
const moment_1 = require("@node-novel/site-cache-util/lib/moment");
const git_2 = require("@node-novel/site-cache-util/lib/git");
const util_2 = require("discuz-api/lib/util");
const lib_1 = require("@node-novel/site-cache-util/lib");
const ci_1 = require("@node-novel/site-cache-util/lib/ci");
const main_1 = require("./util/main");
const index_1 = require("@node-novel/site-cache-util/lib/index");
exports.default = (0, index_1.lazyRun)(async () => {
    (0, git_1.crossSpawnSync)('git', [
        'add',
        '.',
    ], {
        cwd: (0, path_1.join)(util_1.__root, 'data'),
        stdio: 'inherit',
    });
    let ls1 = (0, diff_staged_1.gitDiffStagedFile)((0, path_1.join)(util_1.__root, 'data'));
    let ls2 = (0, match_1.default)(ls1, [
        '**/*',
    ]);
    if (ls2.length) {
        lib_1.console.dir(ls2);
        let msg = await (0, git_2.reportDiffStagedNovels)({
            git_root: (0, path_1.join)(util_1.__root, 'data'),
            pattern: [
                'fid/*.json',
            ],
            callback(json, id) {
                let thread_subject = (0, util_2._getForumLastThreadSubject)(json).thread_subject_full;
                return `- ${id.padStart(4, '0')} ${json.forum_name} ${moment_1.moment.unix(json.last_thread_time).format()} ${thread_subject} c:${json.threads.length}`;
            }
        });
        (0, git_1.crossSpawnSync)('git', [
            'add',
            'task001.json',
        ], {
            cwd: (0, path_1.join)(util_1.__root, 'test/temp'),
            stdio: 'inherit',
        });
        (0, git_1.crossSpawnSync)('git', [
            'commit',
            '-m',
            `${main_1.pkgLabel}update cache${msg}${(0, ci_1.skipCi)()}`,
        ], {
            cwd: (0, path_1.join)(util_1.__root, 'data'),
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