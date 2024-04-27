"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.slugifyNovel3 = slugifyNovel3;
exports.slugifyNovel2 = slugifyNovel2;
exports.slugifyNovel = slugifyNovel;
const tslib_1 = require("tslib");
const zh_slugify_1 = require("@lazy-cjk/zh-slugify");
const lib_1 = tslib_1.__importDefault(require("zero-width/lib"));
const str_util_1 = require("str-util");
function slugifyNovel3(title) {
    return (0, lib_1.default)((0, str_util_1.toHalfWidth)(title))
        .toLocaleLowerCase();
}
function slugifyNovel2(title) {
    return (0, zh_slugify_1.slugify)(slugifyNovel3(title), true);
}
function slugifyNovel(title) {
    title = slugifyNovel3(title);
    title = [
        /\s+/g,
        /[’'"]+/g,
        /[\\\/\[\]{}()~「」【】、,…・。―〈〉『』—《》（），﹑／＼]+/g,
        /[<>]+/g,
        /[#.?!+·-•]+/g,
        /[◆◇■□★▼＊☆◊§～*↣＝=═\-－─—　 ※…⋯◯○~∞&%]+/g,
        /[&=]+/g,
        /[×:@]+/g,
    ].reduce((t1, re) => {
        let t2 = t1.replace(re, '');
        if (t2.length) {
            return t2;
        }
        return t1;
    }, title);
    return (0, zh_slugify_1.slugify)(title, true);
}
exports.default = slugifyNovel;
//# sourceMappingURL=slugify.js.map