import path from "path";
import { __root } from './util';
import fs from 'fs-extra';
import Bluebird from 'bluebird-cancellation';
import { IDmzjClientNovelRecentUpdateAll } from 'dmzj-api/lib/types';
import { fixDmzjNovelInfo } from 'dmzj-api/lib/util';

const file = path.join(__root, 'data', 'novel/recentUpdate.json');


Bluebird
	.resolve(fs.readJSON(file))
	.then((data: IDmzjClientNovelRecentUpdateAll) => {

		data.list = data.list.map(fixDmzjNovelInfo);

		return fs.outputJSON(file, data, {
			spaces: 2,
		})
	})
;

