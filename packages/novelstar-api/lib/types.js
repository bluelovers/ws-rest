"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EnumOrder = exports.EnumTimesUnit = exports.EnumWriting = void 0;
var EnumWriting;
(function (EnumWriting) {
    /**
     * 連載中
     */
    EnumWriting[EnumWriting["writing"] = 1] = "writing";
    /**
     * 完本
     */
    EnumWriting[EnumWriting["done"] = 99] = "done";
})(EnumWriting = exports.EnumWriting || (exports.EnumWriting = {}));
var EnumTimesUnit;
(function (EnumTimesUnit) {
    EnumTimesUnit["days"] = "days";
    EnumTimesUnit["month"] = "month";
})(EnumTimesUnit = exports.EnumTimesUnit || (exports.EnumTimesUnit = {}));
var EnumOrder;
(function (EnumOrder) {
    EnumOrder["hot"] = "";
    /**
     * 推薦數
     */
    EnumOrder["ticket"] = "ticket";
    /**
     * 推薦數
     */
    EnumOrder["favor"] = "favor";
    /**
     * 點擊數
     */
    EnumOrder["view"] = "view";
    /**
     * 訂閱數
     */
    EnumOrder["orders"] = "orders";
})(EnumOrder = exports.EnumOrder || (exports.EnumOrder = {}));
//# sourceMappingURL=types.js.map