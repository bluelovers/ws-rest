import { AbstractHttpClient } from 'restful-decorator/lib';
import { IConstructorOptions as IJSDOMConstructorOptions, VirtualConsole } from 'jsdom-extra/lib/pack';
import dotValue, { getResponseUrl } from '@bluelovers/axios-util/lib';
import { CookieJar } from 'tough-cookie';
import { createJSDOM, IJSDOM } from 'jsdom-extra';
import { Buffer } from "buffer";
import { iconvDecode } from './util/utf8';
import { ICreateFnDecode } from './util';
import { getCookieJar } from 'restful-decorator/lib/decorators/config/cookies';
import { ICookiesValue, LazyCookieJar, ICookiesValueInput } from 'lazy-cookies';
import {
	BaseUrl,
	BodyData,
	CacheRequest,
	FormUrlencoded,
	GET,
	Headers,
	methodBuilder,
	ParamData,
	ParamMapData,
	ParamPath,
	POST,
	RequestConfigs,
	TransformResponse,
	CatchError, ParamQuery, HandleParamMetadata,
	ParamMapAuto,
} from 'restful-decorator/lib/decorators';
import Bluebird from 'bluebird';
import { defaultsDeep } from 'lodash';
import { ReturnValueToJSDOM } from './decorators/jsdom';

export { IJSDOM }

@RequestConfigs({
	responseType: 'arraybuffer',
})
export abstract class AbstractHttpClientWithJSDom extends AbstractHttpClient
{
	virtualConsole: VirtualConsole;

	constructor(...argv: ConstructorParameters<typeof AbstractHttpClient>)
	{
		let [ defaults ] = argv;
		if (defaults && typeof defaults.jar === 'string')
		{
			// @ts-ignore
			defaults.jar = CookieJar.deserializeSync(defaults.jar)
		}

		// @ts-ignore
		super(...argv);

		this.virtualConsole = new VirtualConsole();

		this._constructor()
	}

	protected _constructor()
	{

	}

	loginByCookies<T extends string>(cookies_data: ICookiesValueInput<T>)
	{
		return Bluebird.resolve(this.loginByCookiesSync(cookies_data))
	}

	loginByCookiesSync<T extends string>(cookies_data: ICookiesValueInput<T>)
	{
		this._jar().setData(cookies_data || {} as any, this.$baseURL);
		return this
	}

	_iconvDecode(buf: Buffer)
	{
		return iconvDecode(buf)
	}

	_decodeBuffer(buf: unknown | ArrayBuffer | Buffer)
	{
		return this._iconvDecode(Buffer.from(buf as any));
	}

	_createJSDOM(html: string | Buffer, config: IJSDOMConstructorOptions)
	{
		if (config)
		{
			return createJSDOM(html, config);
		}

		return createJSDOM(html);
	}

	_responseDataToJSDOM(data: unknown, response: this["$response"], jsdomOptions?: IJSDOMConstructorOptions)
	{
		const html = this._decodeBuffer(data);

		if (response)
		{
			let $responseUrl = getResponseUrl(response);

			if (!$responseUrl && response.config && response.config.url)
			{
				$responseUrl = response.config.url.toString()
			}

			let cookieJar: CookieJar;

			if (response.config && response.config.jar && typeof response.config.jar === 'object')
			{
				// @ts-ignore
				cookieJar = response.config.jar;
			}

			if ($responseUrl || cookieJar)
			{
				jsdomOptions = {
					...jsdomOptions,
					url: $responseUrl,
					cookieJar,
				};

				//console.debug(`_responseDataToJSDOM`, $responseUrl);
			}
		}

		jsdomOptions = {
			userAgent: dotValue(response, 'config.headers.User-Agent'),
			referrer: dotValue(response, 'config.headers.Referer'),
			virtualConsole: this.virtualConsole,
			...jsdomOptions,
		};

		return this._createJSDOM(html, jsdomOptions);
	}

	_encodeURIComponent(text: string): string
	{
		return encodeURIComponent(text)
	}

	@GET('/cdn-cgi/trace')
	@ReturnValueToJSDOM()
	@methodBuilder()
	async _plugin_cloudflare_trace()
	{
		const jsdom = this.$returnValue as ReturnType<AbstractHttpClientWithJSDom["_createJSDOM"]>;

		const body = jsdom.$(':root').text();

		let data = body
			.split('\n')
			.reduce((a, line) => {

				let m = line.match(/^([^=]+)=(.*)\s*$/);
				if (m)
				{
					// @ts-ignore
					a[m[1]] = m[2]
				}

				return a
			}, {} as {
				/**
				 * '12f313'
				 */
				fl: string,
				/**
				 * domain name
				 */
				h: string,
				ip: string,
				/**
				 * '1587972669.851'
				 */
				ts: string,
				visit_scheme: 'https' | string,
				/**
				 * 'axios/0.18.1'
				 */
				uag: string,
				colo: 'LAX' | string,
				http: 'http/1.1' | string,
				loc: 'TW' | string,
				tls: 'TLSv1.3' | string,
				sni: 'plaintext' | string,
				warp: 'off' | 'on' | string
			})
		;

		return {
			cloudflare: ('ip' in data),
			data,
		}
	}

}

export default AbstractHttpClientWithJSDom
