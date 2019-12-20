/**
 * Created by user on 2019/7/7.
 */

import { gitDiffStagedDir, gitDiffStagedFile, gitDiffStaged } from '@git-lazy/diff-staged';
import matchGlob from '@git-lazy/util/util/match';
import { join, parse as parsePath } from 'path';
import { crossSpawnSync, SpawnSyncOptions, SpawnSyncReturns } from '@git-lazy/util/spawn/git';
import { crossSpawnOutput } from '@git-lazy/util/spawn/util';
import { readJSONSync } from 'fs-extra';
import { __root } from './util';
import moment from 'moment';
import { reportDiffStagedNovels } from '@node-novel/site-cache-util/lib/git';
import { IESJzoneRecentUpdateRowBook } from 'esjzone-api/lib/types';
import packageJson from '../package.json';

export default (async () => {

	const pkgLabel = `[${packageJson.name}] `;

	crossSpawnSync('git', [
		'add',
		'.',
	], {
		cwd: join(__root, 'data'),
		stdio: 'inherit',
	});

	let ls1 = gitDiffStagedFile(join(__root, 'data'));

	let ls2 = matchGlob(ls1, [
		'**/*',
	]);

	if (ls2.length)
	{
		console.dir(ls2);

		let msg = await reportDiffStagedNovels({
			git_root: join(__root, 'data'),
			callback(json: IESJzoneRecentUpdateRowBook, id: string)
			{
				return `- ${id.padStart(4, '0')} ${json.name} ${moment.unix(json.last_update_time)
					.format()} ${json.last_update_chapter_name}`;
			}
		});

		crossSpawnSync('git', [
			'add',
			'task001.json',
		], {
			cwd: join(__root, 'test/temp'),
			stdio: 'inherit',
		});

		crossSpawnSync('git', [
			'commit',
			'-m',
			`${pkgLabel}update cache${msg}`,
		], {
			cwd: join(__root, 'data'),
			stdio: 'inherit',
		});

		if (msg)
		{
			console.log(msg)
		}
	}

})();

