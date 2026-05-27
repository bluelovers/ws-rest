/**
 * expandRfc6570 語法支援度測試
 * expandRfc6570 syntax coverage tests
 *
 * 雖然 expandRfc6570 內部委託 uri-template-lite 進行實際展開，
 * 但作為封裝層，仍需測試：
 * 1. 各類 RFC 6570 語法的展開正確性
 * 2. paths / data 分離邏輯的正確性
 * 3. 邊界條件與特殊值處理
 * 4. 回歸防護：當 uri-template-lite 更新時，能及時發現行為變更
 *
 * Although expandRfc6570 delegates expansion to uri-template-lite internally,
 * as a wrapper we still need to verify:
 * 1. Correct expansion for all RFC 6570 syntax
 * 2. Correct paths / data separation logic
 * 3. Edge cases and special values
 * 4. Regression protection: catch behavior changes when uri-template-lite updates
 */

import { describe, expect, it } from 'vitest';
import { expandRfc6570, parseRouterVars } from '../parser';

// =============================================================================
// 輔助函式
// =============================================================================

/**
 * 輔助斷言：驗證 expandRfc6570 的展開結果
 * Helper assertion: verify expandRfc6570 expansion result
 */
function _assertExpand(
	template: string,
	data: Record<string, unknown>,
	expectedUrl: string,
	expectedPaths?: Record<string, unknown>,
	expectedData?: Record<string, unknown>,
)
{
	const result = expandRfc6570(template, data);

	/**
	 * router 必須等於原始模板
	 * router must equal the original template
	 */
	expect(result.router).toBe(template);

	/**
	 * url 必須等於預期展開結果
	 * url must equal the expected expansion
	 */
	expect(result.url).toBe(expectedUrl);

	/**
	 * paths：模板中出現的變數
	 * paths: variables appearing in the template
	 */
	if (expectedPaths !== undefined)
	{
		expect(result.paths).toEqual(expectedPaths);
	}

	/**
	 * data：未在模板中出現的變數
	 * data: variables NOT appearing in the template
	 */
	if (expectedData !== undefined)
	{
		expect(result.data).toEqual(expectedData);
	}

	/**
	 * 驗證 paths / data 一致性：兩者不應重複包含同一 key
	 * Verify paths / data consistency: no overlapping keys
	 */
	const allKeys = [...new Set([...Object.keys(result.paths), ...Object.keys(result.data)])];
	const expectedAllKeys = [...new Set([...Object.keys(expectedPaths ?? {}), ...Object.keys(expectedData ?? {}), ...Object.keys(data)])];

	for (const key of Object.keys(data))
	{
		const inPaths = key in result.paths;
		const inData = key in result.data;

		/**
		 * 每個 data key 應恰好出現在 paths 或 data 之一（互斥）
		 * Each data key should appear in exactly one of paths or data (mutually exclusive)
		 */
		expect([inPaths, inData]).toContain(true);
	}
}

/**
 * 輔助斷言：僅驗證展開結果的 url（不關心 paths/data 分離）
 * Helper assertion: verify expansion url only (ignoring paths/data separation)
 */
function _assertExpandUrl(
	template: string,
	data: Record<string, unknown>,
	expectedUrl: string,
)
{
	const result = expandRfc6570(template, data);
	expect(result.router).toBe(template);
	expect(result.url).toBe(expectedUrl);
}

/**
 * 輔助斷言：使用 snapshot 驗證展開結果（適用於已知上游限制）
 * Helper assertion: verify expansion via snapshot (for known upstream limitations)
 */
function _assertExpandUrlSnapshot(
	template: string,
	data: Record<string, unknown>,
)
{
	const result = expandRfc6570(template, data);
	expect(result.router).toBe(template);
	expect(result.url).toMatchSnapshot();
}

// =============================================================================
// 1. 運算子支援測試
// =============================================================================

