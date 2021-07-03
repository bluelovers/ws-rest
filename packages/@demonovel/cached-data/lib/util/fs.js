"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.outputJSONWithIndent = exports.readJSONWithFetch = void 0;
const tslib_1 = require("tslib");
/**
 * Created by user on 2020/3/2.
 */
const fs_extra_1 = require("fs-extra");
const bluebird_1 = (0, tslib_1.__importDefault)(require("bluebird"));
function readJSONWithFetch(file, fetch, force) {
    return bluebird_1.default.resolve()
        .then(async () => {
        if (typeof force === "boolean" && !force) {
            let st = await (0, fs_extra_1.stat)(file)
                .catch(e => null);
            if (st && (Date.now() - st.mtimeMs) < 12 * 60 * 60 * 1000) {
                return (0, fs_extra_1.readJSON)(file);
            }
        }
        return Promise.reject();
    })
        .catch(e => fetch())
        .catch(e => (0, fs_extra_1.readJSON)(file));
}
exports.readJSONWithFetch = readJSONWithFetch;
function outputJSONWithIndent(file, data, options = {
    spaces: 2,
}) {
    return bluebird_1.default.resolve((0, fs_extra_1.outputJSON)(file, data, options));
}
exports.outputJSONWithIndent = outputJSONWithIndent;
//# sourceMappingURL=fs.js.map