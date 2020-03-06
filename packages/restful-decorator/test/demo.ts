/**
 * Created by user on 2019/6/7.
 */

import 'reflect-metadata';
import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import createMethodBuilder from '../lib/wrap/decorators/build';
import { BaseUrl, EnumRestClientMetadata } from '../lib/decorators/http';
import { GET } from '../lib/decorators/method';
import { Authorization, EnumAuthorizationType, Headers } from '../lib/decorators/headers';
import { Once } from 'lodash-decorators';
import { merge } from '../lib/util/merge';
import { _chkSettingUpdate, _getSetting } from '../lib/util/config';
import {
	BodyData,
	BodyParams,
	HandleParamMetadata,
	ParamBody,
	ParamData, ParamHeader,
	ParamPath,
	ParamQuery,
} from '../lib/decorators/body';
import { IUrlLike } from '../lib/util/url';
import subobject from '../lib/helper/subobject';
import { AbstractHttpClient, methodBuilder } from '../lib/wrap/abstract';
import Bluebird from 'bluebird';

@BaseUrl('http://v2.api.dmzj.com')
@Headers({

	'Content-Type': '777',

})
export class A extends AbstractHttpClient
{

	@BaseUrl('http://v2.api.dmzj2.com')
	@GET('https://github.com/aslakhellesoy/:p')
	@Headers({

		Accepts: 'application/json',

	})
	@BodyParams({
		kkk: 777,
	})
	@BodyData({
		kkk: 444,
		aaa: 111,
	})
	//@Authorization('xxxxxxxxxxxx', EnumAuthorizationType.Token)
	@HandleParamMetadata<A>(function (info)
	{
		//console.dir(info);

		return info;
	})
	// @ts-ignore
	@methodBuilder(function (this: A, data)
	{
		const { thisArgv, propertyName, requestConfig, bool, requestConfigNew } = data;

		return data;
	})
	m1(@ParamBody() body: any, @ParamData('c') c: any, @ParamPath('p') p: any, @ParamQuery('q') g: any, @ParamHeader('h') h: any, ...n: any[])
	{
		console.log(2222222);
		console.dir(this.$requestConfig);
		console.dir(this.$url);


		console.dir(this === this.$parent);

		// @ts-ignore
		console.dir(this.$returnValue.request.res.responseUrl);

		console.dir(this);

		return 99999;
	}

}

const aa = (new A({
	method: 'GET',
}));

Bluebird
	.resolve(aa.m1(777, 111, 'express-uri-template', 4, 5, 6))
	.then(function (ret)
	{
		console.dir(ret);
	})
;

//aa.m1(666, 111, 222);

