"use strict";
/**
 * Created by user on 2020/3/3.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildDefault = void 0;
const util_1 = require("./util");
const moment_1 = require("../../util/moment");
let now = Date.now();
function buildDefault(siteID, id, data) {
    let item = {};
    item.id = id;
    item.novelID = id;
    item.title = data.name;
    item.authors = [data.authors];
    item.content = data.desc || data.introduction;
    item.tags = data.types || data.tags;
    item.updated = data.last_update_time && (0, moment_1.createMomentBySeconds)(data.last_update_time).valueOf() || 0;
    item.cover = data.cover;
    item.last_update_name = (0, util_1.newTitle)(data.last_update_chapter_name, data.last_update_volume_name);
    item.chapters_num = data.chapters && data.chapters.reduce((i, v) => {
        i += v.chapters.length;
        return i;
    }, 0);
    return (0, util_1.newEntry)(siteID, item);
}
exports.buildDefault = buildDefault;
exports.default = buildDefault;
//# sourceMappingURL=default.js.map