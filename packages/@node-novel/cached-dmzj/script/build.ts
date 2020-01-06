/**
 * Created by user on 2019/7/28.
 */
import { lazyImport, lazyRun } from '@node-novel/site-cache-util/lib/index';
import { pkgLabel } from './util/main';

export default lazyRun(async () => {

	await lazyImport('./build/dmzj', require);
	await lazyImport('./build/info', require);
	await lazyImport('./build/tags', require);
	await lazyImport('./build/info2', require);

}, {
	pkgLabel,
})
