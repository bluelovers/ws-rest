/**
 * Created by user on 2019/6/10.
 */

import execall from 'execall2';
// @ts-ignore
import UriTemplate from 'uri-template-lite';

/**
 * @see uri-template-lite
 */
const expandRe = /\{([#&+.\/;?]?)((?:[\w%.]+(\*|:\d+)?,?)+)\}/g;

export function parseRouterVars(url: string)
{
	return execall(expandRe, url)
		.map((row) =>
		{
			return row.sub[1];
		})
	;
}

export function expand<K extends keyof M = never, M = Record<string, unknown>>(url: string, data: M)
{
	let ks = parseRouterVars(url);

	let ret = ks.reduce((a, k) => {

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

export default parseRouterVars
