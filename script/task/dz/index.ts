/**
 * Created by user on 2020/1/19.
 */

import ApiClient from 'discuz-api/lib/index';
import Bluebird from 'bluebird';
import { config } from 'dotenv'
import { consoleDebug } from '@node-novel/cached-masiro/script/util';
import {
	IJSDOM,
} from 'jsdom-extra';
import { lazyRun } from '@node-novel/site-cache-util/lib/index';

export interface IMY_HASHED_JSON_ROW
{
	baseURL: string,
	cookies: Record<string, string>,
}

export default lazyRun(async () => {

	await Bluebird.resolve().tap(e => config()).catch(e => null);

	consoleDebug.info(`執行 discuz 模組`);

	await Bluebird.resolve(process.env.MY_HASHED_JSON)
		.then<IMY_HASHED_JSON_ROW[]>((envValue) => {
			return JSON.parse(Buffer.from(envValue, 'base64').toString()) || []
		})
		.catch(e => [] as IMY_HASHED_JSON_ROW[])
		.tap(ls => consoleDebug.info(`list count:`, ls.length))
		.each(async (options) => {

			let { baseURL, cookies } = options;

			const api = new ApiClient({
				baseURL,
			});

			api.loginByCookiesSync(cookies);

			await api.taskList()
				.then(data => {

					consoleDebug.dir(data);

					return data.allow
				})
				.mapSeries(task => {
					return api
						.taskApply(task.task_id)
						.tap(e => {
							consoleDebug.debug(`[task]`, task);
						})
						;
				})
			;

			await api.isLogin()
				.tap(async function (this: ApiClient) {
					const jsdom = this.$returnValue as IJSDOM;
					const { $ } = jsdom;

					let _a = $('#my_amupper');

					if (_a.length)
					{
						let href = _a.attr('onclick').match(/ajaxget\('([^\']+)'/)[1];

						//console.dir(href);

						await Bluebird.resolve(api.$http.get(href))
							//.tap(v => console.log(typeof v, v, v.toString()))
							.catch(e => null)
						;

						return api.isLogin();
					}
				})
				.catch(e => null)
			;

		})
	;

}, {
	pkgLabel: __filename,
})
