/**
 * Created by user on 2019/6/7.
 */
import _methodBuilder, {
	IHandleDescriptor,
	ConstructorLikeType,
	IMemberMethods,
	IHandleDescriptor2, IHandleDescriptor3, IHandleDescriptorReturn2,
} from '../../decorators/build';
import subobject, { IMethod } from '../../helper/subobject';
import { AbstractHttpClient } from '../abstract';
import { AxiosRequestConfig } from 'axios';
import { IParamMetadata } from '../../decorators/body';
import Bluebird = require('bluebird');

export interface IMethodBuilderCache
{
	requestConfig: AxiosRequestConfig,
	bool: boolean,
	requestConfigNew: AxiosRequestConfig,
	paramMetadata: IParamMetadata,
	autoRequest?: boolean,
	requested?: boolean,
}

/**
 * preset type for methodBuilder
 */
export function createMethodBuilder<T extends AbstractHttpClient, R = {}>(wrapFn?: IHandleDescriptor2<T, R & IMethodBuilderCache>)
{
	return function (handler?: IHandleDescriptor3<T, R & IMethodBuilderCache>, autoRequest: boolean = true)
	{
		const old = handler;

		handler = ((data: IHandleDescriptorReturn2<T, R & IMethodBuilderCache>) =>
		{
			const oldThis = data.thisArgv;

			if (data.autoRequest == null)
			{
				data.autoRequest = autoRequest;
			}

			if (wrapFn)
			{
				data = wrapFn.call(data.thisArgv, data);

				if (data.autoRequest == null)
				{
					data.autoRequest = autoRequest;
				}
			}

			if (old)
			{
				const { thisArgv = data.thisArgv, method = data.method, argv = data.argv } = old.call(oldThis, data) || data;

				if (data.autoRequest == null)
				{
					data.autoRequest = autoRequest;
				}

				data = {
					...data,
					thisArgv,
					method,
					argv,
				};
			}

			if (data.autoRequest && !data.requested)
			{
				data.requested = true;

				return {
					...data,
					returnValue: Bluebird.resolve(data.thisArgv.$http(data.requestConfig)).tap((ret) => {
						data.thisArgv.$returnValue = ret;

						if (ret && ret.request && ret.request.res && ret.request.res.responseUrl)
						{
							data.thisArgv.$responseUrl = ret.request.res.responseUrl;
						}

					}),
				};
			}

			return data;
		});

		return _methodBuilder<T>(handler);
	};
}

export default createMethodBuilder;
