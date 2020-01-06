/**
 * Created by user on 2020/1/6.
 */

import { crossSpawnSync } from '@node-novel/site-cache-util/lib/git';
import { buildGitRemote } from '../lib/git';
import { lazyRun } from '@node-novel/site-cache-util/lib/index';
import { __root } from '../lib/index';
import { getGitHubEnv } from '../lib/env';

export default lazyRun(async () => {

	let { GITHUB_ACTOR, GITHUB_TOKEN } = getGitHubEnv();

	let remote_repo = buildGitRemote({
		user: GITHUB_ACTOR,
		pass: GITHUB_TOKEN,
		host: 'github.com',
		repo: 'bluelovers/ws-rest',
	});

	crossSpawnSync('git', [
		'push',
		remote_repo,
		`HEAD:master`,
	], {
		cwd: __root,
		stdio: 'inherit',
	});

}, {
	pkgLabel: __filename,
});
