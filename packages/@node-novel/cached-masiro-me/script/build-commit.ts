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
import { moment, toMoment, unixMoment } from '@node-novel/site-cache-util/lib/moment';
import { reportDiffStagedNovels } from '@node-novel/site-cache-util/lib/git';
import { IESJzoneRecentUpdateRowBook } from 'esjzone-api/lib/types';
import packageJson from '../package.json';
import { skipCi } from '@node-novel/site-cache-util/lib/ci';
import { console } from '@node-novel/site-cache-util/lib';

import { pkgLabel } from './util/main';
import { lazyRun } from '@node-novel/site-cache-util/lib/index';
import { IMasiroMeBookWithChapters } from 'masiro-me-api/lib/types';

export default lazyRun(async () => {

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
			callback(json: IMasiroMeBookWithChapters, id: string)
			{
				let c = 0;
				let v = 0;

				if (json.chapters?.length)
				{
					c = json.chapters.reduce((len, vol) => {
						v++;
						return len + vol.chapters.length;
					}, 0);
				}

				return `- ${id.padStart(4, '0')} ${json.title} ${moment(json.updated)
					.format()} ${json.last_update_name} c:${c} v:${v}`;
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
			`${pkgLabel}update cache${msg}${skipCi()}`,
		], {
			cwd: join(__root, 'data'),
			stdio: 'inherit',
		});

		if (msg)
		{
			console.success(msg)
		}
	}

}, {
	pkgLabel: __filename,
});

