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
import Bluebird from 'bluebird';

export interface IMethodBuilderCache
{
	requestConfig: AxiosRequestConfig,
	bool: boolean,
	requestConfigNew: AxiosRequestConfig,
	paramMetadata: IParamMetadata,
	autoRequest?: boolean,
	requested?: boolean,
}

export interface IMethodBuilderOptions<T extends object, R>
{
	handler?: IHandleDescriptor3<T, R & IMethodBuilderCache>
	/**
	 * @default true
	 */
	autoRequest?: boolean;

	/**
	 * 當 autoRequest 啟用時 會自動將回傳內容改為 response.data
	 * @default true
	 */
	returnData?: boolean;
}

/**
 * preset type for methodBuilder
 */
export function createMethodBuilder<T extends AbstractHttpClient, R = {}>(wrapFn?: IHandleDescriptor2<T, R & IMethodBuilderCache>)
{
	return function (handler?: IHandleDescriptor3<T, R & IMethodBuilderCache> | IMethodBuilderOptions<T, R>,
		builderOptions: IMethodBuilderOptions<T, R> | boolean = true,
	)
	{
		if (handler && typeof handler === 'object' && (builderOptions == null || builderOptions === true))
		{
			([builderOptions, handler] = [handler, null]);
		}

		if (typeof builderOptions === 'boolean')
		{
			builderOptions = {
				autoRequest: builderOptions,
			} as IMethodBuilderOptions<T, R>
		}

		builderOptions = builderOptions || {} as IMethodBuilderOptions<T, R>;

		if (builderOptions.autoRequest == null)
		{
			builderOptions.autoRequest = true;
		}

		if (builderOptions.returnData == null && builderOptions.autoRequest)
		{
			builderOptions.returnData = true;
		}

		if (builderOptions.handler)
		{
			handler = builderOptions.handler
		}

		if (handler && typeof handler != 'function')
		{
			throw new TypeError(`typeof handler != 'function'`)
		}

		let { autoRequest } = builderOptions;

		const old = handler as IHandleDescriptor3<T, R & IMethodBuilderCache>;

		handler = ((data: IHandleDescriptorReturn2<T, R & IMethodBuilderCache>) =>
		{
			const oldThis = data.thisArgv;

			if (data.autoRequest == null)
			{
				data.autoRequest = autoRequest;
			}

			if (wrapFn)
			{
				data = wrapFn.call(data.thisArgv, data as any);

				if (data.autoRequest == null)
				{
					data.autoRequest = autoRequest;
				}
			}

			if (old)
			{
				const { thisArgv = data.thisArgv, method = data.method, argv = data.argv } = old.call(oldThis, data as any) || data;

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

			(builderOptions as IMethodBuilderOptions<T, R>).autoRequest = data.autoRequest;

			if (data.autoRequest && !data.requested)
			{
				data.requested = true;

				//console.dir(data.thisArgv);

				return {
					...data,
					builderOptions: builderOptions as IMethodBuilderOptions<T, R>,
					returnValue: Bluebird
						.resolve(data.thisArgv.$http(data.requestConfig))
						.then(function (ret)
						{
							// @ts-ignore
							data.thisArgv.$returnValue = ret;

							data.thisArgv.$response = ret;

							// @ts-ignore
							if (ret && ret.request && ret.request.res && ret.request.res.responseUrl)
							{
								// @ts-ignore
								data.thisArgv.$responseUrl = ret.request.res.responseUrl;
							}

							if ((builderOptions as IMethodBuilderOptions<T, R>).returnData)
							{
								// @ts-ignore
								data.thisArgv.$returnValueSource = data.thisArgv.$returnValue;
								return data.thisArgv.$returnValue = ret.data;
							}

							return ret;
						})
					,
				};
			}

			return {
				...data,
				builderOptions: builderOptions as IMethodBuilderOptions<T, R>,
			};
		});

		return _methodBuilder<T>(handler as any);
	};
}

export default createMethodBuilder;
