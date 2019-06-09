/**
 * Created by User on 2019/6/9.
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
import routerToRfc6570, { rfc6570ToRouter } from '../index';
// @ts-ignore
import { URI } from 'uri-template-lite';

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
		it(`/users/:user <=> /users/{+user}`, function ()
		{
			//console.log('it:inner', currentTest.title);
			//console.log('it:inner', currentTest.fullTitle());

			let source = `/users/:user`;

			let actual = routerToRfc6570(source);
			let expected = `/users/{+user}`;

			currentTest[SymbolLogOutput] = `${source} <=> ${expected}`;

			expect(actual).to.be.deep.equal(expected);

			expect(rfc6570ToRouter(actual)).to.be.deep.equal(source);

		});

		// @ts-ignore
		it(`test uri-template-lite`, function ()
		{
			//console.log('it:inner', currentTest.title);
			//console.log('it:inner', currentTest.fullTitle());

			let source = `/users/:user`;

			let template = new URI.Template(routerToRfc6570(source));

			let actual = template.expand({
				user: 'foo/bar'
			});
			let expected = `/users/foo/bar`;

			//currentTest[SymbolLogOutput] = `${source} <=> ${expected}`;

			expect(actual).to.be.deep.equal(expected);

			let template2 = new URI.Template(routerToRfc6570(rfc6570ToRouter(routerToRfc6570(source))));

			let actual2 = template.expand({
				user: 'foo/bar'
			});

			expect(actual2).to.be.deep.equal(expected);

		});

		// @ts-ignore
		it(`test uri-template-lite`, function ()
		{
			//console.log('it:inner', currentTest.title);
			//console.log('it:inner', currentTest.fullTitle());

			let source = `/users/:u`;

			let template = new URI.Template(routerToRfc6570(source));

			let actual = template.expand({
				u: 'foo/bar'
			});
			let expected = `/users/foo/bar`;

			//currentTest[SymbolLogOutput] = `${source} <=> ${expected}`;

			expect(actual).to.be.deep.equal(expected);

			let template2 = new URI.Template(routerToRfc6570(rfc6570ToRouter(routerToRfc6570(source))));

			let actual2 = template.expand({
				u: 'foo/bar'
			});

			expect(actual2).to.be.deep.equal(expected);

		});

	});
});
