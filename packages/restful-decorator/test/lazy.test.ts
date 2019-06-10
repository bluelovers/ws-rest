/**
 * Created by User on 2019/6/8.
 */

// @ts-ignore
/// <reference types="mocha" />
// @ts-ignore
/// <reference types="benchmark" />
// @ts-ignore
/// <reference types="chai" />
// @ts-ignore
/// <reference types="node" />

import { chai, relative, expect, path, assert, util, mochaAsync, SymbolLogOutput } from './_local-dev';
import { AbstractHttpClient } from '../lib/wrap/abstract';
import { BaseUrl } from '../lib/decorators/http';
import { Headers } from '../lib/decorators/headers';

// @ts-ignore
describe(relative(__filename), () =>
{
	// @ts-ignore
	let currentTest: Mocha.Test;

	// @ts-ignore
	beforeEach(function ()
	{
		// @ts-ignore
		currentTest = this.currentTest;

		delete currentTest[SymbolLogOutput];

		//console.log('it:before', currentTest.title);
		//console.log('it:before', currentTest.fullTitle());
	});

	// @ts-ignore
	afterEach(function ()
	{
		let out = currentTest[SymbolLogOutput];
		let t = typeof out;

		if (t === 'string')
		{
			console.log(`----------`);
			console.dir(out);
			console.log(`----------`);
		}
		else if (t === 'function')
		{
			out(currentTest)
		}
		else if (out != null)
		{
			console.dir(out);
		}

	});

	// @ts-ignore
	describe(`suite`, () =>
	{
		// @ts-ignore
		it(`label`, function ()
		{
			//console.log('it:inner', currentTest.title);
			//console.log('it:inner', currentTest.fullTitle());

			@BaseUrl('http://v2.api.dmzj.com')
			@Headers({
				'Content-Type': '777',
			})
			class A extends AbstractHttpClient
			{

			}

			let actual = new A;
			let expected = 'http://v2.api.dmzj.com/';

//			currentTest[SymbolLogOutput] = actual;

			expect(actual.$http.defaults.baseURL).to.be.deep.equal(expected);

		});

		// @ts-ignore
		it(`label`, function ()
		{
			//console.log('it:inner', currentTest.title);
			//console.log('it:inner', currentTest.fullTitle());

			@BaseUrl('http://v2.api.dmzj.com')
			@Headers({
				'Content-Type': '777',
			})
			class A extends AbstractHttpClient
			{

			}

			let actual = new A;
			let expected = '777';

			currentTest[SymbolLogOutput] = actual.$http.defaults.headers;

			expect(actual.$http.defaults.headers.common['Content-Type']).to.be.deep.equal(expected);

		});
	});
});
