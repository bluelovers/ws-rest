"use strict";
/**
 * Created by user on 2020/3/3.
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleEntries = exports.newTitle = exports.newEntry = void 0;
const util_1 = require("../../util");
const sort_object_keys2_1 = __importDefault(require("sort-object-keys2"));
const convert_1 = require("../../util/convert");
const array_hyper_unique_1 = require("array-hyper-unique");
function newEntry(siteID, item) {
    var _a;
    if (!item.uuid) {
        item.uuid = util_1.newUUID(siteID, item.id);
    }
    if ((_a = item.titles) === null || _a === void 0 ? void 0 : _a.length) {
        array_hyper_unique_1.array_unique_overwrite(item.titles);
    }
    item.siteID = siteID;
    item.updated = item.updated || 0;
    Object.entries(item)
        .forEach(([k, v]) => {
        if (v && Array.isArray(v)) {
            v = v.filter(v => Boolean(v) && String(v).length);
            // @ts-ignore
            if (v.length) {
                // @ts-ignore
                item[k] = v;
            }
            else {
                // @ts-ignore
                delete item[k];
            }
        }
        else if (typeof v === "string"
            && k !== 'novelID'
            && k !== 'id') {
            // @ts-ignore
            item[k] = util_1.trim(v);
        }
    });
    return sort_object_keys2_1.default(item, {
        keys: [
            'siteID',
            'novelID',
            'uuid',
            'id',
            'title',
            'titles',
            'cover',
            'authors',
            'updated',
            'chapters_num',
            'last_update_name',
            'tags',
            'content',
        ],
        useSource: true,
    });
}
exports.newEntry = newEntry;
function newTitle(chapter_name, volume_name) {
    let c = '／';
    let a = [];
    if (typeof volume_name === 'string' && volume_name.length) {
        a.push(volume_name);
    }
    if (typeof chapter_name === 'string' && chapter_name.length) {
        a.push(chapter_name);
    }
    if (a.length) {
        return a.join(c);
    }
}
exports.newTitle = newTitle;
function handleEntries(siteID, source, handler) {
    let list = Object.entries(source[siteID])
        .reduce((a, [id, data]) => {
        let item = handler(siteID, String(id), source[siteID][id]);
        //item && console.log(siteID, item.id, item.title);
        if (item && item.title.length) {
            a.push(item);
        }
        return a;
    }, [])
        .filter(Boolean);
    return convert_1.toRecord(list);
}
exports.handleEntries = handleEntries;
//# sourceMappingURL=util.js.map