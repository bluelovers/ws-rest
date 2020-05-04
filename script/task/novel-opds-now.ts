/**
 * Created by user on 2020/5/4.
 */

import { config } from 'dotenv'
import axios from 'axios';
import Bluebird from 'bluebird';
import { lazyRun } from '@node-novel/site-cache-util/lib/index';

export default lazyRun(async () =>
{
	await Bluebird.resolve().tap(e => config()).catch(e => null);

	await axios
		.get(process.env.NOW_DEPLOY_HOOK)
		.then(response => {
			console.dir(response.data)
		})
	;

}, {
	pkgLabel: __filename,
});
