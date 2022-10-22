//@noUnusedParameters:false
/// <reference types="jest" />
/// <reference types="node" />
/// <reference types="expect" />

import { basename, extname } from 'path';
import { BaseUrl } from '../lib/decorators/http';
import { Headers } from '../lib/decorators/headers';
import { AbstractHttpClient } from '../lib/index';

beforeAll(async () =>
{

});


test(`baseURL`, () =>
{
	@BaseUrl('http://v2.api.dmzj.com')
	@Headers({
		'Content-Type': '777',
	})
	class A extends AbstractHttpClient
	{

	}

	let actual = new A;
	let expected = 'http://v2.api.dmzj.com/';

	expect(actual).toHaveProperty('$http.defaults.baseURL', expected)

});

test(`Content-Type`, () =>
{
	@BaseUrl('http://v2.api.dmzj.com')
	@Headers({
		'Content-Type': '777',
	})
	class A extends AbstractHttpClient
	{

	}

	let actual = new A;
	let expected = '777';

	expect(actual).toHaveProperty('$http.defaults.headers.common.Content-Type', expected)

});
