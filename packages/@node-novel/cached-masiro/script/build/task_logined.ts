import { consoleDebug, getApiClient } from '../util';
import { lazyRun } from '@node-novel/site-cache-util/lib/index';

/**
 * Created by user on 2019/12/16.
 */

export default lazyRun(async () =>
{
	const { api, saveCache } = await getApiClient();

	if (!await api.hasCookiesAuth())
	{
		return;
	}

	await api.taskList()
		.then(data => {

			consoleDebug.dir(data);

			return data.allow.concat(data.doing)
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

	await api.noticeView('system');

}, {
	pkgLabel: __filename,
});

