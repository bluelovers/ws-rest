import { CacheRequest } from 'restful-decorator/lib/decorators/config/cache';
import AbstractHttpClientWithJSDom, { IJSDOM } from 'restful-decorator-plugin-jsdom/lib';
import { AbstractHttpClient, IBluebird } from 'restful-decorator/lib';
import { POST, GET } from 'restful-decorator/lib/decorators/method';
import { FormUrlencoded } from 'restful-decorator/lib/decorators/form';
import { methodBuilder } from 'restful-decorator/lib/wrap/abstract';
import { ParamMapAuto } from 'restful-decorator/lib/decorators/body';
import { ReturnValueToJSDOM } from 'restful-decorator-plugin-jsdom/lib/decorators/jsdom';
import { _checkLoginUsername, _checkLoginByJQuery } from './util/jquery/_checkLogin';
import Bluebird from 'bluebird';

/**
 * Created by user on 2020/5/13.
 */

@CacheRequest({
	cache: {
		maxAge: 6 * 60 * 60 * 1000,
	},
})
export class PHPWindClient extends AbstractHttpClientWithJSDom
{

	constructor(...argv: ConstructorParameters<typeof AbstractHttpClient>)
	{
		let [defaults = {}] = argv;

		if (!defaults.baseURL)
		{
			throw new TypeError(`baseURL must set`)
		}

		argv[0] = defaults;

		super(...argv);
	}

	@POST('login.php?submit=login')
	@ReturnValueToJSDOM()
	@FormUrlencoded
	@CacheRequest({
		cache: {
			maxAge: 0,
		},
	})
	// @ts-ignore
	@methodBuilder(function (this: PHPWindClient, info)
	{
		const inputData = info.argv[0];

		let data = info.requestConfig.data;
		data.cktime = inputData.cookietime || 31536000;
		data.jumpurl = this.$baseURL;
		data.step = 2;

		data.pwuser = inputData.username;
		data.pwpwd = inputData.password;
		data.forward = '';

		return info;
	})
	loginByForm(@ParamMapAuto({
		cookietime: 315360000,
		lgt: 0,
	}) inputData: {
		username: string,
		password: string,
		cookietime?: number,
		lgt?: number | 0 | 1 | 2,
		hideid?: number | 0 | 1,
	}): IBluebird<boolean|string>
	{
		const jsdom = this.$returnValue as IJSDOM;
		const { $ } = jsdom;

		let username = _checkLoginUsername(jsdom.$);

		if (username != null)
		{
			return Bluebird.resolve(username)
		}

		return this.isLogin()
			.then(bool => {

				if (!bool)
				{
					return Promise.reject(bool);
				}

				return bool
			})
			;
	}

	@GET('message.php')
	@ReturnValueToJSDOM()
	@CacheRequest({
		cache: {
			maxAge: 0,
		},
	})
	@methodBuilder()
	isLogin(): IBluebird<boolean | string>
	{
		const jsdom = this.$returnValue as IJSDOM;

		let username = _checkLoginUsername(jsdom.$);

		if (username != null)
		{
			return Bluebird.resolve(username)
		}

		return Bluebird.resolve(_checkLoginByJQuery(jsdom.$))
	}

}

export default PHPWindClient
