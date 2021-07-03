"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const fs_extra_1 = (0, tslib_1.__importStar)(require("fs-extra"));
const path_1 = (0, tslib_1.__importDefault)(require("path"));
const bluebird_1 = (0, tslib_1.__importDefault)(require("bluebird"));
const util_1 = require("../util");
const lodash_1 = require("lodash");
const files_1 = (0, tslib_1.__importDefault)(require("../util/files"));
const index_1 = require("@node-novel/site-cache-util/lib/index");
exports.default = (0, index_1.lazyRun)(async () => {
    let json = await fs_extra_1.default.readJSON(path_1.default.join(util_1.__root, 'data/novel/info.pack.json'));
    let json2 = (0, lodash_1.sortBy)(json, (v) => {
        return v.last_update_time;
    }).reverse();
    let id_update = [];
    let id_chapters = {};
    let idVolumes = {};
    let data = await bluebird_1.default.resolve(Object.entries(json2))
        .reduce((a, [id, v]) => {
        let row = (0, lodash_1.pick)(v, [
            'id',
            'name',
            'authors',
            //'zone',
            'status',
            'last_update_volume_name',
            //'last_update_chapter_name',
            'last_update_time',
            //'cover',
            'introduction',
            //'types',
        ]);
        row.introduction = row.introduction
            .replace(/  +/g, ' ')
            .replace(/　　+/g, '　')
            .trim();
        // @ts-ignore
        row.volume_data = Object.values(v.chapters)
            .map((volume) => {
            let chapters = Object.values(volume.chapters)
                .map(chapter => {
                return chapter.chapter_name;
            });
            if (chapters.length > 5) {
                chapters = [...chapters.slice(0, 2), '...', ...chapters.slice(-3)];
            }
            return {
                volume_name: volume.volume_name,
                chapters,
            };
        });
        idVolumes[row.id] = 0;
        id_chapters[row.id] = v.chapters.reduce((len, vol) => {
            idVolumes[row.id]++;
            return len += vol.chapters.length;
        }, 0);
        a.push(row);
        id_update.push(v.id);
        return a;
    }, []);
    await bluebird_1.default.all([
        fs_extra_1.default.writeJSON(path_1.default.join(util_1.__root, 'test/temp/info2.json'), data.filter(v => v.status != '已完结'), {
            spaces: 2,
        }),
        fs_extra_1.default.writeJSON(path_1.default.join(util_1.__root, 'test/temp/info3.json'), data.filter(v => v.status == '已完结'), {
            spaces: 2,
        }),
        fs_extra_1.default.writeJSON(path_1.default.join(util_1.__root, 'data', 'novel', `id_update.json`), id_update, {
            spaces: 2,
        }),
        (0, fs_extra_1.writeJSON)(files_1.default.idChapters, id_chapters, {
            spaces: 2,
        }),
        (0, fs_extra_1.writeJSON)(files_1.default.idVolumes, idVolumes, {
            spaces: 2,
        }),
    ]);
}, {
    pkgLabel: __filename
});
//# sourceMappingURL=info2.js.map