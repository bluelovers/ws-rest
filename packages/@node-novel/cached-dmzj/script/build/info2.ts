import fs from 'fs-extra';
import path from "path";
import Bluebird from 'bluebird';
import { __root } from '../util';
import sortObject from'sort-object-keys2';
import { IDmzjNovelInfo, IDmzjNovelInfoWithChapters } from 'dmzj-api/lib/types';
import { pick, sortBy } from'lodash';

export default (async () => {

	let json = await fs.readJSON(path.join(__root, 'data/novel/info.pack.json')) as Record<string, IDmzjNovelInfoWithChapters>;

	let json2 = sortBy(json, (v) => {
		return v.last_update_time
	}).reverse();

	let id_update: number[] = [];

	let data = await Bluebird.resolve(Object.entries(json2))
		.reduce((a, [id, v]: [string, IDmzjNovelInfoWithChapters]) => {

			let row = pick(v, [
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

			] as (keyof IDmzjNovelInfoWithChapters)[]);

			row.introduction = row.introduction
				.replace(/  +/g, ' ')
				.replace(/　　+/g, '　')
				.trim()
			;

			// @ts-ignore
			row.volume_data = Object.values(v.chapters)
				.map((volume) => {

					let chapters = Object.values(volume.chapters)
						.map(chapter => {
							return chapter.chapter_name
						})
					;

					if (chapters.length > 5)
					{
						chapters = [...chapters.slice(0, 2), '...', ...chapters.slice(-3)]
					}

					return {
						volume_name: volume.volume_name,
						chapters,
					}
				})
			;

			a.push(row);

			id_update.push(v.id);

			return a
		}, [])
	;

	await Bluebird.all([
		fs.writeJSON(path.join(__root, 'test/temp/info2.json'), data.filter(v => v.status != '已完结'), {
			spaces: 2,
		}),
		fs.writeJSON(path.join(__root, 'test/temp/info3.json'), data.filter(v => v.status == '已完结'), {
			spaces: 2,
		}),
		fs.writeJSON(path.join(__root, 'data', 'novel', `id_update.json`), id_update, {
			spaces: 2,
		}),
	]);

})();
