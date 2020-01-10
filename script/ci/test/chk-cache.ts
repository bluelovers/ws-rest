import { console } from '@node-novel/site-cache-util';
import { assert, expect } from 'chai';
import FastGlob from '@bluelovers/fast-glob/bluebird';
import { lazyRun, path, console } from '@node-novel/site-cache-util/lib/index';
import { __rootWs } from '../../project-root';

export default lazyRun(async () => {

	let __root = __rootWs;

	console.log(`__root:`, __root);

	let ls = await FastGlob.async([
		'cached-*/test/temp/*',
	], {
		cwd: path.join(__root, 'packages/@node-novel'),
		ignore: [
			'**/task001.json',
			'cached-dmzj/test/temp/info2.json',
			'cached-dmzj/test/temp/info3.json',
		],
	});

	console.log(`cached temp files`, ls.length);
	console.dir(ls);

}, {
	pkgLabel: __filename,
})
