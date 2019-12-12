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
import { IDmzjClientNovelRecentUpdateAll } from 'dmzj-api/lib/types';
import moment from 'moment';

let ls1 = gitDiffStagedFile(join(__root, 'data'));

let ls2 = matchGlob(ls1, [
	'**/*',
]);

if (ls2.length)
{
	console.dir(ls2);

	crossSpawnSync('git', [
		'add',
		'.',
	], {
		cwd: join(__root, 'data'),
		stdio: 'inherit',
	});

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

		let json = readJSONSync(join(__root, 'data/novel/recentUpdate.json')) as IDmzjClientNovelRecentUpdateAll;

		let ids = ls3
			.map(v => parsePath(v).name)
		;

		//console.dir(ids);

		msg = json.list.reduce((a, v) => {

			let id = v.id.toString();

			if (ids.includes(id))
			{
				a.push(`- ${id.padStart(4, '0')} ${v.name} ${moment.unix(v.last_update_time).format()} ${v.last_update_volume_name} ${v.last_update_chapter_name}`)
			}

			return a;
		}, [`, novel x ${ls3.length}\n`] as string[]).join('\n')

	}

	//console.dir(`update cache${msg}`);

	crossSpawnSync('git', [
		'commit',
		'-m',
		`update cache${msg}`,
	], {
		cwd: join(__root, 'data'),
		stdio: 'inherit',
	});
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
	`update temp cache`,
], {
	cwd: join(__root, 'test/temp'),
	stdio: 'inherit',
});
