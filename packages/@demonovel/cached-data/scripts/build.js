"use strict";
/**
 * Created by user on 2020/3/2.
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = __importDefault(require("../lib/all/index"));
const bluebird_1 = __importDefault(require("bluebird"));
const build_1 = __importDefault(require("../lib/all/build"));
const path_1 = require("path");
const __root_1 = require("../lib/__root");
const convert_1 = require("../lib/util/convert");
const cache_1 = __importDefault(require("../lib/all/cache"));
const fs_1 = require("../lib/util/fs");
exports.default = index_1.default(false, {
    local: true,
})
    .then(data => {
    return build_1.default(data);
})
    .tap(data => {
    return bluebird_1.default.resolve(Object.keys(data))
        .map(siteID => {
        return fs_1.outputJSONWithIndent(path_1.join(__root_1.__rootCacheBuild, `${siteID}.json`), data[siteID]);
    });
})
    .tap(data => {
    return bluebird_1.default.resolve(Object.keys(data))
        .reduce((a, b) => {
        // @ts-ignore
        a.push(...Object.values(data[b]));
        return a;
    }, [])
        .then(list => convert_1._handle(list))
        .tap(list => {
        return Promise.all([
            fs_1.outputJSONWithIndent(path_1.join(__root_1.__rootCache, `pack`, `array.json`), list),
            fs_1.outputJSONWithIndent(path_1.join(__root_1.__rootCache, `pack`, `record.json`), convert_1.toRecord(list)),
            cache_1.default(list),
        ]);
    });
});
//# sourceMappingURL=build.js.map