"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.slugifyNovel = exports.slugifyNovel2 = exports.slugifyNovel3 = void 0;
const list_1 = require("cjk-conv/lib/zh/table/list");
const lib_1 = __importDefault(require("zero-width/lib"));
const str_util_1 = require("str-util");
function slugifyNovel3(title) {
    return lib_1.default(str_util_1.toHalfWidth(title))
        .toLocaleLowerCase();
}
exports.slugifyNovel3 = slugifyNovel3;
function slugifyNovel2(title) {
    return list_1.slugify(slugifyNovel3(title), true);
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
    return list_1.slugify(title, true);
}
exports.slugifyNovel = slugifyNovel;
exports.default = slugifyNovel;
//# sourceMappingURL=slugify.js.map