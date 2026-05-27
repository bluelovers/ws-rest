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
const expandRe = /\{([#&+.\/;?]?)((?:[\w%.]+(\*|:\d+)?,?)+)\}/g;

/**
 * 解析路由 URL 中的變數名稱
 * Parse variable names from router URL
 *
 * 從 URL 中提取所有變數名稱，用於後續的模板擴展
 * Extracts all variable names from URL for subsequent template expansion
 *
 * @param url - 包含變數的路由 URL 字串 / Router URL string containing variables
 * @returns 提取的變數名稱陣列 / Array of extracted variable names
 *
 * @example
 * ```typescript
 * parseRouterVars('/users/:user/repos/:repo');
 * // 返回: ['user', 'repo']
 * // Returns: ['user', 'repo']
 * ```
 *
 * @todo FIXME: 修正支援更多語法，目前只支援最簡譯的
 */
export function parseRouterVars(url: string)
{
	return execall(expandRe, url)
		.map((row) =>
		{
			return row.sub[1];
		})
	;
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
export function expandRfc6570<K extends keyof M = never, M extends IExpandDataInput = IExpandDataInput>(url: string, data: M)
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

export default parseRouterVars
