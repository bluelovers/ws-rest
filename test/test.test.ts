/**
 * 路由轉換功能測試
 * Router transformation function tests
 *
 * 測試 routerToRfc6570 與 rfc6570ToRouter 函式的正確性
 * Tests the correctness of routerToRfc6570 and rfc6570ToRouter functions
 */

// @ts-ignore
/// <reference types="node" />
/// <reference types="vitest" />

import { describe, expect, test } from 'vitest';
import { rfc6570ToRouter, routerToRfc6570 } from '../index';
import { expandRfc6570 } from '../parser';
// @ts-ignore
import UriTemplate from 'uri-template-lite';
import { fixturesRouter, ITestData } from './fixtures/data';
import { _reProcessCheckRfc6570, _rfc6570ToRouterToRfc6570, _testExpandRfc6570 } from './lib/test';

describe('router-uri', () =>
{

		test(`/users/:user <=> /users/{+user}`, function ()
		{
			//console.log('it:inner', currentTest.title);
			//console.log('it:inner', currentTest.fullTitle());

			let source = `/users/:user`;

			let actual = routerToRfc6570(source);
			let expected = `/users/{+user}`;

			_reProcessCheckRfc6570(actual, source, expected);
		});

		test(`test uri-template-lite`, function ()
		{
			//console.log('it:inner', currentTest.title);
			//console.log('it:inner', currentTest.fullTitle());

			let source = `/users/:user`;

			let template = new UriTemplate(routerToRfc6570(source));

			let actual = template.expand({
				user: 'foo/bar'
			});
			let expected = `/users/foo/bar`;

			//currentTest[SymbolLogOutput] = `${source} <=> ${expected}`;

			expect(actual).toStrictEqual(expected);

			let template2 = new UriTemplate(_rfc6570ToRouterToRfc6570(routerToRfc6570(source)));

			let actual2 = template2.expand({
				user: 'foo/bar'
			});

			expect(actual2).toMatchSnapshot(expected);

		});

});

describe('expandRfc6570', () =>
{

	describe('router', () =>
	{
		test.each(fixturesRouter.map(({
			input,
			...testData
		}) => {
			return {
				input: input ?? testData.expectedRouter ?? rfc6570ToRouter(testData.expectedRfc6570),
				...testData,
			} satisfies ITestData;
		}))('$input <=> $expectedRfc6570 → expanded: $expectedExpandedUrl', function (testData)
		{
			_testExpandRfc6570(routerToRfc6570(testData.input) , testData.expectedRfc6570, testData);
		});

	});

	describe('rfc6570', () =>
	{
		test.each(fixturesRouter.map(({
			input,
			...testData
		}) => {
			return {
				input: testData.expectedRfc6570 ?? routerToRfc6570(testData.expectedRouter!),
				...testData,
			} satisfies ITestData;
		}))('$input → expanded: $expectedExpandedUrl', function (testData)
		{
			_testExpandRfc6570(testData.input , testData.expectedRfc6570, testData);
		});

	});

});
