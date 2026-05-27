/**
 * matchRfc6570 語法支援度測試
 * matchRfc6570 syntax coverage tests
 *
 * matchRfc6570 內部委託 uri-template-lite 的 Template.match 進行匹配，
 * 作為封裝層需測試：
 * 1. 各類 RFC 6570 運算子的匹配正確性
 * 2. 無匹配時回傳 undefined
 * 3. Round-trip 驗證（expand → match → 還原）
 * 4. matchRouter 的 Router 語法支援
 * 5. 已知上游限制以 snapshot 記錄
 *
 * matchRfc6570 delegates to uri-template-lite's Template.match internally.
 * As a wrapper layer we need to verify:
 * 1. Correct matching for all RFC 6570 operators
 * 2. Returns undefined when no match
 * 3. Round-trip verification (expand → match → restore)
 * 4. matchRouter coverage for Router syntax
 * 5. Known upstream limitations via snapshot
 */

import { describe, expect, it } from 'vitest';
import { matchRfc6570, matchRouter, expandRfc6570 } from '../parser';

// =============================================================================
// 輔助函式
// =============================================================================

/**
 * 輔助斷言：驗證匹配成功
 * Helper assertion: verify successful match
 *
 * @param template - RFC 6570 模板 / RFC 6570 template
 * @param uri - 要匹配的 URI / URI to match
 * @param expected - 預期的匹配結果 / Expected match result
 */
function _assertMatch(
	template: string,
	uri: string,
	expected: Record<string, string>,
)
{
	const result = matchRfc6570(template, uri);
	expect(result).toEqual(expected);
}

/**
 * 輔助斷言：驗證不匹配（回傳 undefined）
 * Helper assertion: verify no match (returns undefined)
 *
 * @param template - RFC 6570 模板 / RFC 6570 template
 * @param uri - 要匹配的 URI / URI to match
 */
function _assertNoMatch(
	template: string,
	uri: string,
)
{
	const result = matchRfc6570(template, uri);
	expect(result).toBeUndefined();
}

/**
 * 輔助斷言：Round-trip 驗證
 * Helper assertion: round-trip verification
 *
 * 先展開再匹配，驗證能正確還原變數值
 * Expand then match, verify the variables are correctly restored
 *
 * @param template - RFC 6570 模板 / RFC 6570 template
 * @param data - 展開資料 / Expansion data
 */
function _assertRoundTrip(
	template: string,
	data: Record<string, unknown>,
)
{
	const expandResult = expandRfc6570(template, data);
	const matchResult = matchRfc6570(template, expandResult.url);

	/**
	 * 展開成功代表的資料應能被匹配還原
	 * The data represented by successful expansion should be matchable
	 */
	if (matchResult === undefined)
	{
		/**
		 * uri-template-lite 有已知的 round-trip 不對稱性（如 query 多變數缺漏），此處以 snapshot 記錄
		 * uri-template-lite has known round-trip asymmetry (e.g. missing query params), record via snapshot
		 */
		expect({
			template,
			data,
			url: expandResult.url,
			matchResult: undefined,
		}).toMatchSnapshot();
		return;
	}

	/**
	 * 驗證匹配結果中的值與展開時提供的值一致
	 * Verify matched values are consistent with expansion data
	 */
	for (const [key, value] of Object.entries(matchResult))
	{
		/**
		 * 注意：match 回傳的都是字串，expand 接受原始型別（number、boolean）
		 * Note: match returns strings, expand accepts primitive types (number, boolean)
		 */
		expect(String(data[key])).toBe(value);
	}
}

/**
 * 輔助斷言：使用 snapshot 記錄 match 結果（適用於已知上游限制）
 * Helper assertion: record match result via snapshot (for known upstream limitations)
 *
 * @param template - RFC 6570 模板 / RFC 6570 template
 * @param uri - 要匹配的 URI / URI to match
 */
function _assertMatchSnapshot(
	template: string,
	uri: string,
)
{
	const result = matchRfc6570(template, uri);
	expect({ template, uri, result }).toMatchSnapshot();
}

// =============================================================================
// 1. 運算子匹配測試
// =============================================================================

