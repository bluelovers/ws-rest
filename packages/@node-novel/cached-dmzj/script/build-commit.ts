/**
 * Created by user on 2019/7/7.
 */

import { gitDiffStagedDir, gitDiffStagedFile, gitDiffStaged } from '@git-lazy/diff-staged';
import matchGlob from '@git-lazy/util/util/match';
import { join } from 'path';
import { crossSpawnSync, SpawnSyncOptions, SpawnSyncReturns } from '@git-lazy/util/spawn/git';
import { crossSpawnOutput } from '@git-lazy/util/spawn/util';

let ls1 = gitDiffStagedFile(join(__dirname, '../data'));

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
		cwd: join(__dirname, '../data'),
		stdio: 'inherit',
	});

	crossSpawnSync('git', [
		'commit',
		'-m',
		`update cache`,
	], {
		cwd: join(__dirname, '../data'),
		stdio: 'inherit',
	});
}

crossSpawnSync('git', [
	'add',
	'task001.json',
], {
	cwd: join(__dirname, '../test/temp'),
	stdio: 'inherit',
});

crossSpawnSync('git', [
	'commit',
	'-m',
	`update cache`,
], {
	cwd: join(__dirname, '../test/temp'),
	stdio: 'inherit',
});
