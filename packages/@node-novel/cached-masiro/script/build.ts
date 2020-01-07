/**
 * Created by user on 2019/7/7.
 */

import { lazyImport, lazyRun } from '@node-novel/site-cache-util/lib/index';
import { pkgLabel } from './util/main';
import { consoleDebug, getApiClient, console } from './util';
import Bluebird from 'bluebird-cancellation';

export default lazyRun(async () => {


	let bool = await Bluebird.resolve(getApiClient())
		.catch(e => {

			console.red.dir(e);
			console.red(`伺服器可能發生錯誤，無法連線`);

			return null
		})
	;

	if (bool == null)
	{
		return;
	}

	await lazyImport('./build/toplist', require);

	await lazyImport('./build/task001', require);

	await lazyImport('./build/merge', require);

	await lazyImport('./build/merge002', require);

	await lazyImport('./build/cache', require);

	await lazyImport('./build/task_logined', require);

}, {
	pkgLabel,
})
