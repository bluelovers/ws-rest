import { minifyHTML } from 'jsdom-extra/lib/html';

export { minifyHTML }

export function tryMinifyHTML(html: string, throwError?: boolean | ((html: string) => any))
{
	try
	{
		html = minifyHTML(html);

		if (typeof throwError === 'function')
		{
			return throwError(html);
		}
	}
	catch (e)
	{
		if (throwError === true)
		{
			throw e;
		}
	}

	return html;
}

export default tryMinifyHTML
