/**
 * Created by user on 2019/11/21.
 */

// @ts-ignore
import _sniffHTMLEncoding from 'html-encoding-sniffer';
import iconv, { decode as _iconvDecode } from 'iconv-jschardet';
import { CookieJar, Store } from 'tough-cookie';
import { LazyCookieJar } from 'lazy-cookies';
import { removeZeroWidth } from 'zero-width';

export { removeZeroWidth }

export function arrayBufferToString(buf: number[])
{
	return String.fromCharCode.apply(null, buf);
}

export function sniffHTMLEncoding(buf: unknown | ArrayLike<number>, defaultEncoding = 'GBK'): string
{
	return _sniffHTMLEncoding(buf, {
		defaultEncoding,
	});
}

export function iconvDecode(buf: unknown | ArrayLike<number>, defaultEncoding?: string)
{
	return _iconvDecode(buf, sniffHTMLEncoding(buf, defaultEncoding));
}

export function deserializeCookieJar(serialized: CookieJar.Serialized | string, store?: Store)
{
	return LazyCookieJar.deserializeSync(serialized, store)
}

export function trimUnsafe<T extends string>(input: T): T
{
	// @ts-ignore
	return removeZeroWidth(input)
		.replace(/^\s+|\s+$/gu, '')
		.replace(/\r|\n|[\u00A0]/gu, ' ')
		.replace(/\s+/gu, ' ')
		.trim()
}
