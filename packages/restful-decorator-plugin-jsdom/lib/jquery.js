"use strict";
/**
 * Created by user on 2019/12/16.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports._p_2_br = _p_2_br;
function _p_2_br(target, $, add_lf) {
    let append = '';
    if (add_lf === true) {
        append = '\n';
    }
    else if (typeof add_lf === 'string') {
        append = add_lf;
    }
    return $(target)
        .each(function (i, elem) {
        let _this = $(elem);
        let _html = _this
            .html()
            .replace(/(?:&nbsp;?)/g, ' ')
            .replace(/[\xA0\s]+$/g, '');
        if (_html == '<br/>' || _html == '<br>') {
            _html = '';
        }
        _this.after(`${_html}<br/>${append}`);
        _this.remove();
    });
}
//# sourceMappingURL=jquery.js.map