"use strict";
/**
 * Created by user on 2019/7/7.
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const git_1 = require("@node-novel/site-cache-util/lib/git");
const path_1 = require("path");
const fs_extra_1 = require("fs-extra");
const util_1 = require("./util");
const moment_1 = require("@node-novel/site-cache-util/lib/moment");
const ci_1 = require("@node-novel/site-cache-util/lib/ci");
const lib_1 = require("@node-novel/site-cache-util/lib");
const index_1 = require("@node-novel/site-cache-util/lib/index");
const main_1 = require("./util/main");
const files_1 = __importStar(require("./util/files"));
exports.default = index_1.lazyRun(async () => {
    git_1.crossSpawnSync('git', [
        'add',
        '.',
    ], {
        cwd: path_1.join(util_1.__root, 'data'),
        stdio: 'inherit',
    });
    let ls1 = git_1.gitDiffStagedFile(path_1.join(util_1.__root, 'data'));
    let ls2 = git_1.matchGlob(ls1, [
        '**/*',
    ]);
    if (ls2.length) {
        lib_1.console.dir(ls2);
        ls1 = git_1.gitDiffStagedFile(path_1.join(util_1.__root, 'data'));
        ls2 = git_1.matchGlob(ls1, [
            '**/*',
        ]);
        let ls3 = git_1.matchGlob(ls1, [
            'novel/info/*.json',
        ]);
        let msg = '';
        if (ls3.length) {
            //console.dir(ls3);
            let json = fs_extra_1.readJSONSync(files_1.default.recentUpdate);
            let ids = ls3
                .map(v => path_1.parse(v).name);
            //console.dir(ids);
            msg = json.list.reduce((a, v) => {
                let id = v.id.toString();
                if (ids.includes(id)) {
                    let json = fs_extra_1.readJSONSync(files_1.cacheFileInfoPath(id));
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
        git_1.crossSpawnSync('git', [
            'commit',
            '-m',
            `${main_1.pkgLabel}update cache${msg}${ci_1.skipCi()}`,
        ], {
            cwd: path_1.join(util_1.__root, 'data'),
            stdio: 'inherit',
        });
        if (msg) {
            lib_1.console.success(msg);
        }
    }
    git_1.crossSpawnSync('git', [
        'add',
        '.',
    ], {
        cwd: path_1.join(util_1.__root, 'test/temp'),
        stdio: 'inherit',
    });
    git_1.crossSpawnSync('git', [
        'commit',
        '-m',
        `${main_1.pkgLabel}update temp cache${ci_1.skipCi()}`,
    ], {
        cwd: path_1.join(util_1.__root, 'test/temp'),
        stdio: 'inherit',
    });
}, {
    pkgLabel: __filename,
});
//# sourceMappingURL=build-commit.js.map