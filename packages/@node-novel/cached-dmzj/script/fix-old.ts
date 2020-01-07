import path from "path";
import { __root, getDmzjClient } from './util';
import fs from 'fs-extra';
import Bluebird from 'bluebird-cancellation';
import { IDmzjClientNovelRecentUpdateAll, IDmzjNovelInfo, IDmzjNovelInfoWithChapters } from 'dmzj-api/lib/types';
import { fixDmzjNovelInfo, fixDmzjNovelTags, trimUnsafe } from 'dmzj-api/lib/util';
import FastGlob from '@bluelovers/fast-glob/bluebird';
import { array_unique_overwrite } from 'array-hyper-unique';
import sortObject from 'sort-object-keys2';
import cacheFilePaths from './util/files';

export default (async () =>
{
	const file = cacheFilePaths.recentUpdate;

	await Bluebird
		.resolve(fs.readJSON(file))
		.then((data: IDmzjClientNovelRecentUpdateAll) => {

			data.list = data.list.map(fixDmzjNovelInfo);

			return fs.outputJSON(file, data, {
				spaces: 2,
			})
		})
	;

	await FastGlob.async([
			'*.json',
		], {
			cwd: path.join(__root, 'data', 'novel/info'),
			absolute: true,
		})
		.each(async (file) => {

			let v: IDmzjNovelInfoWithChapters = await fs.readJSON(file);

			return fs.writeJSON(file, fixDmzjNovelInfo(v), {
				spaces: 2,
			})

		})
	;

})();

