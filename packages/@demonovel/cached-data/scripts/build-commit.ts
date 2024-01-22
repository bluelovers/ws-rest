/**
 * Created by user on 2019/7/7.
 */

import { join } from 'path';
import { crossSpawnSync } from '@git-lazy/util/spawn/git';
import { skipCi } from '@node-novel/site-cache-util/lib/ci';
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