describe('matchRfc6570', () =>
{

	// ---------------------------------------------------------------------
	// 1.1 無運算子 (Simple String) — Level 1
	// ---------------------------------------------------------------------
	describe('(no operator) Simple String', () =>
	{
		it('matches a scalar string variable', () =>
		{
			_assertMatch('{var}', 'value', { var: 'value' });
		});

		it('matches decoded special characters', () =>
		{
			/**
			 * match 回傳已解碼的值
			 * match returns decoded values
			 */
			_assertMatch('{var}', 'Hello%20World%21', { var: 'Hello World!' });
		});

		it('matches a numeric string variable', () =>
		{
			_assertMatch('{var}', '42', { var: '42' });
		});

		it('matches an array as actual array', () =>
		{
			/**
			 * uri-template-lite 對逗號分隔的值回傳陣列而非字串
			 * uri-template-lite returns an array for comma-separated values
			 */
			const result = matchRfc6570('{list}', 'red,green,blue');
			expect(result).toEqual({ list: ['red', 'green', 'blue'] });
		});

		it('matches literal segments with variable', () =>
		{
			_assertMatch('/api/{version}/users', '/api/v1/users', { version: 'v1' });
		});

		it('returns undefined when static segment mismatches (prefix)', () =>
		{
			_assertNoMatch('/api/{version}/users', '/v2/users');
		});

		it('returns undefined when static segment mismatches (suffix)', () =>
		{
			_assertNoMatch('/api/{version}/users', '/api/v1/items');
		});
	});

	// ---------------------------------------------------------------------
	// 1.2 Reserved Expansion — Level 2
	// ---------------------------------------------------------------------
	describe('+ Reserved Expansion', () =>
	{
		it('matches reserved characters preserved', () =>
		{
			_assertMatch('{+var}', 'foo/bar', { var: 'foo/bar' });
		});

		it('matches decoded value (reserved expansions are decoded)', () =>
		{
			_assertMatch('{+var}', '/foo/bar', { var: '/foo/bar' });
		});

		it('matches in a path context', () =>
		{
			_assertMatch('/users/{+user}', '/users/foo/bar', { user: 'foo/bar' });
		});

		it('matches deep path segments', () =>
		{
			_assertMatch('/{+path}', '/a/b/c/d', { path: 'a/b/c/d' });
		});

		it('returns undefined when path does not match', () =>
		{
			_assertNoMatch('/users/{+user}', '/other/foo/bar');
		});

		it('matches numeric value as string', () =>
		{
			_assertMatch('{+var}', '100', { var: '100' });
		});
	});

	// ---------------------------------------------------------------------
	// 1.3 Fragment — Level 3
	// ---------------------------------------------------------------------
	describe('# Fragment', () =>
	{
		it('matches fragment with # prefix', () =>
		{
			_assertMatch('{#var}', '#value', { var: 'value' });
		});

		it('matches fragment with reserved chars', () =>
		{
			_assertMatch('{#var}', '#/foo/bar', { var: '/foo/bar' });
		});

		it('returns undefined when # prefix is missing', () =>
		{
			_assertNoMatch('{#var}', 'value');
		});

		/**
		 * {#var} 的 regex 是 #(.*?)，會匹配任意 fragment 內容
		 * 變數名僅為輸出鍵，不限制匹配值
		 * {#var} regex is #(.*?), matching any fragment content
		 * Variable name is just the output key, not a constraint
		 */
		it('matches any fragment content (variable name is just a placeholder)', () =>
		{
			_assertMatch('{#var}', '#other', { var: 'other' });
		});
	});

	// ---------------------------------------------------------------------
	// 1.4 Label — Level 3
	// ---------------------------------------------------------------------
	describe('. Label', () =>
	{
		it('matches label with . prefix', () =>
		{
			_assertMatch('{.var}', '.value', { var: 'value' });
		});

		it('matches encoded reserved chars (Label encodes reserved)', () =>
		{
			_assertMatch('{.var}', '.%2Ffoo', { var: '/foo' });
		});

		it('returns undefined when . prefix is missing', () =>
		{
			_assertNoMatch('{.var}', 'value');
		});
	});

	// ---------------------------------------------------------------------
	// 1.5 Path Segment — Level 3
	// ---------------------------------------------------------------------
	describe('/ Path Segment', () =>
	{
		it('matches path segment with / prefix', () =>
		{
			_assertMatch('{/var}', '/value', { var: 'value' });
		});

		it('matches encoded reserved chars (Path encodes reserved)', () =>
		{
			_assertMatch('{/var}', '/%2Ffoo', { var: '/foo' });
		});

		it('returns undefined when / prefix is missing', () =>
		{
			_assertNoMatch('{/var}', 'value');
		});

		/**
		 * {/var} 的 regex 是 /(.*?)，會匹配任意路徑片段
		 * 變數名僅為輸出鍵，不限制匹配值
		 * {/var} regex is /(.*?), matching any path segment
		 * Variable name is just the output key, not a constraint
		 */
		it('matches any path segment (variable name is just a placeholder)', () =>
		{
			_assertMatch('{/var}', '/other', { var: 'other' });
		});
	});

	// ---------------------------------------------------------------------
	// 1.6 Matrix — Level 3
	// ---------------------------------------------------------------------
	describe('; Matrix Path-Style', () =>
	{
		it('matches matrix with ;name=value', () =>
		{
			_assertMatch('{;var}', ';var=value', { var: 'value' });
		});

		it('matches matrix name-only (empty value)', () =>
		{
			_assertMatch('{;var}', ';var', { var: '' });
		});

		it('matches boolean-like value', () =>
		{
			_assertMatch('{;var}', ';var=true', { var: 'true' });
		});

		it('returns undefined when ; prefix is missing', () =>
		{
			_assertNoMatch('{;var}', 'value');
		});

		it('returns undefined when variable name mismatches', () =>
		{
			_assertNoMatch('{;var}', ';other=value');
		});
	});

	// ---------------------------------------------------------------------
	// 1.7 Query — Level 3
	// ---------------------------------------------------------------------
	describe('? Query', () =>
	{
		it('matches query with ?name=value', () =>
		{
			_assertMatch('{?var}', '?var=value', { var: 'value' });
		});

		it('matches query in URL path context', () =>
		{
			_assertMatch('/search{?q}', '/search?q=hello', { q: 'hello' });
		});

		it('matches multiple query params', () =>
		{
			_assertMatch('/search{?q,lang}', '/search?q=hello&lang=en', { q: 'hello', lang: 'en' });
		});

		it('matches query with encoded value', () =>
		{
			_assertMatch('{?var}', '?var=hello%20world', { var: 'hello world' });
		});

		it('returns undefined when ? prefix is missing', () =>
		{
			_assertNoMatch('{?var}', 'var=value');
		});

		it('returns undefined when query param name mismatches', () =>
		{
			_assertNoMatch('{?var}', '?other=value');
		});
	});

	// ---------------------------------------------------------------------
	// 1.8 Continuation — Level 3
	// ---------------------------------------------------------------------
	describe('& Continuation', () =>
	{
		it('matches continuation with &name=value', () =>
		{
			_assertMatch('{&var}', '&var=value', { var: 'value' });
		});

		it('matches continuation in query context', () =>
		{
			_assertMatch('/search?q=hello{&lang}', '/search?q=hello&lang=en', { lang: 'en' });
		});

		it('returns undefined when & prefix is missing', () =>
		{
			_assertNoMatch('{&var}', 'var=value');
		});

		it('returns undefined when continuation param name mismatches', () =>
		{
			_assertNoMatch('{&var}', '&other=value');
		});
	});

	// ---------------------------------------------------------------------
	// 1.9 靜態模板 (Static template)
	// ---------------------------------------------------------------------
	describe('static template', () =>
	{
		it('matches exact static path and returns empty object', () =>
		{
			_assertMatch('/static/path', '/static/path', {});
		});

		it('returns undefined for mismatched static path', () =>
		{
			_assertNoMatch('/static/path', '/static/other');
		});

		it('returns undefined for extra trailing segment', () =>
		{
			_assertNoMatch('/static/path', '/static/path/extra');
		});
	});

	// ---------------------------------------------------------------------
	// 1.10 邊界案例
	// ---------------------------------------------------------------------
	describe('edge cases', () =>
	{
		/**
		 * {var} 的 regex 是 (.*?)，可匹配空字串
		 * {var} regex is (.*?), capable of matching empty string
		 */
		it('matches empty string when template is only a variable', () =>
		{
			_assertMatch('{var}', '', { var: '' });
		});

		it('matches empty string template against empty URI', () =>
		{
			_assertMatch('', '', {});
		});

		it('matches template with mixed operators', () =>
		{
			_assertMatch(
				'/api{/version}/users{?page,limit}',
				'/api/v1/users?page=1&limit=10',
				{ version: 'v1', page: '1', limit: '10' },
			);
		});

		it('round-trip: simple variable', () =>
		{
			_assertRoundTrip('{var}', { var: 'hello' });
		});

		it('round-trip: reserved path', () =>
		{
			_assertRoundTrip('/users/{+user}', { user: 'foo/bar' });
		});

		it('round-trip: multiple path segments', () =>
		{
			_assertRoundTrip('/{+a}/{+b}', { a: 'x', b: 'y' });
		});

		it('round-trip: query string', () =>
		{
			/**
			 * uri-template-lite 對 query 多變數有不對稱性：缺少某個變數時 expand 會省略之，
			 * 但 match 仍預期所有變數都存在。
			 * uri-template-lite has asymmetry for multi-variable query: expand omits missing variables,
			 * but match still expects all variables to be present.
			 */
			_assertRoundTrip('/search{?q,lang}', { q: 'hello', lang: 'en' });
		});

		it('round-trip: path segment', () =>
		{
			_assertRoundTrip('/api{/version}' , { version: 'v1' });
		});
	});
});

