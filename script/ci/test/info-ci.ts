/**
 * Created by user on 2020/1/10.
 */
import { lazyRun, path, console } from '@node-novel/site-cache-util/lib/index';
import envCi from 'env-ci';
import { __rootWs } from '../../project-root';
import crossCi from 'cross-ci';

export default lazyRun(async () => {


	console.cyan.log('env-ci');
	console.dir(envCi({
		cwd: __rootWs,
	}));

	console.cyan.log('cross-ci');

	let vls = {
		...crossCi.vars,
	};

	Object.keys(vls)
		.forEach((k) => {

			if (/token/i.test(k))
			{
				// @ts-ignore
				vls[k] = `***(${k in vls}, ${(vls[k] != null) && vls[k].length})***`;
			}

		})
	;

	console.dir(vls);

}, {
	pkgLabel: __filename,
})
