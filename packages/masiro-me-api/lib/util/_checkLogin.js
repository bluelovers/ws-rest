"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports._checkLogin = _checkLogin;
function _checkLogin($) {
    let username = $('.main-header .user .dropdown-toggle span:eq(0)')
        .text()
        .replace(/^\s+|\s+$/g, '');
    if (username === null || username === void 0 ? void 0 : username.length) {
        return username;
    }
}
//# sourceMappingURL=_checkLogin.js.map