"use strict";
/**
 * Created by user on 2020/3/3.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildEsjzone = void 0;
const util_1 = require("./util");
const moment_1 = require("../../util/moment");
function buildEsjzone(siteID, id, data) {
    var _a;
    let item = {};
    item.id = id;
    item.novelID = id;
    item.title = data.name;
    if ((_a = data.titles) === null || _a === void 0 ? void 0 : _a.length) {
        item.titles = [item.title].concat(data.titles);
    }
    item.authors = [data.authors];
    item.chapters_num = data.chapters && data.chapters.reduce((i, v) => {
        i += v.chapters.length;
        return i;
    }, 0);
    item.content = data.desc;
    item.updated = data.last_update_time && moment_1.createMomentBySeconds(data.last_update_time).valueOf() || 0;
    item.tags = data.tags;
    item.cover = data.cover;
    if (data.chapters && data.chapters.length) {
        let vol = data.chapters[data.chapters.length - 1];
        let ch = vol.chapters[vol.chapters.length - 1];
        item.last_update_name = util_1.newTitle(ch && ch.chapter_name, vol.volume_name);
    }
    return util_1.newEntry(siteID, item);
}
exports.buildEsjzone = buildEsjzone;
exports.default = buildEsjzone;
//# sourceMappingURL=esjzone.js.map