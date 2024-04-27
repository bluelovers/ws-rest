"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LazyURLSearchParams = void 0;
exports._core = _core;
exports.transformKey = transformKey;
exports.transformValue = transformValue;
const SymTransform = Symbol('transform');
const SymOptions = Symbol('options');
class LazyURLSearchParams extends URLSearchParams {
    [SymTransform](value, options) {
        options = options || this[SymOptions];
        return transformValue(value, options);
    }
    constructor(init, options) {
        if (!options) {
            if (init instanceof LazyURLSearchParams) {
                options = Object.assign({}, init[SymOptions]);
            }
            else {
                options = {};
            }
        }
        if (options.transform == null) {
            options.transform = true;
        }
        super(_core(init, options));
        this[SymOptions] = options;
    }
    /**
     * all null value will transform to ''
     */
    append(name, value, options) {
        options = options || this[SymOptions];
        if (options.transform) {
            value = this[SymTransform](value, options);
        }
        super.append(name, value);
    }
    /**
     * all null value will transform to ''
     */
    set(name, value, options) {
        options = options || this[SymOptions];
        if (options.transform) {
            value = this[SymTransform](value, options);
        }
        super.set(name, value);
    }
    /**
     * append
     */
    push(...values) {
        values.forEach(([k, v]) => this.append(k, v));
    }
    /**
     * set
     */
    extend(values, options) {
        Object.entries(values).forEach(([k, v]) => this.set(k, v, options));
    }
    clone() {
        return new LazyURLSearchParams(this);
    }
    toString() {
        return super.toString();
    }
}
exports.LazyURLSearchParams = LazyURLSearchParams;
function _core(init, options) {
    options = options || {};
    //console.dir(options);
    if (typeof init != 'string' && options.transform && !(init instanceof URLSearchParams) && init) {
        const { emptyValueToKeyOnly } = options;
        if (!Array.isArray(init)) {
            init = Object.entries(init);
        }
        let arr = init.reduce((arr, [key, value]) => {
            if (value == null || emptyValueToKeyOnly && value === '') {
                arr.push(transformKey(key));
            }
            else {
                let u = new URLSearchParams();
                u.append(key, transformValue(value, options));
                arr.push(u.toString());
            }
            return arr;
        }, []);
        init = arr.join('&');
    }
    else if (init == null) {
        init = void 0;
    }
    //console.dir(init);
    return init;
}
function transformKey(value) {
    return encodeURIComponent(value);
}
function transformValue(value, options) {
    if (value == null) {
        if (options && options.allowNull) {
            return value;
        }
        return '';
    }
    else if (typeof value === 'object') {
        return JSON.stringify(value);
    }
    return value.toString();
}
exports.default = LazyURLSearchParams;
//# sourceMappingURL=index.js.map