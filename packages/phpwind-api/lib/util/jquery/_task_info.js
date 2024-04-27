"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports._parseTaskInfo = _parseTaskInfo;
/**
 * Created by user on 2020/5/13.
 */
function _parseTaskInfo($, _tr) {
    var _b, _c, _d, _e;
    let _tds = _tr.find('> td');
    if (_tds.length <= 1) {
        return;
    }
    let _a = _tr.find('> td:eq(1)').find('> b:eq(0), > a > b:eq(0)');
    let task_name = _a.text();
    let task_credit = _tr
        .find('> td:eq(2)')
        .text()
        .replace(/^[\n\r]+/g, '')
        .replace(/\s+$/g, '');
    _a = _tr.find('a[onclick*="startjob"]:eq(0)');
    let task_id = (_c = (_b = _a.attr('onclick')) === null || _b === void 0 ? void 0 : _b.match(/startjob\('(\d+)'/)) === null || _c === void 0 ? void 0 : _c[1];
    _tds = _tr.next('.f_one').find('> td');
    let task_desc = _tds.text()
        .replace(/^[\n\r]+/g, '')
        .replace(/\s+$/g, '');
    let task_percent = (_e = (_d = _tds
        .find('.taskbar .taskbar_text')
        .text()) === null || _d === void 0 ? void 0 : _d.match(/\b(\d+(?:\.\d+)?)\s*%/)) === null || _e === void 0 ? void 0 : _e[1];
    let task_drawable = !!task_id;
    let obj = {
        task_id,
        task_name,
        task_desc,
        task_credit,
        task_percent,
        task_drawable,
    };
    return obj;
}
//# sourceMappingURL=_task_info.js.map