
export interface ITestData {
	title?: string;
	input?: string;

	expectedRouter?: string;
	expectedRfc6570: string;

	expectedExpandedUrl?: string;

	data?: Record<string, unknown>;
}

/**
 * @see https://www.npmjs.com/package/uri-template-lite
 */
export const fixturesRouter: ITestData[] = [

	{
		input: `/users/:user`,

		expectedRouter: `/users/:user`,
		expectedRfc6570: `/users/{+user}`,

		expectedExpandedUrl: `/users/foo/bar`,
		data: {
			user: 'foo/bar',
			extraParam: 'extraValue',
		},
	},

	{
		expectedRfc6570: `http://{domain}/~{user}/foo{?query,number}`,

		expectedExpandedUrl: `http://example.com/~fred/foo?query=mycelium`,
		data: {
			domain: 'example.com',
			user: 'fred',
			query: 'mycelium',
		},
	},

	{
		expectedRfc6570: `http://{domain}/~{user}/foo{?query,number}`,

		expectedExpandedUrl: `http://example.com/~fred/foo?query=mycelium&number=3`,
		data: {
			domain: 'example.com',
			user: 'fred',
			query: 'mycelium',
			number: 3,
		},
	},

];
