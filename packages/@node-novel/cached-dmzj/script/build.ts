/**
 * Created by user on 2019/7/28.
 */
import { lazyImport, lazyRun } from '@node-novel/site-cache-util/lib/index';
import { pkgLabel } from './util/main';

export default lazyRun(async () => {

	await lazyImport('./build/dmzj');
	await lazyImport('./build/info');
	await lazyImport('./build/tags');
	await lazyImport('./build/info2');

}, {
	pkgLabel,
})
