import { CookieJar, Store } from 'tough-cookie';
import { LazyCookieJar } from 'lazy-cookies';

export function deserializeCookieJar(serialized: CookieJar.Serialized | string, store?: Store)
{
	return LazyCookieJar.deserializeSync(serialized, store)
}
