import { assert, expect } from 'chai';
import FastGlob from '@bluelovers/fast-glob/bluebird';
import { lazyRun, path, console } from '@node-novel/site-cache-util/lib/index';
import { __rootWs } from '../../project-root';
import Bluebird from 'bluebird';
import fs from 'fs-extra';
import { filesize } from 'filesize';

export default lazyRun(async () => {

	let __root = __rootWs;

	console.log(`__root:`, __root);

	let cwd = path.join(__root, 'packages/@node-novel');

	let ls = await FastGlob.async([
		'cached-*/test/temp/*',
	], {
		cwd,
		ignore: [
			'**/task001.json',
			'cached-dmzj/test/temp/info2.json',
			'cached-dmzj/test/temp/info3.json',
		],
	});

	console.log(`cached temp files`, ls.length, "\n");

	await Bluebird.resolve(ls)
		.each(async (v) => {

			let stat = await fs.stat(path.join(cwd, v));

			console.log("\t", v, `=>`, filesize(stat.size));
		})
	;

	console.log("\n");

	//console.dir(ls);

}, {
	pkgLabel: __filename,
})
