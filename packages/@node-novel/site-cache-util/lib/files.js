"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createPkgPath = createPkgPath;
exports.createPkgCachePath = createPkgCachePath;
exports.wrapProxy = wrapProxy;
const tslib_1 = require("tslib");
const upath2_1 = tslib_1.__importDefault(require("upath2"));
const util_1 = tslib_1.__importDefault(require("util"));
const fs_extra_1 = tslib_1.__importDefault(require("fs-extra"));
function createPkgPath(__root) {
    if (!__root || !upath2_1.default.isAbsolute(__root)) {
        throw new RangeError(`__root should is absolute path, but got ${JSON.stringify(__root)}`);
    }
    let stat = fs_extra_1.default.statSync(__root);
    if (stat.isFile() || !stat.isDirectory()) {
        throw new TypeError(`__root should is a dir, but got ${JSON.stringify(__root)}`);
    }
    __root = upath2_1.default.normalize(__root);
    return {
        get __root() {
            return __root;
        },
        join(...paths) {
            return upath2_1.default.join(__root, ...paths);
        },
        resolve(...paths) {
            return upath2_1.default.resolve(__root, ...paths);
        },
        relative(...paths) {
            return upath2_1.default.relative(__root, paths[0]);
        },
    };
}
function createPkgCachePath(root, options = {}) {
    const pkgData = createPkgPath(root);
    const { join, resolve } = pkgData;
    let data = Object.assign(pkgData, {
        cacheFilePaths: {
            recentUpdate: join('data', 'novel/recentUpdate.json'),
            recentUpdateDay: join('data', 'novel/recentUpdateDay.json'),
            task001: join('test/temp', 'task001.json'),
            infoPack: join('data', 'novel/info.pack.json'),
            idAuthors: join('data/novel', 'id_authors.json'),
            idTitles: join('data/novel', 'id_titles.json'),
            idUpdate: join('data/novel', 'id_update.json'),
            idChapters: join('data/novel', 'id_chapters.json'),
            idVolumes: join('data/novel', 'id_volumes.json'),
            ids: join('data/novel', 'ids.json'),
            titles: join('data/novel', 'titles.json'),
            authors: join('data/novel', 'authors.json'),
            tags: join('data/novel', 'tags.json'),
            cookiesCacheFile: join('test/temp', 'axios.cookies.json'),
            axiosCacheFile: join('test/temp', 'axios.cache.json'),
            passwordLocalFile: join('test', 'password.local'),
            dirDataRoot: join('data'),
            dirTempRoot: join('test', 'temp'),
            ...Object.entries(options.map || {})
                .reduce((a, [k, v]) => {
                if (typeof v === 'string') {
                    a[k] = resolve(v);
                }
                else {
                    a[k] = resolve(...v);
                }
                return a;
            }, {}),
        },
        fn: {
            cacheFileInfoPath(id) {
                return join('data', `novel/info/${id}.json`);
            },
            ...Object.entries(options.fn || {})
                .reduce((a, [k, v]) => {
                // @ts-ignore
                a[k] = v.bind(pkgData);
                return a;
            }, {}),
        }
    });
    data.cacheFilePaths = wrapProxy(data.cacheFilePaths);
    data.fn = wrapProxy(data.fn);
    return wrapProxy(data);
}
function wrapProxy(target) {
    return new Proxy(target, {
        get(target, p, receiver) {
            if (p in target) {
                return Reflect.get(target, p, receiver);
            }
            else {
                throw new TypeError(`${util_1.default.inspect(target)} didn't has member ${util_1.default.inspect(p)}`);
            }
        },
        set(target, p, value, receiver) {
            throw new TypeError(`readonly`);
            return;
        },
    });
}
//# sourceMappingURL=files.js.map