/**
 * Created by user on 2019/7/7.
 */

import { gitDiffStagedDir, gitDiffStagedFile, gitDiffStaged } from '@git-lazy/diff-staged';
import matchGlob from '@git-lazy/util/util/match';
import { join, parse as parsePath } from 'path';
import { crossSpawnSync, SpawnSyncOptions, SpawnSyncReturns } from '@git-lazy/util/spawn/git';
import { crossSpawnOutput } from '@git-lazy/util/spawn/util';
import { readJSONSync } from 'fs-extra';
import { moment, toMoment, unixMoment } from '@node-novel/site-cache-util/lib/moment';
import { reportDiffStagedNovels } from '@node-novel/site-cache-util/lib/git';
import { IWenku8RecentUpdateRowBookWithChapters } from 'wenku8-api/lib/types';
import packageJson from '../package.json';
import { skipCi } from '@node-novel/site-cache-util/lib/ci';
import { console } from '@node-novel/site-cache-util/lib';
import { lazyRun } from '@node-novel/site-cache-util/lib/index';
import { __root } from '../lib/__root';

export default lazyRun(async () => {

	const pkgLabel = `[@demonovel/cached-data]`;

	crossSpawnSync('git', [
		'add',
		'.',
	], {
		cwd: join(__root, 'cache'),
		stdio: 'inherit',
	});

	crossSpawnSync('git', [
		'commit',
		'-m',
		`${pkgLabel} update cache ${skipCi()}`,
	], {
		cwd: __root,
		stdio: 'inherit',
	});

}, {
	pkgLabel: __filename,
});
