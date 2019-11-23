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

	crossSpawnSync('git', [
		'commit',
		'-m',
		`update cache`,
	], {
		cwd: join(__root, 'data'),
		stdio: 'inherit',
	});
}
