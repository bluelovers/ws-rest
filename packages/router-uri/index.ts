/**
 * Created by user on 2019/6/9.
 */

/**
 * replace :varname with {varname} to make it RFC 6570 compatible
 * https://github.com/octokit/endpoint.js/blob/master/src/parse.ts
 */
export function routerToRfc6570(url: string)
{
	return url.replace(/:([a-z]\w*)/g, "{+$1}");
}

export function rfc6570ToRouter(url: string)
{
	return url
		.replace(/\{([^{}:"']+)\}/g, (s, w: string) =>
		{
			_notSupport(w, true);

			w = w.replace(/^\+(\w+)$/, '$1');

			return `:${w}`;
		})
		;
}

export function _notSupport(w: string, throwError?: boolean)
{
	if (/^\+?[^\w]+$/.test(w))
	{
		if (throwError)
		{
			throw new TypeError(`only can convert base rule, but got {${w}}`);
		}

		return true;
	}
}

export default routerToRfc6570
