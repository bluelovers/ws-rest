"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const path_1 = (0, tslib_1.__importDefault)(require("path"));
const util_1 = require("./util");
const fs_extra_1 = (0, tslib_1.__importDefault)(require("fs-extra"));
const bluebird_cancellation_1 = (0, tslib_1.__importDefault)(require("bluebird-cancellation"));
const util_2 = require("dmzj-api/lib/util");
const bluebird_1 = (0, tslib_1.__importDefault)(require("@bluelovers/fast-glob/bluebird"));
const files_1 = (0, tslib_1.__importDefault)(require("./util/files"));
exports.default = (async () => {
    const file = files_1.default.recentUpdate;
    await bluebird_cancellation_1.default
        .resolve(fs_extra_1.default.readJSON(file))
        .then((data) => {
        data.list = data.list.map(util_2.fixDmzjNovelInfo);
        return fs_extra_1.default.outputJSON(file, data, {
            spaces: 2,
        });
    });
    await bluebird_1.default.async([
        '*.json',
    ], {
        cwd: path_1.default.join(util_1.__root, 'data', 'novel/info'),
        absolute: true,
    })
        .each(async (file) => {
        let v = await fs_extra_1.default.readJSON(file);
        return fs_extra_1.default.writeJSON(file, (0, util_2.fixDmzjNovelInfo)(v), {
            spaces: 2,
        });
    });
})();
//# sourceMappingURL=fix-old.js.map