describe('operators', () =>
{

	// -------------------------------------------------------------------------
	// 1.1 無運算子 (Simple String) — Level 1
	// -------------------------------------------------------------------------
	describe('(no operator) Simple String', () =>
	{
		it('expands a scalar string variable', () =>
		{
			_assertExpandUrl('{var}', { var: 'value' }, 'value');
		});

		it('URL-encodes special characters', () =>
		{
			_assertExpandUrl('{var}', { var: 'Hello World!' }, 'Hello%20World%21');
		});

		it('expands a numeric variable', () =>
		{
			_assertExpandUrl('{var}', { var: 42 }, '42');
		});

		it('expands a boolean variable', () =>
		{
			_assertExpandUrl('{var}', { var: true }, 'true');
		});

		it('expands an array as comma-separated list', () =>
		{
			_assertExpandUrl('{list}', { list: ['red', 'green', 'blue'] }, 'red,green,blue');
		});

		it('expands an associative array as comma-separated key,value pairs', () =>
		{
			_assertExpandUrl('{keys}', { keys: { semi: ';', dot: '.' } }, 'semi,%3B,dot,.');
		});

		it('expands to empty string when variable is missing', () =>
		{
			_assertExpandUrl('{var}', {} as any, '');
		});

		it('expands to empty string for null value', () =>
		{
			_assertExpandUrl('{var}', { var: null }, '');
		});

		it('expands to empty string for undefined value', () =>
		{
			_assertExpandUrl('{var}', { var: undefined }, '');
		});

		it('expands to empty string for empty string value', () =>
		{
			_assertExpandUrl('{var}', { var: '' }, '');
		});

		it('expands empty array', () =>
		{
			_assertExpandUrl('{list}', { list: [] }, '');
		});

		it('expands empty object (assoc array)', () =>
		{
			_assertExpandUrl('{keys}', { keys: {} }, '');
		});
	});

	// -------------------------------------------------------------------------
	// 1.2 Reserved Expansion — Level 2
	// -------------------------------------------------------------------------
	describe('+ Reserved Expansion', () =>
	{
		it('preserves reserved characters without encoding', () =>
		{
			_assertExpandUrl('{+var}', { var: '/foo/bar' }, '/foo/bar');
		});

		it('still encodes non-reserved special chars like spaces', () =>
		{
			_assertExpandUrl('{+var}', { var: 'hello world' }, 'hello%20world');
		});

		it('expands numeric value', () =>
		{
			_assertExpandUrl('{+var}', { var: 100 }, '100');
		});

		it('expands array as comma-separated list (reserved chars preserved)', () =>
		{
			_assertExpandUrl('{+list}', { list: ['a', '/b', 'c:d'] }, 'a,/b,c:d');
		});

		it('expands assoc array with reserved chars preserved', () =>
		{
			_assertExpandUrl('{+keys}', { keys: { k1: '/v1', k2: 'v/2' } }, 'k1,/v1,k2,v/2');
		});

		it('expands undefined value to empty string', () =>
		{
			_assertExpandUrl('{+var}', { other: 'x' } as any, '');
		});

		it('works in a path context', () =>
		{
			_assertExpandUrl('/users/{+user}', { user: 'foo/bar' }, '/users/foo/bar');
		});
	});

	// -------------------------------------------------------------------------
	// 1.3 Fragment — Level 3
	// -------------------------------------------------------------------------
	describe('# Fragment', () =>
	{
		it('prepends # and encodes non-reserved chars', () =>
		{
			_assertExpandUrl('{#var}', { var: 'value' }, '#value');
		});

		it('preserves reserved chars (same as +)', () =>
		{
			_assertExpandUrl('{#var}', { var: '/foo/bar' }, '#/foo/bar');
		});

		it('encodes spaces', () =>
		{
			_assertExpandUrl('{#var}', { var: 'hello world' }, '#hello%20world');
		});

		it('expands array as comma-separated with # prefix', () =>
		{
			_assertExpandUrl('{#list}', { list: ['a', 'b', 'c'] }, '#a,b,c');
		});

		it('expands undefined to empty string (prefix omitted)', () =>
		{
			/**
			 * RFC 6570 §3.2.4: "#" 前綴僅在展開值非空時保留
			 * RFC 6570 §3.2.4: "#" prefix only included when expanded value is non-empty
			 */
			_assertExpandUrl('{#var}', {} as any, '');
		});
	});

	// -------------------------------------------------------------------------
	// 1.4 Label — Level 3
	// -------------------------------------------------------------------------
	describe('. Label', () =>
	{
		it('prepends . prefix', () =>
		{
			_assertExpandUrl('{.var}', { var: 'value' }, '.value');
		});

		it('encodes reserved chars (Label is not a reserved operator)', () =>
		{
			/**
			 * "." 不是保留運算子，保留字元會被編碼
			 * "." is not a reserved operator; reserved characters are encoded
			 */
			_assertExpandUrl('{.var}', { var: '/foo' }, '.%2Ffoo');
		});

		it('expands array as comma-separated with . before first', () =>
		{
			_assertExpandUrl('{.list}', { list: ['a', 'b', 'c'] }, '.a,b,c');
		});

		it('expands undefined to empty string', () =>
		{
			_assertExpandUrl('{.var}', {} as any, '');
		});
	});

	// -------------------------------------------------------------------------
	// 1.5 Path Segment — Level 3
	// -------------------------------------------------------------------------
	describe('/ Path Segment', () =>
	{
		it('prepends / prefix', () =>
		{
			_assertExpandUrl('{/var}', { var: 'value' }, '/value');
		});

		it('encodes reserved chars (Path is not a reserved operator)', () =>
		{
			/**
			 * "/" 不是保留運算子，保留字元會被編碼
			 * "/" is not a reserved operator; reserved characters are encoded
			 */
			_assertExpandUrl('{/var}', { var: '/foo' }, '/%2Ffoo');
		});

		it('expands array as comma-separated with / before first', () =>
		{
			_assertExpandUrl('{/list}', { list: ['a', 'b', 'c'] }, '/a,b,c');
		});

		it('expands undefined to empty string', () =>
		{
			_assertExpandUrl('{/var}', {} as any, '');
		});

		it('explodes array with / prefix per element', () =>
		{
			_assertExpandUrl('{/list*}', { list: ['a', 'b', 'c'] }, '/a/b/c');
		});

		it('explodes assoc array with /= separator per element', () =>
		{
			/**
			 * RFC 6570 §3.2.6: "/" 運算子 explode assoc 使用 "=" 作為 kv 分隔符
			 * RFC 6570 §3.2.6: "/" operator explode assoc uses "=" as kv separator
			 */
			_assertExpandUrl('{/keys*}', { keys: { k1: 'v1', k2: 'v2' } }, '/k1=v1/k2=v2');
		});
	});

	// -------------------------------------------------------------------------
	// 1.6 Matrix — Level 3
	// -------------------------------------------------------------------------
	describe('; Matrix Path-Style', () =>
	{
		it('expands scalar with ; prefix', () =>
		{
			_assertExpandUrl('{;var}', { var: 'value' }, ';var=value');
		});

		it('expands boolean true as ;name=true', () =>
		{
			/**
			 * uri-template-lite 將 boolean true 視為字串 "true"
			 * 不同於 RFC 6570 中空值的短格式 "name-only"
			 * uri-template-lite treats boolean true as string "true"
			 */
			_assertExpandUrl('{;var}', { var: true }, ';var=true');
		});

		it('expands integer with ; prefix', () =>
		{
			_assertExpandUrl('{;var}', { var: 42 }, ';var=42');
		});

		it('expands array as ;name=val1,val2,...', () =>
		{
			_assertExpandUrl('{;list}', { list: ['a', 'b'] }, ';list=a,b');
		});

		it('explodes array as ;name=val1;name=val2', () =>
		{
			_assertExpandUrl('{;list*}', { list: ['a', 'b'] }, ';list=a;list=b');
		});

		it('explodes assoc array', () =>
		{
			_assertExpandUrl('{;keys*}', { keys: { k1: 'v1', k2: 'v2' } }, ';k1=v1;k2=v2');
		});
	});

	// -------------------------------------------------------------------------
	// 1.7 Form-Style Query — Level 3
	// -------------------------------------------------------------------------
	describe('? Form-Style Query', () =>
	{
		it('expands scalar with ? prefix', () =>
		{
			_assertExpandUrl('{?var}', { var: 'value' }, '?var=value');
		});

		it('expands boolean true as ?name=true', () =>
		{
			/**
			 * uri-template-lite 將 boolean true 視為字串 "true"
			 * uri-template-lite treats boolean true as string "true"
			 */
			_assertExpandUrl('{?var}', { var: true }, '?var=true');
		});

		it('expands integer', () =>
		{
			_assertExpandUrl('{?var}', { var: 5 }, '?var=5');
		});

		it('expands empty string as ?var=', () =>
		{
			_assertExpandUrl('{?var}', { var: '' }, '?var=');
		});

		it('expands multi-variable as ?x=val&y=val', () =>
		{
			_assertExpandUrl('{?x,y}', { x: 'a', y: 'b' }, '?x=a&y=b');
		});

		it('explodes array as ?var=val1&var=val2', () =>
		{
			_assertExpandUrl('{?list*}', { list: ['a', 'b'] }, '?list=a&list=b');
		});

		it('explodes assoc array as ?key1=val1&key2=val2', () =>
		{
			_assertExpandUrl('{?keys*}', { keys: { k1: 'v1', k2: 'v2' } }, '?k1=v1&k2=v2');
		});

		it('expands undefined to empty string', () =>
		{
			_assertExpandUrl('{?var}', {} as any, '');
		});

		it('encodes special characters in value', () =>
		{
			_assertExpandUrl('{?var}', { var: 'a b' }, '?var=a%20b');
		});
	});

	// -------------------------------------------------------------------------
	// 1.8 Form-Style Continuation — Level 3
	// -------------------------------------------------------------------------
	describe('& Form-Style Continuation', () =>
	{
		it('expands scalar with & prefix', () =>
		{
			_assertExpandUrl('{&var}', { var: 'value' }, '&var=value');
		});

		it('expands boolean true as &name=true', () =>
		{
			/**
			 * uri-template-lite 將 boolean true 視為字串 "true"
			 * uri-template-lite treats boolean true as string "true"
			 */
			_assertExpandUrl('{&var}', { var: true }, '&var=true');
		});

		it('expands multi-variable as &x=val&y=val', () =>
		{
			_assertExpandUrl('{&x,y}', { x: 'a', y: 'b' }, '&x=a&y=b');
		});

		it('explodes array as &var=val1&var=val2', () =>
		{
			_assertExpandUrl('{&list*}', { list: ['a', 'b'] }, '&list=a&list=b');
		});

		it('explodes assoc array as &key1=val1&key2=val2', () =>
		{
			_assertExpandUrl('{&keys*}', { keys: { k1: 'v1', k2: 'v2' } }, '&k1=v1&k2=v2');
		});
	});

});