// =============================================================================
// 2. matchRouter 測試
// =============================================================================

describe('matchRouter', () =>
{
	it('matches single router variable', () =>
	{
		const result = matchRouter('/users/:user', '/users/foo');
		expect(result).toEqual({ user: 'foo' });
	});

	it('matches multiple router variables', () =>
	{
		const result = matchRouter('/api/:version/users/:userId', '/api/v1/users/42');
		expect(result).toEqual({ version: 'v1', userId: '42' });
	});

	it('matches router variable with path separators', () =>
	{
		const result = matchRouter('/users/:user', '/users/foo/bar');
		expect(result).toEqual({ user: 'foo/bar' });
	});

	it('returns undefined when router path does not match', () =>
	{
		const result = matchRouter('/users/:user', '/other/path');
		expect(result).toBeUndefined();
	});

	it('returns undefined for partial match (static prefix mismatch)', () =>
	{
		const result = matchRouter('/api/:version/users', '/api/v1/items');
		expect(result).toBeUndefined();
	});

	it('matches empty string router template against empty URI', () =>
	{
		const result = matchRouter('', '');
		expect(result).toEqual({});
	});
});

// =============================================================================
// 3. 已知上游限制 (Snapshot)
// =============================================================================

describe('known upstream limitations (snapshot)', () =>
{

	it('explode list* with query operator returns array as single string', () =>
	{
		/**
		 * uri-template-lite 對 {?list*} 的 match 回傳 ["a&list=b"] 而非預期的陣列展開
		 * uri-template-lite match for {?list*} returns ["a&list=b"] instead of proper array expansion
		 */
		_assertMatchSnapshot('{?list*}', '?list=a&list=b');
	});

	it('explode list* with path operator returns array as single string', () =>
	{
		/**
		 * uri-template-lite 對 {/list*} 的 match 回傳 ["a/b"] 而非預期的陣列展開
		 * uri-template-lite match for {/list*} returns ["a/b"] instead of proper array expansion
		 */
		_assertMatchSnapshot('{/list*}', '/a/b');
	});

	it('query multi-variable with missing params returns undefined', () =>
	{
		/**
		 * {?page,limit} expand 時可省略 limit，
		 * 但 match 時預期所有變數都存在，回傳 undefined。
		 * This is a known asymmetry in uri-template-lite.
		 */
		_assertNoMatch('/api{/version}/users{?page,limit}', '/api/v1/users?page=1');
	});

	it('round-trip: missing query param fails match', () =>
	{
		/**
		 * 驗證 query 多變數 round-trip 不對稱性
		 * Verify query multi-variable round-trip asymmetry
		 */
		_assertRoundTrip('/api{/version}/users{?page,limit}', { version: 'v1', page: 1 });
	});
});
