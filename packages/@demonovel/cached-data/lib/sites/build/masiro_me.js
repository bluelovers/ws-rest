"use strict";
/**
 * Created by user on 2020/3/3.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildMasiroMe = buildMasiroMe;
const util_1 = require("./util");
let now = Date.now();
function buildMasiroMe(siteID, id, data) {
    let { id: novel_id, title, cover, authors, translator, tags, updated, status_text, last_update_name, content, } = data;
    let item = {
        ...data
    };
    item.novelID = data.id;
    // @ts-ignore
    delete item.chapters;
    return (0, util_1.newEntry)(siteID, item);
}
exports.default = buildMasiroMe;
//# sourceMappingURL=masiro_me.js.map