import { AbstractHttpClient } from 'restful-decorator/lib';
import { IConstructorOptions as IJSDOMConstructorOptions } from 'jsdom-extra/lib/pack';
import { getResponseUrl } from '@bluelovers/axios-util/lib';
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

export { IJSDOM }

@RequestConfigs({
	responseType: 'arraybuffer',
})
export abstract class AbstractHttpClientWithJSDom extends AbstractHttpClient
{

	constructor(...argv: ConstructorParameters<typeof AbstractHttpClient>)
	{
		let [ defaults ] = argv;
		if (defaults && typeof defaults.jar === 'string')
		{
			defaults.jar = CookieJar.deserializeSync(defaults.jar)
		}

		// @ts-ignore
		super(...argv);

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

	_responseDataToJSDOM(data: unknown, response: this["$response"])
	{
		const html = this._decodeBuffer(data);

		let config: IJSDOMConstructorOptions;

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
				cookieJar = response.config.jar;
			}

			if ($responseUrl || cookieJar)
			{
				config = {
					url: $responseUrl,
					cookieJar,
				};

				//console.debug(`_responseDataToJSDOM`, $responseUrl);
			}
		}

		return this._createJSDOM(html, config);
	}

	_encodeURIComponent(text: string): string
	{
		return encodeURIComponent(text)
	}

}

export default AbstractHttpClientWithJSDom
