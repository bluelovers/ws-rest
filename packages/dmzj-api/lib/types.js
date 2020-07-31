"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DMZJ_NOVEL_TAGS = exports.EnumWebSubscribeTypeID = exports.EnumNumberBoolean = exports.EnumDmzjAcgnBigCatID = exports.EnumDmzjAcgnOrderID = exports.EnumDmzjAcgnStatusID = exports.EnumDmzjAcgnStatus = exports.EnumDmzjMsg = exports.EnumDmzjCode = void 0;
const symbol_1 = require("restful-decorator/lib/helper/symbol");
var EnumDmzjCode;
(function (EnumDmzjCode) {
    EnumDmzjCode[EnumDmzjCode["\u6210\u529F"] = 0] = "\u6210\u529F";
})(EnumDmzjCode = exports.EnumDmzjCode || (exports.EnumDmzjCode = {}));
var EnumDmzjMsg;
(function (EnumDmzjMsg) {
    EnumDmzjMsg["\u6210\u529F"] = "\u6210\u529F";
})(EnumDmzjMsg = exports.EnumDmzjMsg || (exports.EnumDmzjMsg = {}));
var EnumDmzjAcgnStatus;
(function (EnumDmzjAcgnStatus) {
    EnumDmzjAcgnStatus["\u5DF2\u5B8C\u7ED3"] = "\u5DF2\u5B8C\u7ED3";
    EnumDmzjAcgnStatus["\u8FDE\u8F7D\u4E2D"] = "\u8FDE\u8F7D\u4E2D";
})(EnumDmzjAcgnStatus = exports.EnumDmzjAcgnStatus || (exports.EnumDmzjAcgnStatus = {}));
var EnumDmzjAcgnStatusID;
(function (EnumDmzjAcgnStatusID) {
    EnumDmzjAcgnStatusID[EnumDmzjAcgnStatusID["ALL"] = 0] = "ALL";
    EnumDmzjAcgnStatusID[EnumDmzjAcgnStatusID["NOT_DONE"] = 1] = "NOT_DONE";
    EnumDmzjAcgnStatusID[EnumDmzjAcgnStatusID["DONE"] = 2] = "DONE";
})(EnumDmzjAcgnStatusID = exports.EnumDmzjAcgnStatusID || (exports.EnumDmzjAcgnStatusID = {}));
var EnumDmzjAcgnOrderID;
(function (EnumDmzjAcgnOrderID) {
    /**
     * 0为人气从高到低
     */
    EnumDmzjAcgnOrderID[EnumDmzjAcgnOrderID["HOT"] = 0] = "HOT";
    /**
     * 1为更新时间从近到远
     */
    EnumDmzjAcgnOrderID[EnumDmzjAcgnOrderID["UPDATE"] = 1] = "UPDATE";
})(EnumDmzjAcgnOrderID = exports.EnumDmzjAcgnOrderID || (exports.EnumDmzjAcgnOrderID = {}));
var EnumDmzjAcgnBigCatID;
(function (EnumDmzjAcgnBigCatID) {
    /**
     * 0为漫画
     */
    EnumDmzjAcgnBigCatID[EnumDmzjAcgnBigCatID["COMIC"] = 0] = "COMIC";
    /**
     * 1为轻小说
     */
    EnumDmzjAcgnBigCatID[EnumDmzjAcgnBigCatID["NOVEL"] = 1] = "NOVEL";
})(EnumDmzjAcgnBigCatID = exports.EnumDmzjAcgnBigCatID || (exports.EnumDmzjAcgnBigCatID = {}));
var EnumNumberBoolean;
(function (EnumNumberBoolean) {
    EnumNumberBoolean[EnumNumberBoolean["FALSE"] = 0] = "FALSE";
    EnumNumberBoolean[EnumNumberBoolean["TRUE"] = 1] = "TRUE";
})(EnumNumberBoolean = exports.EnumNumberBoolean || (exports.EnumNumberBoolean = {}));
var EnumWebSubscribeTypeID;
(function (EnumWebSubscribeTypeID) {
    /**
     * 漫画
     */
    EnumWebSubscribeTypeID[EnumWebSubscribeTypeID["COMIC"] = 1] = "COMIC";
    /**
     * 轻小说
     */
    EnumWebSubscribeTypeID[EnumWebSubscribeTypeID["NOVEL"] = 4] = "NOVEL";
    /**
     * 動畫
     */
    EnumWebSubscribeTypeID[EnumWebSubscribeTypeID["ANIME"] = 3] = "ANIME";
})(EnumWebSubscribeTypeID = exports.EnumWebSubscribeTypeID || (exports.EnumWebSubscribeTypeID = {}));
exports.DMZJ_NOVEL_TAGS = [
    "侦探",
    "其它",
    "冒险",
    "励志",
    "历史",
    "后宫",
    "奇幻",
    "异界",
    "异能",
    "恐怖",
    "战争",
    "搞笑",
    "机战",
    "校园",
    "格斗",
    "治愈",
    "爱情",
    "百合",
    "神鬼",
    "科幻",
    "穿越",
    "都市",
    "魔法"
];
//# sourceMappingURL=types.js.map