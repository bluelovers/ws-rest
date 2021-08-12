import { basename, extname } from 'path';
import { _parseInt } from '../lib/util/_parseInt';

describe(basename(__filename, extname(__filename)), () =>
{

	test(`_parseInt`, () =>
	{

		expect(_parseInt('0')).toBeUndefined();
		expect(_parseInt('')).toBeUndefined();
		expect(_parseInt(void 0)).toBeUndefined();
		expect(_parseInt('1000')).toStrictEqual(1000);

	});



})
