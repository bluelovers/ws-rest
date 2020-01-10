import { console } from '@node-novel/site-cache-util';
import { assert, expect } from 'chai';
import FastGlob from '@bluelovers/fast-glob/bluebird';
import { lazyRun, path } from '@node-novel/site-cache-util/lib/index';
import { __rootWs } from '../../project-root';
import fs from 'fs-extra';

export default lazyRun(async () => {

	let __root = __rootWs;

	await fs.ensureFile(path.join(__root, 'packages/@node-novel', 'cached-dmzj', 'test/temp', 'cache.ensure.txt'));

}, {
	pkgLabel: __filename,
});
