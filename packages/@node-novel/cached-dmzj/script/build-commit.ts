/**
 * Created by user on 2019/7/7.
 */

import {
	gitDiffStagedDir,
	gitDiffStagedFile,
	gitDiffStaged,
	matchGlob,
	crossSpawnSync,
	SpawnSyncOptions,
	SpawnSyncReturns
} from '@node-novel/site-cache-util/lib/git';

import { join, parse as parsePath } from 'path';
import { crossSpawnOutput } from '@git-lazy/util/spawn/util';
import { readJSONSync } from 'fs-extra';
import { __root } from './util';
import { IDmzjClientNovelRecentUpdateAll, IDmzjNovelInfoWithChapters } from 'dmzj-api/lib/types';
import { moment, toMoment, unixMoment } from '@node-novel/site-cache-util/lib/moment';
import packageJson from '../package.json';
import { skipCi } from '@node-novel/site-cache-util/lib/ci';
import { console } from '@node-novel/site-cache-util/lib';
import { lazyRun } from '@node-novel/site-cache-util/lib/index';

import { pkgLabel } from './util/main';
import cacheFilePaths, { cacheFileInfoPath } from './util/files';

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

	ls1 = gitDiffStagedFile(join(__root, 'data'));
	ls2 = matchGlob(ls1, [
		'**/*',
	]);

	let ls3 = matchGlob(ls1, [
		'novel/info/*.json',
	]);

	let msg = '';

	if (ls3.length)
	{
		//console.dir(ls3);

		let json = readJSONSync(cacheFilePaths.recentUpdate) as IDmzjClientNovelRecentUpdateAll;

		let ids = ls3
			.map(v => parsePath(v).name)
		;

		//console.dir(ids);

		msg = json.list.reduce((a, v) => {

			let id = v.id.toString();

			if (ids.includes(id))
			{
				let json = readJSONSync(cacheFileInfoPath(id)) as IDmzjNovelInfoWithChapters;

				let cs = 0;
				let vs = 0;

				cs = json.chapters.reduce((len, vol) => {
					vs++;
					return len += vol.chapters.length;
				}, 0);

				a.push(`- ${id.padStart(4, '0')} ${v.name} ${moment.unix(v.last_update_time).format()} ${v.last_update_volume_name} ${v.last_update_chapter_name} c:${cs} v:${vs}`)
			}

			return a;
		}, [`, novel x ${ls3.length}\n`] as string[]).join('\n')

	}

	//console.dir(`update cache${msg}`);

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

crossSpawnSync('git', [
	'add',
	'.',
], {
	cwd: join(__root, 'test/temp'),
	stdio: 'inherit',
});

crossSpawnSync('git', [
	'commit',
	'-m',
	`${pkgLabel}update temp cache${skipCi()}`,
], {
	cwd: join(__root, 'test/temp'),
	stdio: 'inherit',
});

}, {
	pkgLabel: __filename,
});
