/**
 * Created by user on 2020/1/19.
 */

import { lazyRun, lazyImport } from '@node-novel/site-cache-util/lib/index';

export default lazyRun(async () => {

	await lazyImport('./dz', require).catch(e => null);

	await lazyImport('@node-novel/cached-masiro/script/build/task_logined', require).catch(e => null);

}, {
	pkgLabel: __filename,
})
