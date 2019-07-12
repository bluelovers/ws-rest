import { AbstractHttpClient } from 'restful-decorator/lib';
import { AxiosRequestConfig, IBluebirdAxiosResponse } from 'restful-decorator/lib/types/axios';
import {
	CatchError,
	FormUrlencoded,
	BaseUrl, BodyParams,
	CacheRequest,
	GET,
	Headers,
	methodBuilder, ParamData,
	ParamMapAuto, ParamMapData,
	ParamPath,
	ParamQuery,
	POST,
	HandleParamMetadata,
	RequestConfigs, TransformRequest, PUT, BodyData,
} from 'restful-decorator/lib/decorators';
import { _makeAuthorizationValue } from 'restful-decorator/lib/decorators/headers';
import Bluebird from 'bluebird';
import { AxiosError } from 'axios';

import { ITSResolvable } from 'ts-type';
import { IBluebird } from 'restful-decorator/lib/index';

const SymApiOptions = Symbol('options');

export interface ICaiyunFanyiOptions
{
	token: string,
	defaults?: AxiosRequestConfig,
}

interface IImgBBUpload
{
	data: {
		id: string;
		url_viewer: string;
		url: string;
		display_url: string;
		title: string;
		time: string;
		image: {
			filename: string;
			name: string;
			mime: string;
			extension: string;
			url: string;
			size: number;
		};
		thumb: {
			filename: string;
			name: string;
			mime: string;
			extension: string;
			url: string;
			size: number;
		};
		delete_url: string;
	};
	success: boolean;
	status: number | 200;
}

@BaseUrl('https://api.imgbb.com/')
@Headers({
	'Accept': 'application/json',
})
@RequestConfigs({
	responseType: 'json',
})
export class ImgBB extends AbstractHttpClient
{

	[SymApiOptions]: ICaiyunFanyiOptions;

	constructor(options: ICaiyunFanyiOptions)
	{
		super(options.defaults, options)
	}

	protected _init(defaults?: AxiosRequestConfig, options?: ICaiyunFanyiOptions, ...argv: any): any
	{
		defaults = super._init(defaults, ...argv);

		this[SymApiOptions] = Object.assign(this[SymApiOptions] || {} as any, options);

		return defaults
	}

	setAccessToken(accessToken: string)
	{
		this[SymApiOptions].token = accessToken;

		return this;
	}

	@POST('1/upload')
	@FormUrlencoded
	@HandleParamMetadata((data) => {

		const [ argv ] = data.argv;

		if (argv)
		{
			if (typeof argv.image !== 'string')
			{
				if (Buffer.isBuffer(argv.image))
				{
					argv.image = (argv.image as Buffer).toString('base64');
				}
			}

			if (argv.key == null)
			{
				// @ts-ignore
				argv.key = data.thisArgv[SymApiOptions].token;
			}
		}

		return data
	})
	@methodBuilder()
	@CatchError(function (e: AxiosError)
	{
		if (e.response.data && e.response.data.message)
		{
			return Bluebird.reject(e.response.data)
		}

		return Bluebird.reject(e)
	})
	/**
	 * API v1 calls can be done using the POST or GET request methods but since GET request are limited by the maximum allowed length of an URL you should prefer the POST request method.
	 */
	upload(@ParamMapAuto() jsonData: {
		key?: string,
		/**
		 * The name of the file, this is automatically detected if uploading a file with a POST and multipart / form-data
		 */
		name?: string,
		/**
		 * A binary file, base64 data, or a URL for an image. (up to 16MB)
		 */
		image: string | Buffer,
	}): IBluebird<IImgBBUpload>
	{
		const $returnValue = this.$returnValue as any as IImgBBUpload;

		if ($returnValue && $returnValue.data)
		{
			$returnValue.data.image.size = $returnValue.data.image.size | 0;
			$returnValue.data.thumb.size = $returnValue.data.thumb.size | 0;
		}

		return Bluebird.resolve($returnValue)
	}

}

export default ImgBB