// =============================================================================
// 2. 修飾詞支援測試
// =============================================================================

describe('modifiers', () =>
{

	// -------------------------------------------------------------------------
	// 2.1 Explode *
	// -------------------------------------------------------------------------
	describe('* explode modifier', () =>
	{
		it('explodes array with Simple String: {list*} → val1,val2', () =>
		{
			_assertExpandUrl('{list*}', { list: ['a', 'b'] }, 'a,b');
		});

		it('explodes assoc array with Simple String: {keys*} → key1=v1,key2=v2', () =>
		{
			_assertExpandUrl('{keys*}', { keys: { k1: 'v1', k2: 'v2' } }, 'k1=v1,k2=v2');
		});

		it('explodes array with Path: {/list*} → /a/b/c', () =>
		{
			_assertExpandUrl('{/list*}', { list: ['a', 'b', 'c'] }, '/a/b/c');
		});

		it('explodes assoc array with Path: {/keys*} → /k1=v1/k2=v2', () =>
		{
			/**
			 * RFC 6570 §3.2.6: "/" 運算子 explode assoc 使用 "=" 作為 kv 分隔符
			 * RFC 6570 §3.2.6: "/" operator explode assoc uses "=" as kv separator
			 */
			_assertExpandUrl('{/keys*}', { keys: { k1: 'v1', k2: 'v2' } }, '/k1=v1/k2=v2');
		});

		it('explodes array with Query: {?list*} → ?list=a&list=b', () =>
		{
			_assertExpandUrl('{?list*}', { list: ['a', 'b'] }, '?list=a&list=b');
		});

		it('explodes assoc with Query: {?keys*} → ?k1=v1&k2=v2', () =>
		{
			_assertExpandUrl('{?keys*}', { keys: { k1: 'v1', k2: 'v2' } }, '?k1=v1&k2=v2');
		});

		it('explodes array with Continuation: {&list*} → &list=a&list=b', () =>
		{
			_assertExpandUrl('{&list*}', { list: ['a', 'b'] }, '&list=a&list=b');
		});

		it('explodes assoc with Matrix: {;keys*} → ;k1=v1;k2=v2', () =>
		{
			_assertExpandUrl('{;keys*}', { keys: { k1: 'v1', k2: 'v2' } }, ';k1=v1;k2=v2');
		});

		it('explodes assoc with Label: {.keys*} (upstream uses "," instead of "." as pair separator)', () =>
		{
			/**
			 * 已知上游限制：uri-template-lite 對 "." 運算子 explode assoc 使用 ","
			 * 而非 RFC 6570 規範的 "." 作為配對分隔符
			 * Known upstream limitation: uri-template-lite uses "," instead of "."
			 * as pair separator for "." operator explode assoc (RFC 6570 §3.2.5)
			 */
			_assertExpandUrlSnapshot('{.keys*}', { keys: { k1: 'v1', k2: 'v2' } });
		});

		it('explodes assoc with Fragment: {#keys*} → #k1=v1,k2=v2  (no . prefix per spec)', () =>
		{
			/**
			 * Fragment 的 explode 行為與無運算子相同（逗號連接）
			 * Fragment explode acts like no-operator (comma-separated pairs)
			 */
			_assertExpandUrl('{#keys*}', { keys: { k1: 'v1', k2: 'v2' } }, '#k1=v1,k2=v2');
		});
	});

	// -------------------------------------------------------------------------
	// 2.2 Prefix Length :N
	// -------------------------------------------------------------------------
	describe(':N prefix-length modifier', () =>
	{
		it('truncates string to N chars: {var:3}', () =>
		{
			_assertExpandUrl('{var:3}', { var: 'value' }, 'val');
		});

		it('returns full string when N exceeds length: {var:10}', () =>
		{
			_assertExpandUrl('{var:10}', { var: 'hello' }, 'hello');
		});

		it('returns empty for empty string: {var:3}', () =>
		{
			_assertExpandUrl('{var:3}', { var: '' }, '');
		});

		it('truncates array to N elements: {list:2} (upstream ignores :N for arrays)', () =>
		{
			/**
			 * 已知上游限制：uri-template-lite 的 ":N" 修飾詞不對陣列生效
			 * Known upstream limitation: uri-template-lite ":N" modifier
			 * does not apply to arrays
			 */
			_assertExpandUrlSnapshot('{list:2}', { list: ['a', 'b', 'c'] });
		});

		it('works with Reserved Expansion: {+path:6}', () =>
		{
			_assertExpandUrl('{+path:6}', { path: '/foo/bar' }, '/foo/b');
		});

		it('works with Path operator: {/var:1}', () =>
		{
			_assertExpandUrl('{/var:1}', { var: 'abc' }, '/a');
		});

		it('works with Query operator: {?var:3}', () =>
		{
			_assertExpandUrl('{?var:3}', { var: 'hello' }, '?var=hel');
		});

		it('works with Matrix operator: {;hello:5}', () =>
		{
			_assertExpandUrl('{;hello:5}', { hello: 'Hello World' }, ';hello=Hello');
		});

		it('works with multi-variable + prefix: {/var:1,other}', () =>
		{
			_assertExpandUrl('{/var:1,other}', { var: 'abc', other: 'xyz' }, '/a/xyz');
		});
	});

});

