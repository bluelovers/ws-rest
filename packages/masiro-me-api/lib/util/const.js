"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.re404 = exports.reDesc = exports.reLastUpdateName = exports.reStates = exports.reAuthors = void 0;
const regexp_cjk_1 = require("regexp-cjk");
exports.reAuthors = new regexp_cjk_1.zhRegExp(/\s*作者\s*(?:：|:)\s*/);
exports.reStates = new regexp_cjk_1.zhRegExp(/\s*状态\s*(?:：|:)\s*/);
exports.reLastUpdateName = new regexp_cjk_1.zhRegExp(/\s*最新\s*(?:：|:)\s*/);
exports.reDesc = new regexp_cjk_1.zhRegExp(/\s*简介\s*(?:：|:)\s*/);
exports.re404 = new regexp_cjk_1.zhRegExp(/^\s*您好\s*(?:,|，)\s*此页面不存在\s*$/);
//# sourceMappingURL=const.js.map