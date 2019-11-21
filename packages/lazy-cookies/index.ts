/**
 * Created by user on 2019/6/10.
 */

import toughCookie, { CookieJar, Store } from 'tough-cookie';
import moment from 'moment';
import { ITSRequireAtLeastOne, ITSPickExtra, ITSRequiredWith } from 'ts-type';
import SymbolInspect from 'symbol.inspect';

export class LazyCookie extends toughCookie.Cookie
{
	constructor(prop: Partial<ILazyCookieProperties> = {}, ...argv: any[])
	{
		if (!prop.expires || prop.expires === -1)
		{
			prop.expires = moment().add(1, 'year');
		}
		else if (typeof prop.expires == 'number')
		{
			prop.expires = moment().add(prop.expires, 's');
		}

		for (let key in prop)
		{
			if (moment.isMoment(prop[key as keyof ILazyCookieProperties]))
			{
				// @ts-ignore
				prop[key] = prop[key as keyof LazyCookie.Properties].toDate();
			}
		}

		super(prop as IToughCookieProperties);
	}

	static create(prop?: Partial<ILazyCookieProperties>, ...argv: any[])
	{
		return new this(prop, ...argv)
	}

	/*
	[SymbolInspect]()
	{
		return `LazyCookie(${this.toString()})`
	}
	 */
}

export interface ILazyCookieProperties extends Omit<IToughCookieProperties, 'expires' | 'creation' | 'lastAccessed'>
{
	expires?: Date | moment.Moment | number;
	creation?: Date | moment.Moment;
	lastAccessed?: Date | moment.Moment;
}

export type ILazyCookiePropertiesInput = ITSPickExtra<ILazyCookieProperties, 'key'>

export interface IToughCookieProperties
{
	key?: string;
	value?: string;
	expires?: Date;
	maxAge?: number | 'Infinity' | '-Infinity';
	domain?: string;
	path?: string;
	secure?: boolean;
	httpOnly?: boolean;
	extensions?: string[];
	creation?: Date;
	creationIndex?: number;

	hostOnly?: boolean;
	pathIsDefault?: boolean;
	lastAccessed?: Date;
}

export type ICookiesValue = string | toughCookie.Cookie | ILazyCookiePropertiesInput | LazyCookie

export type ICookiesValueRecord<T extends string> = Record<string | T, ICookiesValue>

export type ICookiesValueInput<T extends string> = ICookiesValueRecord<T> | ICookiesValue[]

export class LazyCookieJar extends toughCookie.CookieJar
{
	enableLooseMode?: boolean;
	rejectPublicSuffixes?: boolean;
	allowSpecialUseDomain?: boolean;
	public store?: toughCookie.Store;

	constructor(store?: any, options = {}, data = {}, url?: string | URL)
	{
		super(store, options);

		this.setData(data, url);
	}

	setData<T extends string>(data: ICookiesValueInput<T>, url?: string | URL)
	{
		url = (url || '').toString();

		data = data as Record<string, ICookiesValue>;

		for (let key in data)
		{
			if (data[key] === null || typeof data[key] != 'object')
			{
				this.setCookieSync(new LazyCookie({
					key,
					value: data[key] as string,
				}), url);
			}
			else if (data[key] instanceof toughCookie.Cookie)
			{
				this.setCookieSync(data[key] as any, url);
			}
			else if (data[key])
			{
				this.setCookieSync(new LazyCookie(data[key] as any), url);
			}
		}

		return this;
	}

	setCookieSync(cookieOrString: ICookiesValue,
		currentUrl?: string | URL,
		options: toughCookie.CookieJar.SetCookieOptions = {},
		...argv: any[]
	)
	{
		if (typeof cookieOrString == 'string')
		{
			cookieOrString = toughCookie.Cookie.parse(cookieOrString);
		}
		else if (!(cookieOrString instanceof toughCookie.Cookie))
		{
			cookieOrString = new LazyCookie(cookieOrString);
		}

		if (!currentUrl)
		{
			if (cookieOrString instanceof toughCookie.Cookie)
			{
				currentUrl = `http://` + cookieOrString.canonicalizedDomain();
			}
		}
		else if (typeof currentUrl != 'string')
		{
			currentUrl = currentUrl.toString();
		}

		// @ts-ignore
		return super.setCookieSync(cookieOrString as toughCookie.Cookie, currentUrl as string, options, ...argv)
	}

	static create(store?: any, options = {}, data = {}, url?: string | URL)
	{
		return new this(store, options, data, url);
	}

	getAllCookies()
	{
		let cookies: toughCookie.Cookie[];

		this.store.getAllCookies(function (err, cookie)
		{
			cookies = cookie;
		});

		return cookies;
	}

	static deserialize(serialized: CookieJar.Serialized | string, store: Store, cb: (err: Error | null, object: CookieJar) => void): void;
	static deserialize(serialized: CookieJar.Serialized | string, cb: (err: Error | null, object: CookieJar) => void): void;
	static deserialize(...argv: any[]): void
	{
		let cb: Function;
		if (argv.length !== 3)
		{
			cb = argv[1];
		}
		else if (argv.length)
		{
			cb = argv[argv.length - 1];
		}

		// @ts-ignore
		CookieJar.deserialize(...argv, (err: Error | null, _jar: LazyCookieJar) => {

			let jar = new this(_jar.store, _jar.rejectPublicSuffixes);

			if (cb)
			{
				cb(this._copyCookieJar(_jar, jar));
			}
		})
	}

	static deserializeSync(serialized: CookieJar.Serialized | string, store?: Store)
	{
		let _jar = CookieJar.deserializeSync(serialized, store) as LazyCookieJar;

		let jar = new this(_jar.store, _jar.rejectPublicSuffixes);
		return this._copyCookieJar(_jar, jar);
	}

	static fromJSON(string: string)
	{
		return this.deserializeSync(string)
	}

	static createFrom(jarFrom: CookieJar | LazyCookieJar)
	{
		let _jar = jarFrom as LazyCookieJar;
		let jar = new this(_jar.store, _jar.rejectPublicSuffixes);
		return this._copyCookieJar(_jar, jar);
	}

	static _copyCookieJar(jarFrom: CookieJar | LazyCookieJar, jarTo: LazyCookieJar)
	{
		jarTo.store = (jarFrom as LazyCookieJar).store;
		jarTo.rejectPublicSuffixes = (jarFrom as LazyCookieJar).rejectPublicSuffixes;
		jarTo.enableLooseMode = (jarFrom as LazyCookieJar).enableLooseMode;
		jarTo.allowSpecialUseDomain = (jarFrom as LazyCookieJar).allowSpecialUseDomain;

		return jarTo;
	}

}

export default LazyCookie

