/**
 * Created by user on 2019/7/7.
 */

import { lazyImport, lazyRun } from '@node-novel/site-cache-util/lib/index';
import { pkgLabel } from './util/main';

export default lazyRun(async () => {

	await lazyImport('./build/toplist', require);

	await lazyImport('./build/task001', require);

	await lazyImport('./build/merge', require);

	await lazyImport('./build/cache', require);

	await lazyImport('./build/task_logined', require);

}, {
	pkgLabel,
})
