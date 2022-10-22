"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const workspaces_config_1 = require("workspaces-config");
const bluebird_1 = tslib_1.__importDefault(require("bluebird"));
const bluebird_2 = tslib_1.__importDefault(require("@bluelovers/fast-glob/bluebird"));
const upath2_1 = tslib_1.__importDefault(require("upath2"));
const fs_extra_1 = require("fs-extra");
console.log((0, workspaces_config_1.parseStaticPackagesPaths)((0, workspaces_config_1.getConfig)()));
bluebird_2.default
    .async((0, workspaces_config_1.parseStaticPackagesPaths)((0, workspaces_config_1.getConfig)()).all.map(v => upath2_1.default.join(v, 'package.json')), {
    cwd: upath2_1.default.join(__dirname, '..'),
    absolute: true,
})
    .reduce(async (a, file) => {
    let json = await (0, fs_extra_1.readJSON)(file);
    a[json.name] = {
        name: json.name,
        version: json.version,
        file,
        json,
    };
    return a;
}, {})
    .then(data => {
    return bluebird_1.default
        .resolve(Object.keys(data))
        .map(name => {
        const row = data[name];
        let changed;
        [
            'devDependencies',
            'dependencies',
            'peerDependencies',
            'optionalDependencies',
        ].forEach(key => {
            let map = row.json[key];
            if (map != null) {
                Object.entries(map)
                    .forEach(([k, v]) => {
                    let r = data[k];
                    if (r) {
                        let v2 = `^${r.version}`;
                        if (v2 != v) {
                            map[k] = v2;
                            changed = true;
                        }
                    }
                });
            }
        });
        if (changed) {
            return (0, fs_extra_1.writeJSON)(row.file, row.json, {
                spaces: 2,
            })
                .then(v => console.log(row.file));
        }
    });
});
//# sourceMappingURL=fix-version.js.map