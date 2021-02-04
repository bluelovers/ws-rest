import { getApiClient, ApiClient } from './util';
import { strictEqual } from 'assert';
import expect from 'expect';

(async () => {

	const { api, saveCache } = await getApiClient();

	await expect(api.ncodeInfoRaw('n5624cv', true))
		.resolves
		.toHaveProperty('ncode', 'N5624CV')
	;

	await expect(api.ncodeInfoRaw('n5624cv'))
		.rejects
		.toThrow()
	;

	/*
	await expect(api.ncodeInfoRaw('n1489eq'))
		.resolves
		.toHaveProperty('ncode', 'N1489EQ')
	;

	await expect(api.ncodeInfoRaw('n1489eq', true))
		.rejects
		.toThrow()
	;
	 */

})();