// =============================================================================
// 3. 多變數（逗號分隔）
// =============================================================================

describe('multi-variables (comma-separated)', () =>
{

	it('Simple String: {x,y} → x,y', () =>
	{
		_assertExpandUrl('{x,y}', { x: '1024', y: '768' }, '1024,768');
	});

	it('Reserved: {+x,y} → x,y (reserved preserved)', () =>
	{
		_assertExpandUrl('{+x,y}', { x: '1024', y: '768' }, '1024,768');
	});

	it('Label: {.x,y} → .a.b', () =>
	{
		/**
		 * RFC 6570 範例：{.who,who} → .fred.fred
		 * 每個變數各自加上 "." 前綴
		 * RFC 6570 examples: {.who,who} → .fred.fred
		 * Each variable gets its own "." prefix
		 */
		_assertExpandUrl('{.x,y}', { x: 'a', y: 'b' }, '.a.b');
	});

	it('Path: {/x,y} → /a/b', () =>
	{
		/**
		 * RFC 6570 範例：{/who,who} → /fred/fred
		 * 每個變數各自加上 "/" 前綴
		 * RFC 6570 examples: {/who,who} → /fred/fred
		 * Each variable gets its own "/" prefix
		 */
		_assertExpandUrl('{/x,y}', { x: 'a', y: 'b' }, '/a/b');
	});

	it('Matrix: {;x,y} → ;x=a;y=b', () =>
	{
		_assertExpandUrl('{;x,y}', { x: 'a', y: 'b' }, ';x=a;y=b');
	});

	it('Query: {?x,y} → ?x=a&y=b', () =>
	{
		_assertExpandUrl('{?x,y}', { x: 'a', y: 'b' }, '?x=a&y=b');
	});

	it('Continuation: {&x,y} → &x=a&y=b', () =>
	{
		_assertExpandUrl('{&x,y}', { x: 'a', y: 'b' }, '&x=a&y=b');
	});

	it('Fragment: {#x,y} → #x,y', () =>
	{
		_assertExpandUrl('{#x,y}', { x: 'a', y: 'b' }, '#a,b');
	});

	it('handles missing variables in multi-var', () =>
	{
		/**
		 * x 有值但 y 未提供：{?x,y} → ?x=a（y 被忽略）
		 * x has value but y is missing: {?x,y} → ?x=a (y is omitted)
		 */
		_assertExpandUrl('{?x,y}', { x: 'a' }, '?x=a');
	});

	it('handles mixed prefix-length in multi-var: {/var:1,other}', () =>
	{
		_assertExpandUrl('{/var:1,other}', { var: 'abc', other: 'xyz' }, '/a/xyz');
	});

	it('handles multiple prefix-lengths: {var:3,other:2}', () =>
	{
		_assertExpandUrl('{var:3,other:2}', { var: 'value', other: 'hello' }, 'val,he');
	});

	it('handles explode + multi-var combination: {/var*,other}', () =>
	{
		/**
		 * 一個 explode + 一個非 explode 的組合
		 * Combination of one explode + one non-explode variable
		 */
		_assertExpandUrl('{/var*,other}', { var: ['a', 'b'], other: 'c' }, '/a/b/c');
	});

});

