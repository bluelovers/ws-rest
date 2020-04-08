/**
 * Created by user on 2020/4/8.
 */

import { getApiClient } from './util';

(async () => {

	const { api, saveCache } = await getApiClient();

	await api.ncodeInfoRaw('n5624cv', true)
		.then(ret => {
			console.log(ret)
		})
	;

	await api.ncodeInfoRaw('n1489eq')
		.then(ret => {
			console.log(ret)
		})
	;

})();
