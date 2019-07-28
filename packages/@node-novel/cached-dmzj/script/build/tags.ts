/**
 * Created by user on 2019/7/28.
 */

import { getDmzjClient, __root, console, consoleDebug, trim } from '../util';
import path from "path";
import fs from 'fs-extra';
import Bluebird from 'bluebird';
import { IDmzjNovelInfo, IDmzjNovelInfoRecentUpdateRow } from 'dmzj-api/lib/types';
import moment from 'moment';
import FastGlob from '@bluelovers/fast-glob/bluebird';
import { array_unique_overwrite } from 'array-hyper-unique';
import { fixDmzjNovelTags, trimUnsafe } from 'dmzj-api/lib/util';

export default (async () =>
{
	const { api, saveCache } = await getDmzjClient();

	let tags: string[] = [];
	let authors: string[] = [];
	let zone: string[] = [];
	let titles: string[] = [];

	await FastGlob.async([
		'*.json',
	], {
		cwd: path.join(__root, 'data', 'novel/info'),
		absolute: true,
	})
		.each(async (file) => {

			let v: IDmzjNovelInfo = await fs.readJSON(file);

			tags.push(...fixDmzjNovelTags(v.types));

			authors.push(trimUnsafe(v.authors));

			zone.push(trimUnsafe(v.zone));

			titles.push(trimUnsafe(v.name));

		})
	;

	array_unique_overwrite(tags).sort();
	array_unique_overwrite(authors).sort();
	array_unique_overwrite(zone).sort();
	array_unique_overwrite(titles).sort();

	await Bluebird.all([
		fs.outputJSON(path.join(__root, 'data', 'novel', `tags.json`), tags, {
			spaces: 2,
		}),
		fs.outputJSON(path.join(__root, 'data', 'novel', `zone.json`), zone, {
			spaces: 2,
		}),
		fs.outputJSON(path.join(__root, 'data', 'novel', `authors.json`), authors, {
			spaces: 2,
		}),fs.outputJSON(path.join(__root, 'data', 'novel', `titles.json`), titles, {
			spaces: 2,
		}),

	]);

})();