// =============================================================================
// 4. 變數值型態
// =============================================================================

describe('variable value types', () =>
{

	it('handles string value', () =>
	{
		_assertExpandUrl('{var}', { var: 'hello' }, 'hello');
	});

	it('handles numeric value (integer)', () =>
	{
		_assertExpandUrl('{var}', { var: 42 }, '42');
	});

	it('handles numeric value (zero)', () =>
	{
		_assertExpandUrl('{var}', { var: 0 }, '0');
	});

	it('handles numeric value (negative)', () =>
	{
		_assertExpandUrl('{var}', { var: -1 }, '-1');
	});

	it('handles boolean true', () =>
	{
		_assertExpandUrl('{var}', { var: true }, 'true');
	});

	it('handles boolean false', () =>
	{
		_assertExpandUrl('{var}', { var: false }, 'false');
	});

	it('handles empty string', () =>
	{
		_assertExpandUrl('{var}', { var: '' }, '');
	});

	it('handles null value (treated as absent)', () =>
	{
		_assertExpandUrl('{var}', { var: null }, '');
	});

	it('handles undefined value (treated as absent)', () =>
	{
		_assertExpandUrl('{var}', { var: undefined }, '');
	});

	it('handles missing key (treated as absent)', () =>
	{
		_assertExpandUrl('{var}', {} as any, '');
	});

	it('handles empty array', () =>
	{
		_assertExpandUrl('{list}', { list: [] }, '');
	});

	it('handles empty object (assoc array)', () =>
	{
		_assertExpandUrl('{keys}', { keys: {} }, '');
	});

	it('handles array with one element', () =>
	{
		_assertExpandUrl('{list}', { list: ['single'] }, 'single');
	});

	it('handles array with empty strings', () =>
	{
		_assertExpandUrl('{list}', { list: ['', 'b', ''] }, ',b,');
	});

	it('encodes special chars in string value', () =>
	{
		_assertExpandUrl('{var}', { var: 'a&b=c' }, 'a%26b%3Dc');
	});

	it('preserves special chars in reserved expansion', () =>
	{
		_assertExpandUrl('{+var}', { var: 'a&b=c' }, 'a&b=c');
	});

	it('handles very long string value', () =>
	{
		const long = 'x'.repeat(1000);
		_assertExpandUrl('{var}', { var: long }, long);
	});

	it('handles nested arrays (treated as 0-indexed list)', () =>
	{
		/**
		 * RFC 6570 中陣列不支持巢狀，uri-template-lite 可能展平或序列化
		 * Nested arrays are not supported by RFC 6570; uri-template-lite may flatten
		 */
		const result = expandRfc6570('{list}', { list: [['a', 'b'], 'c'] });
		expect(result.url).toBeDefined();
	});

});

// =============================================================================
// 5. paths vs data 分離邏輯
// =============================================================================

describe('paths vs data separation', () =>
{
	it('puts variables in template into paths', () =>
	{
		_assertExpand(
			'/users/{+user}',
			{ user: 'foo', extra: 'bar' },
			'/users/foo',
			{ user: 'foo' },
			{ extra: 'bar' },
		);
	});

	it('puts variables NOT in template into data', () =>
	{
		const result = expandRfc6570('/users/{+user}', { user: 'foo', extra: 'bar' });
		expect(result.paths).toEqual({ user: 'foo' });
		expect(result.data).toEqual({ extra: 'bar' });
	});

	it('handles all 8 operator variables in paths', () =>
	{
		_assertExpand(
			'{+a}{#b}{.c}{/d}{;e}{?f}{&g}',
			{ a: '1', b: '2', c: '3', d: '4', e: '5', f: '6', g: '7' },
			'1#2.3/4;e=5?f=6&g=7',
			{ a: '1', b: '2', c: '3', d: '4', e: '5', f: '6', g: '7' },
			{},
		);
	});

	it('separates multi-variables into paths', () =>
	{
		_assertExpand(
			'{?x,y}',
			{ x: 'a', y: 'b', extra: 'z' },
			'?x=a&y=b',
			{ x: 'a', y: 'b' },
			{ extra: 'z' },
		);
	});

	it('puts variables with explode modifier into paths', () =>
	{
		_assertExpand(
			'{?list*}',
			{ list: ['a', 'b'], extra: 'z' },
			'?list=a&list=b',
			{ list: ['a', 'b'] },
			{ extra: 'z' },
		);
	});

	it('puts prefix-length variables into paths', () =>
	{
		_assertExpand(
			'{var:3}',
			{ var: 'value', extra: 'x' },
			'val',
			{ var: 'value' },
			{ extra: 'x' },
		);
	});

	it('correctly separates mixed-variable template', () =>
	{
		const template = '/api/{+user}/items{?query,number}';
		_assertExpand(
			template,
			{ user: 'foo', query: 'mycelium', number: 3, extra: 'x' },
			'/api/foo/items?query=mycelium&number=3',
			{ user: 'foo', query: 'mycelium', number: 3 },
			{ extra: 'x' },
		);
	});

	it('data is empty when all variables are in template', () =>
	{
		const result = expandRfc6570('/users/{+user}', { user: 'foo' });
		expect(result.paths).toEqual({ user: 'foo' });
		expect(result.data).toEqual({});
	});

	it('paths is empty when template has no variables', () =>
	{
		const result = expandRfc6570('/users/static', { extra: 'x' });
		expect(result.paths).toEqual({});
		expect(result.data).toEqual({ extra: 'x' });
	});

	it('data includes extra keys not in template', () =>
	{
		const result = expandRfc6570('/users/{+user}', { user: 'foo', a: 1, b: 2 });
		expect(result.paths).toHaveProperty('user', 'foo');
		expect(result.data).toHaveProperty('a', 1);
		expect(result.data).toHaveProperty('b', 2);
	});

	it('works with empty data object', () =>
	{
		const result = expandRfc6570('/users/{+user}', {} as any);
		expect(result.paths).toEqual({ user: undefined });
		expect(result.data).toEqual({});
	});

});

