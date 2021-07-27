"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.slugifyNovel = exports.slugifyNovel2 = exports.slugifyNovel3 = void 0;
const tslib_1 = require("tslib");
const zh_slugify_1 = require("@lazy-cjk/zh-slugify");
const lib_1 = (0, tslib_1.__importDefault)(require("zero-width/lib"));
const str_util_1 = require("str-util");
function slugifyNovel3(title) {
    return (0, lib_1.default)((0, str_util_1.toHalfWidth)(title))
        .toLocaleLowerCase();
}
exports.slugifyNovel3 = slugifyNovel3;
function slugifyNovel2(title) {
    return (0, zh_slugify_1.slugify)(slugifyNovel3(title), true);
}
exports.slugifyNovel2 = slugifyNovel2;
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
exports.slugifyNovel = slugifyNovel;
exports.default = slugifyNovel;
//# sourceMappingURL=slugify.js.map