"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const fs_extra_1 = require("fs-extra");
const files_1 = tslib_1.__importDefault(require("../util/files"));
const bluebird_1 = tslib_1.__importDefault(require("bluebird"));
const util_1 = require("../util");
const index_1 = require("@node-novel/site-cache-util/lib/index");
const fs_1 = require("@node-novel/site-cache-util/lib/fs");
exports.default = (0, index_1.lazyRun)(async () => {
    util_1.consoleDebug.info(`building... subForums, topForums`);
    let allForums = await (0, fs_extra_1.readJSON)(files_1.default.infoPack).then(v => Object.values(v));
    let subForums = {};
    let topForums = {};
    allForums.forEach(b => {
        if (b.subforums && b.subforums.length) {
            let { fid, forum_name, subforums, } = b;
            topForums[b.fid] = {
                fid,
                forum_name,
                subforums,
            };
        }
        else {
            let { fid, forum_name, last_thread_time, last_thread_subject, last_thread_id, pages, moderator, forum_rules, threads, } = b;
            subForums[b.fid] = {
                fid,
                forum_name,
                last_thread_time,
                last_thread_subject,
                last_thread_id,
                pages,
                threads_length: threads.length,
                moderator,
                forum_rules,
            };
        }
    });
    await bluebird_1.default.all([
        (0, fs_1.outputJSONLazy)(files_1.default.subforums, subForums),
        (0, fs_1.outputJSONLazy)(files_1.default.topforums, topForums),
    ]);
}, {
    pkgLabel: __filename,
});
//# sourceMappingURL=merge002.js.map