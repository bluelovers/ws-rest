/**
 * Created by user on 2020/1/7.
 */

import { lazyRun, lazyImport } from '@node-novel/site-cache-util/lib/index';

export default lazyRun(async () => {

	await lazyImport('./test/chk-moment', require);

	await lazyImport('./test/chk-github-actions', require);

}, {
	pkgLabel: __filename,
});
