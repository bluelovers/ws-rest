/**
 * Created by user on 2020/1/7.
 */

import { lazyRun, lazyImport, console } from '@node-novel/site-cache-util/lib/index';

export default lazyRun(async () => {

	await lazyImport('./test/chk-moment', require);

	await lazyImport('./test/chk-cache', require);

	await lazyImport('./test/try-cache', require);

	await lazyImport('./test/chk-env', require);

	await lazyImport('./test/info-ci', require);

}, {
	pkgLabel: __filename,
})
	.tapCatch(e => {
		console.exception(e);

		process.exit(1);
	})
;