// =============================================================================
// 6. 混合表達式（同一 URL 多個 {…}）
// =============================================================================

describe('mixed expressions', () =>
{
	it('handles 2 Simple String variables in a path', () =>
	{
		_assertExpandUrl('/{a}/{b}', { a: 'x', b: 'y' }, '/x/y');
	});

	it('handles Reserved + Query combination', () =>
	{
		_assertExpandUrl(
			'http://{domain}/~{user}/foo{?query,number}',
			{ domain: 'example.com', user: 'fred', query: 'mycelium', number: 3 },
			'http://example.com/~fred/foo?query=mycelium&number=3',
		);
	});

	it('handles Path + Query combination', () =>
	{
		_assertExpandUrl(
			'/api{/path}{?fields}',
			{ path: 'users', fields: 'name,email' },
			'/api/users?fields=name%2Cemail',
		);
	});

	it('handles Fragment + Query combination', () =>
	{
		_assertExpandUrl(
			'/page{?query}{#frag}',
			{ query: 'search', frag: 'section1' },
			'/page?query=search#section1',
		);
	});

	it('handles multiple same operator in one URL', () =>
	{
		_assertExpandUrl(
			'{+a}/to/{+b}',
			{ a: 'source', b: 'dest' },
			'source/to/dest',
		);
	});

	it('handles mix of operators and non-template text', () =>
	{
		_assertExpandUrl(
			'/search.{format}{?q}',
			{ format: 'json', q: 'test' },
			'/search.json?q=test',
		);
	});

});

// =============================================================================
// 7. 已知 uri-template-lite 限制
// =============================================================================

describe('known uri-template-lite limitations', () =>
{
	/**
	 * Reserved Expansion 中預先編碼值的雙重編碼
	 * Double-encoding of pre-encoded values in Reserved Expansion
	 *
	 * uri-template-lite 對已含百分比編碼的值會再次編碼 % → %25。
	 * 此為上游函式庫限制，此處記錄實際行為以利回歸偵測。
	 *
	 * uri-template-lite double-encodes pre-encoded values: % → %25.
	 * This is an upstream library limitation. We record actual behavior
	 * here for regression detection.
	 */
	describe('reserved expansion double-encoding of pre-encoded values', () =>
	{
		it('{+id} with pre-encoded "admin%2F" double-encodes % → %25', () =>
		{
			_assertExpandUrl('{+id}', { id: 'admin%2F' }, 'admin%252F');
		});

		it('{#id} with pre-encoded "admin%2F" double-encodes % → %25', () =>
		{
			_assertExpandUrl('{#id}', { id: 'admin%2F' }, '#admin%252F');
		});

		it('{+list} with pre-encoded array elements double-encodes', () =>
		{
			_assertExpandUrl(
				'{+list}',
				{ list: ['red%25', '%2Fgreen', 'blue'] },
				'red%2525,%252Fgreen,blue',
			);
		});

		it('{+keys} with pre-encoded assoc values double-encodes', () =>
		{
			_assertExpandUrl(
				'{+keys}',
				{ keys: { key1: 'val1%2F', key2: 'val2' } },
				'key1,val1%252F,key2,val2',
			);
		});

		it('{?id} with pre-encoded "admin%2F" double-encodes', () =>
		{
			_assertExpandUrl('{?id}', { id: 'admin%2F' }, '?id=admin%252F');
		});

		it('{;id} with pre-encoded "admin%2F" double-encodes', () =>
		{
			_assertExpandUrl('{;id}', { id: 'admin%2F' }, ';id=admin%252F');
		});
	});

	/**
	 * 無效模板不拋錯
	 * Invalid templates don't throw
	 *
	 * uri-template-lite 對許多 RFC 6570 定義的無效模板不會拋出錯誤。
	 * 此處記錄最關鍵的幾種，確保行為變更時能通過 snapshot 通知。
	 *
	 * uri-template-lite does not throw for many RFC 6570 invalid templates.
	 * Key patterns are recorded here to catch behavior changes via snapshots.
	 */
	describe('non-throwing for invalid templates', () =>
	{
		it('{/id* (missing closing brace) does not throw', () =>
		{
			expect(() => expandRfc6570('{/id*', {})).not.toThrow();
		});

		it('{var:prefix} (non-numeric prefix) does not throw', () =>
		{
			expect(() => expandRfc6570('{var:prefix}', { var: 'val' })).not.toThrow();
		});

		it('{hello:2*} (conflicting prefix+explode) does not throw', () =>
		{
			expect(() => expandRfc6570('{hello:2*}', { hello: 'world' })).not.toThrow();
		});

		it('{!hello} (invalid operator) does not throw', () =>
		{
			expect(() => expandRfc6570('{!hello}', { hello: 'world' })).not.toThrow();
		});

		it('{with space} (variable name with space) does not throw', () =>
		{
			expect(() => expandRfc6570('{with space}', {})).not.toThrow();
		});

		it('{?empty=default,var} (default value syntax) does not throw', () =>
		{
			expect(() => expandRfc6570('{?empty=default,var}', {})).not.toThrow();
		});
	});

});

