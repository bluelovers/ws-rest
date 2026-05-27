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
import { fixturesRouter, fixturesRfc6570Only, ITestData } from './fixtures/data';
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

/**
 * rfc6570ToRouter ignoreUnSupport 選項測試
 * rfc6570ToRouter ignoreUnSupport option tests
 *
 * 驗證不同值（true / false / null / undefined / 1 / 0）
 * 對不支援語法及雙向 round-trip 的影響
 */
describe('rfc6570ToRouter - ignoreUnSupport option', () =>
{
	/**
	 * 不支援語法 + ignoreUnSupport 為 falsy → 拋出 TypeError
	 * Unsupported syntax + ignoreUnSupport is falsy → throws TypeError
	 */
	describe('throws for unsupported syntax when ignoreUnSupport is falsy', () =>
	{
		test.each([
			['no opts', undefined as any],
			['opts = null', null],
			['ignoreUnSupport = false', { ignoreUnSupport: false }],
			['ignoreUnSupport = undefined', { ignoreUnSupport: undefined as any }],
			['ignoreUnSupport = 0', { ignoreUnSupport: 0 as any }],
		])('%s', (_, opts) =>
		{
			expect(() => rfc6570ToRouter('/api/{?query,number}', opts)).toThrowErrorMatchingSnapshot();
		});
	});

	/**
	 * 不支援語法 + ignoreUnSupport 為 truthy → 保留原樣
	 * Unsupported syntax + ignoreUnSupport is truthy → keep unchanged
	 */
	describe('keeps unsupported syntax unchanged when ignoreUnSupport is truthy', () =>
	{
		test.each([
			['ignoreUnSupport = true', { ignoreUnSupport: true }],
			['ignoreUnSupport = 1', { ignoreUnSupport: 1 as any }],
		])('%s', (_, opts) =>
		{
			expect(rfc6570ToRouter('/api/{?query,number}', opts)).toBe('/api/{?query,number}');
		});
	});

	/**
	 * 支援語法始終正常轉換，不受 ignoreUnSupport 值影響
	 * Supported syntax always converts correctly regardless of ignoreUnSupport
	 */
	describe('converts supported syntax regardless of ignoreUnSupport', () =>
	{
		test.each([
			['no opts', undefined as any],
			['opts = null', null],
			['ignoreUnSupport = false', { ignoreUnSupport: false }],
			['ignoreUnSupport = true', { ignoreUnSupport: true }],
			['ignoreUnSupport = 0', { ignoreUnSupport: 0 as any }],
			['ignoreUnSupport = 1', { ignoreUnSupport: 1 as any }],
			['ignoreUnSupport = undefined', { ignoreUnSupport: undefined as any }],
		])('%s', (_, opts) =>
		{
			expect(rfc6570ToRouter('/api/{+user}', opts)).toBe('/api/:user');
		});
	});

	/**
	 * 雙向 round-trip 驗證
	 * Bidirectional round-trip verification
	 */
	describe('bi-directional round-trip', () =>
	{
		/**
		 * 支援語法在所有 ignoreUnSupport 值下都能完整 round-trip
		 * Supported syntax round-trips correctly with all ignoreUnSupport values
		 */
		test.each([
			['no opts', undefined as any],
			['opts = null', null],
			['ignoreUnSupport = false', { ignoreUnSupport: false }],
			['ignoreUnSupport = true', { ignoreUnSupport: true }],
			['ignoreUnSupport = 0', { ignoreUnSupport: 0 as any }],
			['ignoreUnSupport = 1', { ignoreUnSupport: 1 as any }],
			['ignoreUnSupport = undefined', { ignoreUnSupport: undefined as any }],
		])('supported syntax with %s', (_, opts) =>
		{
			const router = rfc6570ToRouter('/api/{+user}', opts);
			expect(routerToRfc6570(router)).toBe('/api/{+user}');
		});

		/**
		 * 不支援語法在 ignoreUnSupport: true 時保留原樣通過 round-trip
		 * Unsupported syntax survives round-trip when ignoreUnSupport: true
		 */
		test('unsupported syntax with ignoreUnSupport: true survives round-trip', () =>
		{
			const router = rfc6570ToRouter('/api/{?query,number}', { ignoreUnSupport: true });
			expect(routerToRfc6570(router)).toBe('/api/{?query,number}');
		});
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

	/**
	 * 純 RFC 6570 擴展測試（無 round-trip）
	 * RFC 6570 expansion-only tests (no round-trip)
	 *
	 * 這些 fixture 使用 Router URI（:varname）無法表達的 RFC 6570 語法，
	 * 因此不參與 round-trip 轉換測試，僅驗證 expandRfc6570 的展開正確性。
	 *
	 * These fixtures use RFC 6570 syntax that has no Router URI (:varname) equivalent,
	 * so they do not participate in round-trip conversion tests.
	 * They only verify the correctness of expandRfc6570 expansion.
	 */
	describe('rfc6570', () =>
	{
		test.each(fixturesRfc6570Only.map(({
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
