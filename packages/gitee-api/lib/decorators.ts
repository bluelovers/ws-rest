/**
 * Created by user on 2019/6/13.
 */

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
	RequestConfigs, TransformRequest, PUT,
} from 'restful-decorator/lib/decorators';
import { mergeAxiosErrorWithResponseData } from 'restful-decorator/lib/wrap/error';
import { AxiosError } from 'axios';
import Bluebird from 'bluebird';
import { ITSResolvable } from 'ts-type/lib/generic';


export function CatchResponseDataError<T, R = any>(fn?: (data: T, err: AxiosError<T>) => ITSResolvable<R>)
{
	return CatchError(async function (e: AxiosError<T>)
	{
		e = mergeAxiosErrorWithResponseData(e);

		let ret: R;

		if (fn)
		{
			ret = await fn(e.response.data, e);
		}

		if (ret != null)
		{
			return Bluebird.reject(ret);
		}

		return Bluebird.reject(e);
	})
}
