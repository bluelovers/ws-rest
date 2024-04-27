"use strict";
/**
 * Created by user on 2019/12/13.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.crossSpawnSync = exports.matchGlob = exports.gitDiffStaged = exports.gitDiffStagedFile = exports.gitDiffStagedDir = void 0;
exports.filterGitDiffStagedFiles = filterGitDiffStagedFiles;
exports.reportDiffStagedNovels = reportDiffStagedNovels;
const tslib_1 = require("tslib");
const diff_staged_1 = require("@git-lazy/diff-staged");
Object.defineProperty(exports, "gitDiffStagedDir", { enumerable: true, get: function () { return diff_staged_1.gitDiffStagedDir; } });
Object.defineProperty(exports, "gitDiffStagedFile", { enumerable: true, get: function () { return diff_staged_1.gitDiffStagedFile; } });
Object.defineProperty(exports, "gitDiffStaged", { enumerable: true, get: function () { return diff_staged_1.gitDiffStaged; } });
const match_1 = tslib_1.__importDefault(require("@git-lazy/util/util/match"));
exports.matchGlob = match_1.default;
const git_1 = require("@git-lazy/util/spawn/git");
Object.defineProperty(exports, "crossSpawnSync", { enumerable: true, get: function () { return git_1.crossSpawnSync; } });
const path_1 = require("path");
const bluebird_1 = tslib_1.__importDefault(require("bluebird"));
const fs_extra_1 = require("fs-extra");
const moment_1 = require("./moment");
function filterGitDiffStagedFiles(options) {
    return bluebird_1.default.resolve()
        .then(async () => {
        let ls1 = (0, diff_staged_1.gitDiffStagedFile)(options.git_root);
        options.pattern = options.pattern || [
            'novel/info/*.json',
        ];
        let ls3 = (0, match_1.default)(ls1, options.pattern);
        return ls3;
    });
}
function reportDiffStagedNovels(options) {
    return bluebird_1.default.resolve()
        .then(async () => {
        let ls3 = await filterGitDiffStagedFiles(options);
        let msg = '';
        if (ls3.length) {
            options.callback = options.callback || ((json, id) => {
                return `- ${id.padStart(4, '0')} ${json.name} ${moment_1.moment.unix(json.last_update_time)
                    .format()} ${json.last_update_volume_name} ${json.last_update_chapter_name}`;
            });
            msg = await bluebird_1.default
                .resolve(ls3)
                .reduce(async (a, filename) => {
                let file = (0, path_1.join)(options.git_root, filename);
                let id = (0, path_1.parse)(filename).name;
                let json = await (0, fs_extra_1.readJSON)(file);
                let line = await options.callback(json, id);
                a.push(line);
                return a;
            }, [`, novel x ${ls3.length}\n`])
                .then(a => a.join('\n'));
        }
        return msg;
    });
}
//# sourceMappingURL=git.js.map