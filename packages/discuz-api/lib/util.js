"use strict";
/**
 * Created by user on 2019/11/21.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports._getForumLastThreadSubject = exports.trimUnsafe = exports.removeZeroWidth = void 0;
// @ts-ignore
const zero_width_1 = require("zero-width");
Object.defineProperty(exports, "removeZeroWidth", { enumerable: true, get: function () { return zero_width_1.removeZeroWidth; } });
const crlf_normalize_1 = require("crlf-normalize");
function trimUnsafe(input) {
    // @ts-ignore
    return (0, zero_width_1.removeZeroWidth)((0, crlf_normalize_1.crlf)(input))
        .replace(/^\s+|\s+$/gu, '')
        .replace(/[\u00A0]/gu, ' ')
        .replace(/[\t ]+/gu, ' ')
        .trim();
}
exports.trimUnsafe = trimUnsafe;
function _getForumLastThreadSubject(forum) {
    let thread_subject = forum.last_thread_subject;
    let thread_subject_full = forum.last_thread_subject;
    let { last_thread_id, last_thread_time, } = forum;
    let thread_type;
    let thread_typeid;
    if (forum.last_thread_id) {
        let thread;
        forum.threads.some(v => {
            if (v.tid == forum.last_thread_id) {
                thread = v;
                return true;
            }
        });
        if (thread && thread.typeid) {
            thread_type = forum.thread_types[thread.typeid];
            thread_typeid = thread.typeid;
            thread_subject_full = thread_type + ' ' + thread_subject;
        }
    }
    return {
        last_thread_time,
        last_thread_id,
        thread_type,
        thread_typeid,
        thread_subject,
        thread_subject_full,
    };
}
exports._getForumLastThreadSubject = _getForumLastThreadSubject;
//# sourceMappingURL=util.js.map