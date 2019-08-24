import { AbstractHttpClient } from 'restful-decorator/lib';
import { AxiosRequestConfig } from 'restful-decorator/lib/types/axios';
import {
	BaseUrl,
	BodyData,
	CacheRequest,
	CatchError,
	FormUrlencoded,
	GET,
	HandleParamMetadata,
	Headers,
	methodBuilder,
	ParamData,
	ParamMapAuto,
	ParamMapQuery,
	POST,
	PUT,
	RequestConfigs,
	TransformRequest,

} from 'restful-decorator/lib/decorators';
import { ITSPickExtra, ITSValueOrArray } from 'ts-type';
import { IBluebird } from 'restful-decorator/lib/index';
import LazyURL from 'lazy-url';
import { defaultsDeep } from 'lodash';
import { _makeAuthorizationValue, EnumAuthorizationType } from 'restful-decorator/lib/decorators/headers';
// @ts-ignore
import { AxiosError } from 'axios';
import { mergeAxiosErrorWithResponseData } from 'restful-decorator/lib/wrap/error';
import Bluebird from 'bluebird';
// @ts-ignore
import deepEql from 'deep-eql';
import { IBluebirdAxiosResponse } from '@bluelovers/axios-extend/lib';
import { ISearchSingle, ISearchSingleDataRowPlus } from './types';

@BaseUrl('https://lhscan.net')
@Headers({
	'Accept': 'application/json',
})
@RequestConfigs({
	responseType: 'json',
})
@CacheRequest({
	cache: {
		maxAge: 15 * 60 * 1000,
		readHeaders: false,
	},
})
/**
 * @link https://lhscan.net/app/manga/controllers/search.single.php?q=%E9%AA%91%E5%A3%AB%E9%AD%94
 */
export class LHScanClient extends AbstractHttpClient
{

	@GET('app/manga/controllers/search.single.php')
	@methodBuilder()
	_searchSingle(@ParamData('q') keyword: string): IBluebird<ISearchSingle[]>
	{
		return null;
	}

	createURL(url: string)
	{
		return new LazyURL(url, this.$baseURL);
	}

	searchSingle(keyword: string)
	{
		return this._searchSingle(keyword)
			.then(ret => {
				return ret.map(topRow => {
					let data = topRow.data.map(data => {

						let href = data.onclick.replace(/^window.location=['"](.+?)['"]/, '$1');

						href = this.createURL(href).toString();

						return <ISearchSingleDataRowPlus>{
							...data,
							href,
						};
					});
					return {
						...topRow,
						data,
					};
				})
			})
	}

}

export default LHScanClient