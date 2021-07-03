"use strict";
/**
 * Created by user on 2019/7/7.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const git_1 = require("@node-novel/site-cache-util/lib/git");
const path_1 = require("path");
const fs_extra_1 = require("fs-extra");
const util_1 = require("./util");
const moment_1 = require("@node-novel/site-cache-util/lib/moment");
const ci_1 = require("@node-novel/site-cache-util/lib/ci");
const lib_1 = require("@node-novel/site-cache-util/lib");
const index_1 = require("@node-novel/site-cache-util/lib/index");
const main_1 = require("./util/main");
const files_1 = (0, tslib_1.__importStar)(require("./util/files"));
exports.default = (0, index_1.lazyRun)(async () => {
    (0, git_1.crossSpawnSync)('git', [
        'add',
        '.',
    ], {
        cwd: (0, path_1.join)(util_1.__root, 'data'),
        stdio: 'inherit',
    });
    let ls1 = (0, git_1.gitDiffStagedFile)((0, path_1.join)(util_1.__root, 'data'));
    let ls2 = (0, git_1.matchGlob)(ls1, [
        '**/*',
    ]);
    if (ls2.length) {
        lib_1.console.dir(ls2);
        ls1 = (0, git_1.gitDiffStagedFile)((0, path_1.join)(util_1.__root, 'data'));
        ls2 = (0, git_1.matchGlob)(ls1, [
            '**/*',
        ]);
        let ls3 = (0, git_1.matchGlob)(ls1, [
            'novel/info/*.json',
        ]);
        let msg = '';
        if (ls3.length) {
            //console.dir(ls3);
            let json = (0, fs_extra_1.readJSONSync)(files_1.default.recentUpdate);
            let ids = ls3
                .map(v => (0, path_1.parse)(v).name);
            //console.dir(ids);
            msg = json.list.reduce((a, v) => {
                let id = v.id.toString();
                if (ids.includes(id)) {
                    let json = (0, fs_extra_1.readJSONSync)((0, files_1.cacheFileInfoPath)(id));
                    let cs = 0;
                    let vs = 0;
                    cs = json.chapters.reduce((len, vol) => {
                        vs++;
                        return len += vol.chapters.length;
                    }, 0);
                    a.push(`- ${id.padStart(4, '0')} ${v.name} ${moment_1.moment.unix(v.last_update_time).format()} ${v.last_update_volume_name} ${v.last_update_chapter_name} c:${cs} v:${vs}`);
                }
                return a;
            }, [`, novel x ${ls3.length}\n`]).join('\n');
        }
        //console.dir(`update cache${msg}`);
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
    (0, git_1.crossSpawnSync)('git', [
        'add',
        '.',
    ], {
        cwd: (0, path_1.join)(util_1.__root, 'test/temp'),
        stdio: 'inherit',
    });
    (0, git_1.crossSpawnSync)('git', [
        'commit',
        '-m',
        `${main_1.pkgLabel}update temp cache${(0, ci_1.skipCi)()}`,
    ], {
        cwd: (0, path_1.join)(util_1.__root, 'test/temp'),
        stdio: 'inherit',
    });
}, {
    pkgLabel: __filename,
});
//# sourceMappingURL=build-commit.js.map