// =============================================================================
// 8. 邊界案例
// =============================================================================

describe('edge cases', () =>
{
	describe('empty / no variables', () =>
	{
		it('expands URL without any templates', () =>
		{
			_assertExpandUrl('/api/v1/users', { extra: 'x' }, '/api/v1/users');
		});

		it('expands empty URL', () =>
		{
			_assertExpandUrl('', { extra: 'x' }, '');
		});

		it('expands URL with only static text', () =>
		{
			_assertExpandUrl('https://example.com', {}, 'https://example.com');
		});
	});

	describe('special characters in variable names', () =>
	{
		it('handles numeric variable name: {42}', () =>
		{
			_assertExpandUrl('{42}', { 42: 'value' }, 'value');
		});

		it('handles variable name with underscore: {var_name}', () =>
		{
			_assertExpandUrl('{var_name}', { var_name: 'value' }, 'value');
		});

		it('handles dotted variable name: {last.name}', () =>
		{
			_assertExpandUrl('{last.name}', { 'last.name': 'value' }, 'value');
		});

		it('handles hypen in variable name: {default-graph-uri}', () =>
		{
			_assertExpandUrl('{default-graph-uri}', { 'default-graph-uri': 'val' }, 'val');
		});

		it('handles percent-encoded variable name: {Some%20Thing}', () =>
		{
			_assertExpandUrl('{Some%20Thing}', { 'Some%20Thing': 'value' }, 'value');
		});
	});

	describe('reserved characters in values', () =>
	{
		it('encodes # in Simple String', () =>
		{
			_assertExpandUrl('{var}', { var: 'a#b' }, 'a%23b');
		});

		it('encodes ? in Simple String', () =>
		{
			_assertExpandUrl('{var}', { var: 'a?b' }, 'a%3Fb');
		});

		it('encodes / in Simple String', () =>
		{
			_assertExpandUrl('{var}', { var: 'a/b' }, 'a%2Fb');
		});

		it('preserves / in Reserved Expansion', () =>
		{
			_assertExpandUrl('{+var}', { var: 'a/b' }, 'a/b');
		});

		it('preserves : in Reserved Expansion', () =>
		{
			_assertExpandUrl('{+var}', { var: 'a:b' }, 'a:b');
		});

		it('preserves @ in Reserved Expansion', () =>
		{
			_assertExpandUrl('{+var}', { var: 'user@host' }, 'user@host');
		});
	});

	describe('percent-encoded values (non-reserved)', () =>
	{
		it('passes through %20 in Simple String (encodes the %)', () =>
		{
			/**
			 * RFC 6570 在 Simple String 模式下所有非保留字元都編碼，
			 * 包括 % → %25。值是 "hello world"（%20 是編碼表示），
			 * 即使傳入原始字串 "%20"，在 Simple String 中也會編碼 % → %25。
			 */
			_assertExpandUrl('{var}', { var: '%20' }, '%2520');
		});

		it('passes through %20 in Reserved Expansion', () =>
		{
			_assertExpandUrl('{+var}', { var: '%20' }, '%2520');
		});
	});

	describe('unicode and special chars', () =>
	{
		it('encodes unicode characters', () =>
		{
			_assertExpandUrl('{var}', { var: '中文' }, '%E4%B8%AD%E6%96%87');
		});

		it('encodes accented characters', () =>
		{
			_assertExpandUrl('{var}', { var: 'café' }, 'caf%C3%A9');
		});

		it('encodes control characters (newline)', () =>
		{
			_assertExpandUrl('{var}', { var: 'a\nb' }, 'a%0Ab');
		});
	});

	describe('integer edge cases', () =>
	{
		it('handles zero', () =>
		{
			_assertExpandUrl('{var}', { var: 0 }, '0');
		});

		it('handles negative number', () =>
		{
			_assertExpandUrl('{var}', { var: -42 }, '-42');
		});

		it('handles very large integer', () =>
		{
			_assertExpandUrl('{var}', { var: 9007199254740991 }, '9007199254740991');
		});
	});

});

// =============================================================================
// 9. 回歸測試：實際使用模式
// =============================================================================

