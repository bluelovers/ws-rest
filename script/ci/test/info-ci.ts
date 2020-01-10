/**
 * Created by user on 2020/1/10.
 */
import { lazyRun, path, console } from '@node-novel/site-cache-util/lib/index';
import envCi from 'env-ci';
import { __rootWs } from '../../project-root';

export default lazyRun(async () => {

	console.dir(envCi({
		cwd: __rootWs,
	}));

}, {
	pkgLabel: __filename,
})
