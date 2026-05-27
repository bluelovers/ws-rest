
export interface ITestData {
	title?: string;
	input?: string;

	expectedRouter?: string;
	expectedRfc6570: string;

	expectedExpandedUrl?: string;

	data?: Record<string, unknown>;
}

/**
 * ============================================================================
 * Round-trip 相容的 Fixture（Router ↔ RFC 6570 可互相轉換）
 * Round-trip compatible fixtures (Router ↔ RFC 6570 interconvertible)
 * ============================================================================
 *
 * 這些 fixture 僅使用簡單的 `:varname` 語法，可與 `{+varname}` 完全 round-trip。
 * These fixtures only use simple `:varname` syntax that fully round-trips with `{+varname}`.
 *
 * `routerToRfc6570` 與 `rfc6570ToRouter` 均能正確處理這些格式。
 * Both `routerToRfc6570` and `rfc6570ToRouter` can correctly handle these formats.
 *
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

];

/**
 * ============================================================================
 * 純 RFC 6570 擴展測試專用 Fixture（無 Router 等效語法）
 * RFC 6570 expansion-only fixtures (no Router equivalent syntax)
 * ============================================================================
 *
 * 這些 fixture 使用 RFC 6570 運算子語法（如 `{?x,y}`、`{#frag}`、`{/path}`），
 * 此類語法在 Router URI（`:varname`）中沒有對應的表達方式，因此無法進行
 * round-trip 轉換測試（routerToRfc6570 / rfc6570ToRouter）。
 *
 * These fixtures use RFC 6570 operator syntax (e.g. `{?x,y}`, `{#frag}`, `{/path}`),
 * which has no equivalent in Router URI (`:varname`) syntax, and therefore
 * cannot participate in round-trip conversion tests (routerToRfc6570 / rfc6570ToRouter).
 *
 * 它們僅用於驗證 `expandRfc6570` 是否能正確展開這類 RFC 6570 模板。
 * They are only used to verify that `expandRfc6570` correctly expands such RFC 6570 templates.
 *
 * @see https://www.npmjs.com/package/uri-template-lite
 */
export const fixturesRfc6570Only: ITestData[] = [

	{
		/**
		 * 查詢參數展開：{?query,number}
		 * Query parameter expansion: {?query,number}
		 *
		 * 測試當 number 未提供時，只展開 query
		 * Tests that only query is expanded when number is not provided
		 */
		expectedRfc6570: `http://{domain}/~{user}/foo{?query,number}`,

		expectedExpandedUrl: `http://example.com/~fred/foo?query=mycelium`,
		data: {
			domain: 'example.com',
			user: 'fred',
			query: 'mycelium',
		},
	},

	{
		/**
		 * 查詢參數展開（多值）：{?query,number}
		 * Query parameter expansion (multiple values): {?query,number}
		 *
		 * 測試當 query 與 number 都提供時，展開為 query=...&number=...
		 * Tests that both query and number expand to query=...&number=...
		 */
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

