/**
 * Created by user on 2019/11/21.
 */

// @ts-ignore
import _sniffHTMLEncoding from 'html-encoding-sniffer';
import iconv, { decode as _iconvDecode } from 'iconv-jschardet';
import { CookieJar, Store } from 'tough-cookie';
import { LazyCookieJar } from 'lazy-cookies';
import { removeZeroWidth } from 'zero-width';
import { crlf } from 'crlf-normalize';
import { minifyHTML } from 'jsdom-extra/lib/html';
import { Buffer } from 'buffer';

export { removeZeroWidth }

export function trimUnsafe<T extends string>(input: T): T
{
	// @ts-ignore
	return removeZeroWidth(crlf(input))
		.replace(/^\s+|\s+$/gu, '')
		.replace(/[\u00A0]/gu, ' ')
		.replace(/[\t ]+/gu, ' ')
		.trim()
}

export function _checkLoginByJQuery($: JQueryStatic)
{
	return $('.vwmy a[href*="uid="], #loginstatusid')
		.length > 1
}
