import { console } from '@node-novel/site-cache-util';
import { assert, expect } from 'chai';
import FastGlob from '@bluelovers/fast-glob/bluebird';
import { lazyRun, path } from '@node-novel/site-cache-util/lib/index';

export default lazyRun(async () => {

	let __root = path.join(__dirname, '..', '..', '..');

	console.log(`__root:`, __root);

	let ls = await FastGlob.async([
		'cached-*/test/temp/*'
	], {
		cwd: path.join(__root, 'packages/@node-novel')
	});

	console.log(`cached temp files`, ls.length);
	console.dir(ls);

}, {
	pkgLabel: __filename,
})