describe('regression: real-world usage patterns', () =>
{
	/**
	 * GitHub / Octokit 風格的 API 路徑
	 * GitHub / Octokit style API paths
	 */
	it('GitHub-style path: /repos/{+owner}/{+repo}', () =>
	{
		_assertExpandUrl(
			'/repos/{+owner}/{+repo}',
			{ owner: 'octocat', repo: 'Hello-World' },
			'/repos/octocat/Hello-World',
		);
	});

	it('GitHub-style path with query: /repos/{+owner}/{+repo}{?fields}', () =>
	{
		_assertExpandUrl(
			'/repos/{+owner}/{+repo}{?fields}',
			{ owner: 'octocat', repo: 'Hello-World', fields: 'name,url' },
			'/repos/octocat/Hello-World?fields=name%2Curl',
		);
	});

	/**
	 * REST API 常見模式
	 * Common REST API patterns
	 */
	it('REST pagination: /api/items{?page,per_page}', () =>
	{
		_assertExpandUrl(
			'/api/items{?page,per_page}',
			{ page: 1, per_page: 50 },
			'/api/items?page=1&per_page=50',
		);
	});

	it('REST filter: /api/users{?role,status,sort}', () =>
	{
		_assertExpandUrl(
			'/api/users{?role,status,sort}',
			{ role: 'admin', status: 'active', sort: 'name' },
			'/api/users?role=admin&status=active&sort=name',
		);
	});

	it('URL with api version: /api/v{version}/resource', () =>
	{
		_assertExpandUrl(
			'/api/v{version}/resource',
			{ version: 2 },
			'/api/v2/resource',
		);
	});

	/**
	 * 陣列 explode 的 API 參數
	 * Array explode for API parameters
	 */
	it('explode array in query: /api/filter{?tags*}', () =>
	{
		_assertExpandUrl(
			'/api/filter{?tags*}',
			{ tags: ['javascript', 'typescript', 'node'] },
			'/api/filter?tags=javascript&tags=typescript&tags=node',
		);
	});

	/**
	 * Fragment identifier
	 * Fragment identifier
	 */
	it('URL with fragment: /page{#section}', () =>
	{
		_assertExpandUrl(
			'/page{#section}',
			{ section: 'introduction' },
			'/page#introduction',
		);
	});

	/**
	 * Combined operators in real API
	 * Combined operators in real API
	 */
	it('search API path + query + highlight', () =>
	{
		_assertExpandUrl(
			'/search{/paths*}{?q,limit}{#hl}',
			{ paths: ['users', 'posts'], q: 'test', limit: 10, hl: 'result-5' },
			'/search/users/posts?q=test&limit=10#result-5',
		);
	});

	/**
	 * URL encoding of email addresses
	 * URL encoding of email addresses
	 */
	it('encodes email in Simple String but preserves in Reserved', () =>
	{
		/**
		 * Simple String 中 @ 和 . 被編碼
		 * @ and . are encoded in Simple String
		 */
		_assertExpandUrl('{email}', { email: 'user@example.com' }, 'user%40example.com');

		/**
		 * Reserved Expansion 中 @ 和 . 不被編碼
		 * @ and . are preserved in Reserved Expansion
		 */
		_assertExpandUrl('{+email}', { email: 'user@example.com' }, 'user@example.com');
	});

});

// =============================================================================
// 10. parseRouterVars 整合測試
// =============================================================================

describe('parseRouterVars integration', () =>
{
	it('extracts simple variable name', () =>
	{
		expect(parseRouterVars('{var}')).toEqual(['var']);
	});

	it('extracts reserved variable name', () =>
	{
		expect(parseRouterVars('{+var}')).toEqual(['var']);
	});

	it('extracts operator variable with all 8 operators', () =>
	{
		expect(parseRouterVars('{#var}')).toEqual(['var']);
		expect(parseRouterVars('{.var}')).toEqual(['var']);
		expect(parseRouterVars('{/var}')).toEqual(['var']);
		expect(parseRouterVars('{;var}')).toEqual(['var']);
		expect(parseRouterVars('{?var}')).toEqual(['var']);
		expect(parseRouterVars('{&var}')).toEqual(['var']);
	});

	it('extracts multi-variables', () =>
	{
		expect(parseRouterVars('{x,y}')).toEqual(['x', 'y']);
		expect(parseRouterVars('{?x,y,z}')).toEqual(['x', 'y', 'z']);
	});

	it('extracts variable with explode modifier', () =>
	{
		expect(parseRouterVars('{list*}')).toEqual(['list']);
		expect(parseRouterVars('{/list*}')).toEqual(['list']);
	});

	it('extracts variable with prefix-length modifier', () =>
	{
		expect(parseRouterVars('{var:3}')).toEqual(['var']);
		expect(parseRouterVars('{+path:6}')).toEqual(['path']);
	});

	it('extracts from mixed expressions', () =>
	{
		expect(parseRouterVars('/api/{+a}/{?b,c}/items{/d*}'))
			.toEqual(['a', 'b', 'c', 'd']);
	});

	it('returns empty array for URL without variables', () =>
	{
		expect(parseRouterVars('/api/v1/users')).toEqual([]);
	});

	it('returns empty array for empty string', () =>
	{
		expect(parseRouterVars('')).toEqual([]);
	});

	it('handles duplicate variable names (should deduplicate? No - raw extraction)', () =>
	{
		/**
		 * parseRouterVars 回傳原始的提取結果，不會去重
		 * parseRouterVars returns raw extraction without deduplication
		 */
		const vars = parseRouterVars('{+a}/path/{+a}');
		expect(vars).toEqual(['a', 'a']);
	});

	it('handles numeric variable names', () =>
	{
		expect(parseRouterVars('{42}')).toEqual(['42']);
	});

	it('handles percent-encoded and dotted variable names', () =>
	{
		expect(parseRouterVars('{Some%20Thing}')).toEqual(['Some%20Thing']);
		expect(parseRouterVars('{last.name}')).toEqual(['last.name']);
	});

	it('handles hypen in variable name', () =>
	{
		expect(parseRouterVars('{default-graph-uri}')).toEqual(['default-graph-uri']);
	});

	it('removes empty parts from trailing/comma edge cases', () =>
	{
		/**
		 * {x,} 中空的第二部分被跳過
		 * Empty second part in {x,} is skipped
		 */
		expect(parseRouterVars('{x,}')).toEqual(['x']);
	});
});
