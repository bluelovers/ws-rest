/**
 * URI 模板解析與擴展模組
 * URI template parsing and expansion module
 *
 * 提供解析路由變數與擴展 URI 模板的功能
 * Provides functionality for parsing router variables and expanding URI templates
 */

import execall from 'execall2';
// @ts-ignore
import UriTemplate from 'uri-template-lite';
import routerToRfc6570 from '.';

export type IExpandDataInput = Record<string, unknown>;

/**
 * URI 模板變數擴展正則表達式
 * URI template variable expansion regex pattern
 *
 * 匹配 RFC 6570 格式的變數定義
 * Matches RFC 6570 format variable definitions
 *
 * @see uri-template-lite
 */
const expandRe = /\{([#&+.\/;?]?)((?:[-\w%.]+(\*|:\d+)?,?)+)\}/g;

/**
 * 解析路由 URL 中的變數名稱
 * Parse variable names from router URL
 *
 * 從 URL 中提取所有變數名稱，支援 RFC 6570 完整語法：
 * - 所有運算子：+ # . / ; ? &
 * - 多重變數：{x,y} → ["x", "y"]
 * - 長度修飾符：{var:3} → ["var"]
 * - Explode 修飾符：{keys*} → ["keys"]
 *
 * Extracts all variable names from URL, supports full RFC 6570 syntax
 *
 * @param url - 包含變數的路由 URL 字串 / Router URL string containing variables
 * @returns 提取的變數名稱陣列 / Array of extracted variable names
 *
 * @example
 * ```typescript
 * parseRouterVars('/users/{+user}/repos/{+repo}');
 * // 返回: ['user', 'repo']
 * // Returns: ['user', 'repo']
 *
 * parseRouterVars('{?x,y}');
 * // 返回: ['x', 'y']
 * // Returns: ['x', 'y']
 *
 * parseRouterVars('{var:3}');
 * // 返回: ['var']
 * // Returns: ['var']
 * ```
 */
export function parseRouterVars(url: string): string[]
{
	const result: string[] = [];
	const matches = execall(expandRe, url);

	for (const match of matches)
	{
		/** 變數字串（可能包含逗號分隔的多個變數）/ Variable string (may contain comma-separated multiple vars) */
		const varsStr: string = match.sub[1];

		if (!varsStr)
		{
			continue;
		}

		/**
		 * 依逗號分割變數列表，並移除修飾符
		 * Split variable list by comma and remove modifiers
		 */
		const parts = varsStr.split(',');

		for (const part of parts)
		{
			if (!part)
			{
				continue;
			}

			/**
			 * 移除修飾符：*（Explode）或 :N（長度限制）
			 * Remove modifiers: * (Explode) or :N (prefix length)
			 */
			const cleanName = part.replace(/\*$/, '').replace(/:\d+$/, '');

			if (cleanName)
			{
				result.push(cleanName);
			}
		}
	}

	return result;
}

/**
 * 擴展 URI 模板並分離路徑與資料參數
 * Expand URI template and separate path and data parameters
 *
 * 將 URL 模板與資料結合，並根據變數類型分離為路徑參數與一般資料參數
 * Combines URL template with data, separating path parameters from data parameters based on variable type
 *
 * @template K - 路徑參數的鍵名類型 / Key type for path parameters
 * @template M - 資料物件的類型 / Type of data object
 * @param url - URI 模板字串 / URI template string
 * @param data - 資料物件 / Data object
 * @returns 包含路由、擴展後的 URL 與分離參數的物件 / Object containing router, expanded URL, and separated parameters
 *
 * @example
 * ```typescript
 * expand('/users/:user', { user: 'foo' });
 * // 返回: { router: '/users/:user', url: '/users/foo', paths: { user: 'foo' }, data: {} }
 * ```
 *
 * @todo FIXME: 修正 {@link parseRouterVars} 支援更多語法
 */
export function expandRfc6570<M extends IExpandDataInput = IExpandDataInput, K extends keyof M = keyof M>(url: string, data: M)
{
	let ks = parseRouterVars(url);

	const ks_all = Array.from(new Set([...ks, ...Object.keys(data)]));

	let ret = ks_all.reduce((a, k) =>
	{
		if (ks.includes(k))
		{
			// @ts-ignore
			a.paths[k] = data[k]
		}
		else
		{
			// @ts-ignore
			a.data[k] = data[k]
		}

		return a;
	}, {
		paths: {} as Pick<M, K>,
		data: {} as Omit<M, K>,
	});

	return {
		router: url,
		url: new UriTemplate(url).expand(data) as string,
		...ret,
	}
}

export { expandRfc6570 as expand }

export function expandRouter<M extends IExpandDataInput = IExpandDataInput, K extends keyof M = keyof M>(url: string, data: M)
{
	return expandRfc6570<M, K>(routerToRfc6570(url), data)
}

/**
 * 匹配 URI 與 RFC 6570 模板
 * Match URI against RFC 6570 template
 *
 * 使用 uri-template-lite 的 Template.match 功能，將 URI 與模板進行匹配，
 * 並返回匹配到的變數值（已解碼）。
 *
 * Uses uri-template-lite's Template.match to match a URI against a template
 * and return the decoded matched variable values.
 *
 * @param template - RFC 6570 URI 模板 / RFC 6570 URI template
 * @param uri - 要匹配的 URI / URI to match
 * @returns 匹配到的變數物件，鍵為變數名稱、值為解碼後的字串；
 *          若無匹配則回傳 undefined。
 *          Object with matched variables (keys are variable names,
 *          values are decoded strings); or undefined when no match.
 *
 * @example
 * ```typescript
 * matchRfc6570('/users/{+user}', '/users/foo/bar');
 * // → { user: 'foo/bar' }
 *
 * matchRfc6570('/users/{+user}', '/other/route');
 * // → undefined
 *
 * matchRfc6570('/search{?q}', '/search?q=hello');
 * // → { q: 'hello' }
 * ```
 */
export function matchRfc6570(template: string, uri: string): Record<string, string> | undefined
{
	const result = new UriTemplate(template).match(uri);

	/**
	 * uri-template-lite 在不匹配時回傳 null，統一轉換為 undefined 以符合慣例
	 * uri-template-lite returns null on no match; normalize to undefined
	 */
	return result ?? undefined;
}

export { matchRfc6570 as match }

/**
 * 以 Router 語法模板匹配 URI
 * Match URI against Router-format template
 *
 * 將 Router 語法（:varname）轉換為 RFC 6570 格式後再進行匹配。
 * Converts Router syntax (:varname) to RFC 6570 before matching.
 *
 * @param template - Router 格式的 URI 模板 / Router-format URI template
 * @param uri - 要匹配的 URI / URI to match
 * @returns 匹配到的變數物件，若不匹配則回傳 undefined /
 *          Object with matched variables, or undefined when no match
 *
 * @example
 * ```typescript
 * matchRouter('/users/:user', '/users/foo/bar');
 * // → { user: 'foo/bar' }
 *
 * matchRouter('/users/:user', '/other/route');
 * // → undefined
 * ```
 */
export function matchRouter(template: string, uri: string): Record<string, string> | undefined
{
	return matchRfc6570(routerToRfc6570(template), uri);
}

export default parseRouterVars
