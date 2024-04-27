"use strict";
var _CacheStoreByMapLike_map;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CacheStoreByMapLike = void 0;
exports.createCacheStoreByMapLike = createCacheStoreByMapLike;
const tslib_1 = require("tslib");
class CacheStoreByMapLike {
    constructor(map) {
        _CacheStoreByMapLike_map.set(this, void 0);
        tslib_1.__classPrivateFieldSet(this, _CacheStoreByMapLike_map, map, "f");
    }
    async getItem(key) {
        return tslib_1.__classPrivateFieldGet(this, _CacheStoreByMapLike_map, "f").get(key);
    }
    async setItem(key, value) {
        await tslib_1.__classPrivateFieldGet(this, _CacheStoreByMapLike_map, "f").set(key, value);
        return tslib_1.__classPrivateFieldGet(this, _CacheStoreByMapLike_map, "f").get(key);
    }
    async removeItem(key) {
        await tslib_1.__classPrivateFieldGet(this, _CacheStoreByMapLike_map, "f").delete(key);
        return;
    }
    async clear() {
        await tslib_1.__classPrivateFieldGet(this, _CacheStoreByMapLike_map, "f").clear();
        return;
    }
    async length() {
        return tslib_1.__classPrivateFieldGet(this, _CacheStoreByMapLike_map, "f").size;
    }
    async iterate(fn) {
        const entries = tslib_1.__classPrivateFieldGet(this, _CacheStoreByMapLike_map, "f").entries();
        for await (let [key, value] of entries) {
            await fn(value, key);
        }
        return entries;
    }
    get store() {
        return Object.fromEntries(tslib_1.__classPrivateFieldGet(this, _CacheStoreByMapLike_map, "f").entries());
    }
}
exports.CacheStoreByMapLike = CacheStoreByMapLike;
_CacheStoreByMapLike_map = new WeakMap();
function createCacheStoreByMapLike(map) {
    return new CacheStoreByMapLike(map);
}
//# sourceMappingURL=createCacheStoreByMapLike.js.map