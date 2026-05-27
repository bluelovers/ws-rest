import { describe, expect, it } from 'vitest';
import specExamples from './fixtures/uritemplate-test/spec-examples.json';
import { expandRfc6570 } from '../parser';

describe('uritemplate-test', () =>
{


	var data = Object.entries(specExamples)

	data.forEach(testData =>
	{

		it(`should expand ${testData[0]}`, () =>
		{
			const [level, json] = testData;
			var res
				, arr = json.testcases, len = arr.length, i = 0
				, args = json.variables
			for (; i < len; i++)
			{
				const input = arr[i][0] as string;
				const data = args;

				res = expandRfc6570(input, args);

				if (Array.isArray(arr[i][1]))
				{
					expect(res).toMatchSnapshot({
						router: input,
						url: expect.toBeOneOf(arr[i][1] as string[]),
					});
				}
				// @ts-ignore
				else if (arr[i][1] === false)
				{
					// negative test
					expect(res).toMatchSnapshot({
						router: input,
						url: arr[i][0],
					})
				}
				else
				{
					expect(res).toMatchSnapshot({
						router: input,
						url: arr[i][1],
					})
				}

				const inputDataKeys = Object.keys(data);

				if (inputDataKeys.length > 0)
				{
					expect({
						input,
						inputDataKeys,
						paths: res.paths,

					}).toMatchSnapshot({
						inputDataKeys: expect.arrayContaining(Object.keys(res.paths)),
					})
				}
			}
		})

	})

})