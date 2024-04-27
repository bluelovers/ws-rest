"use strict";
/// <reference types="jquery" />
Object.defineProperty(exports, "__esModule", { value: true });
exports._checkLoginByJQuery = _checkLoginByJQuery;
exports._checkLoginUsername = _checkLoginUsername;
function _checkLoginByJQuery($) {
    return $('#user-login a[href^="u.php"], #user-login a[href*="action-quit-verify-"]')
        .length > 1;
}
function _checkLoginUsername($) {
    if (_checkLoginByJQuery($)) {
        let user = $('#user-login a[href^="u.php"]')
            .text()
            .replace(/^\s+|\s+$/g, '');
        if (user.length) {
            return user;
        }
    }
    return;
}
//# sourceMappingURL=_checkLogin.js.map