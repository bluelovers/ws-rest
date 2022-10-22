"use strict";
/**
 * Created by user on 2019/7/7.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const diff_staged_1 = require("@git-lazy/diff-staged");
const match_1 = tslib_1.__importDefault(require("@git-lazy/util/util/match"));
const path_1 = require("path");
const git_1 = require("@git-lazy/util/spawn/git");
const util_1 = require("./util");
const moment_1 = require("@node-novel/site-cache-util/lib/moment");
const git_2 = require("@node-novel/site-cache-util/lib/git");
const ci_1 = require("@node-novel/site-cache-util/lib/ci");
const lib_1 = require("@node-novel/site-cache-util/lib");
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
            callback(json, id) {
                var _a;
                let c = 0;
                let v = 0;
                if ((_a = json.chapters) === null || _a === void 0 ? void 0 : _a.length) {
                    c = json.chapters.reduce((len, vol) => {
                        v++;
                        return len + vol.chapters.length;
                    }, 0);
                }
                return `- ${id.padStart(4, '0')} ${json.title} ${(0, moment_1.moment)(json.updated)
                    .format()} ${json.last_update_name} c:${c} v:${v}`;
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