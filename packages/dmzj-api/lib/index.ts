import { AbstractHttpClient } from 'restful-decorator/lib';
import { IBluebirdAxiosResponse, IUnpackedPromiseLikeReturnType, AxiosRequestConfig } from 'restful-decorator/lib/types/axios';
import {
	FormUrlencoded,
	POST,
	ParamData,
	BaseUrl,
	methodBuilder,
	RequestConfig,
	Headers,
	RequestConfigs, TransformRequest,
	CacheRequest, SetCookies, GET,
} from 'restful-decorator/lib/decorators';
import { ITSUnpackedPromiseLike, ITSKeyofMemberMethods } from 'ts-type';
import { ICookiesValue, ICookiesValueInput, ICookiesValueRecord } from 'lazy-cookies';
import { getCookieJar } from 'restful-decorator/lib/decorators/config/cookies';
import consoleDebug from 'restful-decorator/lib/util/debug';
import { buildParameterDecorator } from 'reflect-metadata-util';
import { IBluebird } from 'restful-decorator/lib/index';
import Bluebird from 'bluebird';

@BaseUrl('http://v2.api.dmzj.com')
@RequestConfig('responseType', 'json')
@TransformRequest((data) =>
{
	if (typeof data === 'string')
	{
		try
		{
			return JSON.parse(data)
		}
		catch (e)
		{
			try
			{
				return JSON.parse(data.replace(/(?<=\})test$/, ''))
			}
			catch (e)
			{
			}
		}
	}
})
@RequestConfigs({
	responseType: 'json',
})
//@CacheRequest({
//	cache: {
//		maxAge: 15 * 60 * 1000,
//	},
//})
export class DmzjClient extends AbstractHttpClient
{
	constructor(defaults?: AxiosRequestConfig)
	{
		super(defaults);

		//consoleDebug.debug(`constructor`);
		//consoleDebug.dir(this.$http.defaults);

		//console.dir(this.$http.defaults.jar);

		//process.exit();
	}

	protected _init(defaults?: AxiosRequestConfig): any
	{
		defaults = super._init(defaults);

		//consoleDebug.debug(`_init`);
		//consoleDebug.dir(defaults);

		return defaults;
	}

	@POST('https://user.dmzj.com/loginV2/m_confirm')
	@methodBuilder(null)
	@FormUrlencoded
	loginConfirm(@ParamData('nickname') nickname: string,
		@ParamData('passwd') passwd: string,
	): IBluebirdAxiosResponse<{
		result: number | 0 | 1;
		msg: string | 'OK';
		data?: {
			uid: string;
			nickname: string;
			dmzj_token: string;
			photo: string;
			bind_phone: string;
			email: string;
			passwd: string;
		};
	}>
	{
		let response = this.$returnValue as any as IUnpackedPromiseLikeReturnType<DmzjClient["loginConfirm"]>;

		if (!response.data.result || !response.data.data)
		{
			throw new Error(`${response.data}`)
		}

		this.$sharedPreferences.set('user_info', response.data.data);

		return
	}

	async loginByCookies(cookies_data: IDmzjClientCookies | ICookiesValue[])
	{
		const jar = getCookieJar(this);
		jar.setData(cookies_data || {});

		//consoleDebug.dir(jar);

		return Bluebird.resolve(this)
	}

	@GET('https://i.dmzj.com/subscribe')
	@methodBuilder()
	webSubscribe(): IBluebird<this>
	{
		//consoleDebug.dir(this.$requestConfig);
		//consoleDebug.dir(this.$http.defaults.jar);

		//console.dir(this.$responseUrl);

		// @ts-ignore
//		console.dir(this.$responseUrl);

		const jar = getCookieJar(this);
		consoleDebug.dir(jar);

		console.dir(this.$returnValue.headers);

		return
	}

}

interface IDmzjClientCookies extends ICookiesValueRecord<'token' | 'cookie' | 'uid' | 'PHPSESSID' | 'ci_session' | 'dmzj_session'>
{

}

export default DmzjClient
