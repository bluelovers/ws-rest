/**
 * Created by user on 2019/7/7.
 */
import { lazyImport, lazyRun } from '@node-novel/site-cache-util/lib/index';
import { pkgLabel } from './util/main';

export default lazyRun(async () => {

	await lazyImport('./build/manga-list', require);

	await lazyImport('./build/manga-detail', require);

}, {
	pkgLabel,
});
