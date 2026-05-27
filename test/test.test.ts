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
	 * 支援模式（單一變數，可選 + 運算子）
	 * Supported patterns (single variable, optional + operator)
	 *
	 * 記錄格式：[label, url, expectedRouter, expectedRoundtrip]
	 * Format: [label, url, expectedRouter, expectedRoundtrip]
	 *
	 * expectedRoundtrip 是 routerToRfc6570(rfc6570ToRouter(url)) 的預期結果，
	 * 因 routerToRfc6570 總是產生 {+var} 格式，故不含 + 的原始 URL 會正規化。
	 * expectedRoundtrip is what routerToRfc6570(rfc6570ToRouter(url)) should yield;
	 * URLs without + operator get normalized because routerToRfc6570 always
	 * produces {+var} format.
	 */
	const supportedPatterns = [
		['{+user}', '/api/{+user}', '/api/:user', '/api/{+user}'],
		['{user}', '/api/{user}', '/api/:user', '/api/{+user}'],
		['{+path}', '/api/{+path}', '/api/:path', '/api/{+path}'],
		['{name}', '/api/{name}', '/api/:name', '/api/{+name}'],
	] as const;

	/**
	 * 不支援模式（運算子、多變數、修飾詞）
	 * Unsupported patterns (operators, multi-variable, modifiers)
	 *
	 * 注意：含有 : " ' 字元的模式不會被正則匹配，永遠保留原樣
	 * Note: patterns containing : " ' are never matched by the regex and always pass through
	 */
	const unsupportedPatterns = [
		['query operator {?query}', '/api/{?query}'],
		['fragment operator {#frag}', '/api/{#frag}'],
		['path segment {/path}', '/api/{/path}'],
		['matrix operator {;x}', '/api/{;x}'],
		['form continuation {&foo}', '/api/{&foo}'],
		['dot prefix {.email}', '/api/{.email}'],
		['multi-variable query {?query,number}', '/api/{?query,number}'],
		['multi-variable simple {x,y}', '/api/{x,y}'],
		['explode modifier {/list*}', '/api{/list*}'],
		['reserved explode {+path*}', '/api/{+path*}'],
	] as const;

	/**
	 * 正則排除模式（含有 : 字元，不會被正則匹配）
	 * Regex-excluded patterns (contain :, never matched by regex)
	 *
	 * 正則 /\{([^{}:"']+)\}/g 排除了 :，這些模式會直接保留原樣
	 * The regex /\{([^{}:"']+)\}/g excludes :, so these pass through unchanged
	 */
	const regexExcludedPatterns = [
		['prefix modifier {var:3}', '/api/{var:3}'],
		['path prefix {/path:3}', '/api/{/path:3}'],
		['reserved prefix {+path:3}', '/api/{+path:3}'],
	] as const;

	/**
	 * 所有選項組合
	 * All option combinations
	 */
	const allOpts = [
		['no opts', undefined as any],
		['opts = null', null],
		['ignoreUnSupport = false', { ignoreUnSupport: false }],
		['ignoreUnSupport = true', { ignoreUnSupport: true }],
		['ignoreUnSupport = 0', { ignoreUnSupport: 0 as any }],
		['ignoreUnSupport = 1', { ignoreUnSupport: 1 as any }],
		['ignoreUnSupport = undefined', { ignoreUnSupport: undefined as any }],
	] as const;

	/**
	 * falsy 選項組合（應拋出 TypeError）
	 * Falsy option combinations (should throw TypeError)
	 */
	const falsyOpts = [
		['no opts', undefined as any],
		['opts = null', null],
		['ignoreUnSupport = false', { ignoreUnSupport: false }],
		['ignoreUnSupport = undefined', { ignoreUnSupport: undefined as any }],
		['ignoreUnSupport = 0', { ignoreUnSupport: 0 as any }],
	] as const;

	/**
	 * truthy 選項組合（應保留不支援語法）
	 * Truthy option combinations (should preserve unsupported syntax)
	 */
	const truthyOpts = [
		['ignoreUnSupport = true', { ignoreUnSupport: true }],
		['ignoreUnSupport = 1', { ignoreUnSupport: 1 as any }],
	] as const;

	/**
	 * 支援語法始終正常轉換，不受 ignoreUnSupport 值影響
	 * Supported syntax always converts correctly regardless of ignoreUnSupport
	 */
	describe('converts supported syntax regardless of ignoreUnSupport', () =>
	{
		describe.each(supportedPatterns)('%s', (_, url, expected, _roundtrip) =>
		{
			test.each(allOpts)('%s', (__, opts) =>
			{
				expect(rfc6570ToRouter(url, opts)).toBe(expected);
			});
		});
	});

	/**
	 * 不支援語法 + ignoreUnSupport 為 falsy → 拋出 TypeError
	 * Unsupported syntax + ignoreUnSupport is falsy → throws TypeError
	 */
	describe('throws for unsupported syntax when ignoreUnSupport is falsy', () =>
	{
		describe.each(unsupportedPatterns)('%s', (_, url) =>
		{
			test.each(falsyOpts)('%s', (__, opts) =>
			{
				expect(() => rfc6570ToRouter(url, opts)).toThrowErrorMatchingSnapshot();
			});
		});
	});

	/**
	 * 不支援語法 + ignoreUnSupport 為 truthy → 保留原樣
	 * Unsupported syntax + ignoreUnSupport is truthy → keep unchanged
	 */
	describe('keeps unsupported syntax unchanged when ignoreUnSupport is truthy', () =>
	{
		describe.each(unsupportedPatterns)('%s', (_, url) =>
		{
			test.each(truthyOpts)('%s', (__, opts) =>
			{
				expect(rfc6570ToRouter(url, opts)).toBe(url);
			});
		});
	});

	/**
	 * 正則排除模式（含有 : 字元永遠保留原樣）
	 * Regex-excluded patterns (containing : always pass through unchanged)
	 *
	 * 這些模式因含有 : 導致正則 /\{([^{}:"']+)\}/g 無法匹配，
	 * 因此無論 ignoreUnSupport 值為何，都原樣保留。
	 * These patterns contain : so the regex /\{([^{}:"']+)\}/g never matches them,
	 * and they always pass through unchanged regardless of ignoreUnSupport.
	 */
	describe('regex-excluded patterns always pass through unchanged', () =>
	{
		describe.each(regexExcludedPatterns)('%s', (_, url) =>
		{
			/**
			 * 所有選項（含 falsy）都不影響，永遠保留原樣
			 * All options (including falsy) never affect it, always pass through
			 */
			test.each(allOpts)('%s', (__, opts) =>
			{
				expect(rfc6570ToRouter(url, opts)).toBe(url);
			});

			/**
			 * round-trip 永遠保留原樣
			 * round-trip always preserves original
			 */
			test.each(allOpts)('round-trip with %s', (__, opts) =>
			{
				const router = rfc6570ToRouter(url, opts);
				expect(routerToRfc6570(router)).toBe(url);
			});
		});
	});

	/**
	 * 雙向 round-trip 驗證
	 * Bidirectional round-trip verification
	 */
	describe('bi-directional round-trip', () =>
	{
		/**
		 * 支援語法在所有 ignoreUnSupport 值下都能 round-trip
		 * Supported syntax round-trips correctly with all ignoreUnSupport values
		 *
		 * round-trip 結果會正規化為 {+var} 格式
		 * Round-trip result normalizes to {+var} format
		 */
		describe.each(supportedPatterns)('%s', (_, url, _router, expectedRoundtrip) =>
		{
			test.each(allOpts)('%s', (__, opts) =>
			{
				const router = rfc6570ToRouter(url, opts);
				expect(routerToRfc6570(router)).toBe(expectedRoundtrip);
			});
		});

		/**
		 * 不支援語法在 ignoreUnSupport 為 truthy 時保留原樣通過 round-trip
		 * Unsupported syntax survives round-trip when ignoreUnSupport is truthy
		 */
		describe.each(unsupportedPatterns)('%s', (_, url) =>
		{
			test.each(truthyOpts)('%s', (__, opts) =>
			{
				const router = rfc6570ToRouter(url, opts);
				expect(routerToRfc6570(router)).toBe(url);
			});
		});
	});

	/**
	 * 混合 URL（同時包含支援與不支援語法）
	 * Mixed URLs (containing both supported and unsupported syntax)
	 */
	describe('mixed URLs', () =>
	{
		const mixedUrls = [
			['{+user} + {?query}', '/api/{+user}/{?query}'],
			['{+path} + {?query} + query-string', '/api/{+path}/{?query}?page=1'],
			['{+user} + {?query,number}', '/api/{+user}/{?query,number}'],
		] as const;

		/**
		 * falsy ignoreUnSupport → 完整 URL 拋出 TypeError
		 * falsy ignoreUnSupport → entire URL throws TypeError
		 */
		describe('throws TypeError when ignoreUnSupport is falsy', () =>
		{
			describe.each(mixedUrls)('%s', (_, url) =>
			{
				test.each(falsyOpts)('%s', (__, opts) =>
				{
					expect(() => rfc6570ToRouter(url, opts)).toThrowErrorMatchingSnapshot();
				});
			});
		});

		/**
		 * truthy ignoreUnSupport → 轉換支援部分，保留不支援部分
		 * truthy ignoreUnSupport → convert supported parts, preserve unsupported parts
		 */
		describe('converts supported parts and preserves unsupported parts when ignoreUnSupport is truthy', () =>
		{
			describe.each(mixedUrls)('%s', (_, url) =>
			{
				test.each(truthyOpts)('%s', (__, opts) =>
				{
					/**
					 * 轉換結果透過 round-trip 應等於原始 URL
					 * Round-trip of converted result should equal original URL
					 */
					const router = rfc6570ToRouter(url, opts);
					expect(routerToRfc6570(router)).toBe(url);
				});
			});
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
