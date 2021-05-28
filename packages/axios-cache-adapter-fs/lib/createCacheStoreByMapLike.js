"use strict";
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _CacheStoreByMapLike_map;
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCacheStoreByMapLike = exports.CacheStoreByMapLike = void 0;
class CacheStoreByMapLike {
    constructor(map) {
        _CacheStoreByMapLike_map.set(this, void 0);
        __classPrivateFieldSet(this, _CacheStoreByMapLike_map, map, "f");
    }
    async getItem(key) {
        return __classPrivateFieldGet(this, _CacheStoreByMapLike_map, "f").get(key);
    }
    async setItem(key, value) {
        await __classPrivateFieldGet(this, _CacheStoreByMapLike_map, "f").set(key, value);
        return __classPrivateFieldGet(this, _CacheStoreByMapLike_map, "f").get(key);
    }
    async removeItem(key) {
        await __classPrivateFieldGet(this, _CacheStoreByMapLike_map, "f").delete(key);
        return;
    }
    async clear() {
        await __classPrivateFieldGet(this, _CacheStoreByMapLike_map, "f").clear();
        return;
    }
    async length() {
        return __classPrivateFieldGet(this, _CacheStoreByMapLike_map, "f").size;
    }
    async iterate(fn) {
        const entries = __classPrivateFieldGet(this, _CacheStoreByMapLike_map, "f").entries();
        for await (let [key, value] of entries) {
            await fn(value, key);
        }
        return entries;
    }
    get store() {
        return Object.fromEntries(__classPrivateFieldGet(this, _CacheStoreByMapLike_map, "f").entries());
    }
}
exports.CacheStoreByMapLike = CacheStoreByMapLike;
_CacheStoreByMapLike_map = new WeakMap();
function createCacheStoreByMapLike(map) {
    return new CacheStoreByMapLike(map);
}
exports.createCacheStoreByMapLike = createCacheStoreByMapLike;
//# sourceMappingURL=createCacheStoreByMapLike.js.map