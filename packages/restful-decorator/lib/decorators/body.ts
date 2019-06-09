/**
 * Created by user on 2019/6/8.
 */

import RequestConfig from './config';
import { EnumRestClientMetadata } from './http';
import { getMemberMetadata, IParameterDecorator, IPropertyKey, setMemberMetadata } from 'reflect-metadata-util';
import cloneDeep from 'lodash/cloneDeep';

export interface IParameter<K = string, V = any>
{
	key: K;
	parameterIndex: number;
	defaultValue?: V
	value?: V | unknown
}

export function BodyParams<T = any>(value: T)
{
	return RequestConfig('params', value, true);
}

export function BodyData<T = any>(value: T)
{
	return RequestConfig('data', value, true);
}

export type IEnumRestClientMetadataParam =
	EnumRestClientMetadata.PARAM_PATH
	| EnumRestClientMetadata.PARAM_QUERY
	| EnumRestClientMetadata.PARAM_DATA
	| EnumRestClientMetadata.PARAM_BODY
	| EnumRestClientMetadata.PARAM_HEADER
	;

function _paramBuilder(paramName: Exclude<IEnumRestClientMetadataParam, EnumRestClientMetadata.PARAM_BODY>)
{
	return function <K extends string = string, V = any>(key: K, defaultValue?: V): IParameterDecorator
	{
		return function (target: object, propertyKey: IPropertyKey, parameterIndex: number)
		{
			const paramObj: IParameter<K, V> = {
				key,
				parameterIndex,
				defaultValue,
			};

			const arr: IParameter[] = getMemberMetadata(paramName, target, propertyKey) || [];

			arr.push(paramObj);

			setMemberMetadata(paramName, arr, target, propertyKey);
		};
	};
}

export function ParamBody<V = any>(defaultValue?: V)
{
	return function (target: object, propertyKey: IPropertyKey, parameterIndex: number)
	{
		const paramObj: IParameter<EnumRestClientMetadata.PARAM_BODY, V> = {
			key: EnumRestClientMetadata.PARAM_BODY,
			parameterIndex,
			defaultValue,
		};

		setMemberMetadata(EnumRestClientMetadata.PARAM_BODY, paramObj, target, propertyKey);
	};
}

export const ParamPath = _paramBuilder(EnumRestClientMetadata.PARAM_PATH);

export const ParamQuery = _paramBuilder(EnumRestClientMetadata.PARAM_QUERY);

export const ParamData = _paramBuilder(EnumRestClientMetadata.PARAM_DATA);

export const ParamHeader = _paramBuilder(EnumRestClientMetadata.PARAM_HEADER);

//export const ParamBody = _paramBuilder(EnumRestClientMetadata.PARAM_BODY)('Body');

export interface IParamMetadata
{
	[EnumRestClientMetadata.PARAM_PATH]: IParameter[],
	[EnumRestClientMetadata.PARAM_QUERY]: IParameter[],
	[EnumRestClientMetadata.PARAM_DATA]: IParameter[],
	[EnumRestClientMetadata.PARAM_HEADER]: IParameter[],
	[EnumRestClientMetadata.PARAM_BODY]: IParameter,
}

export function getParamMetadata(target: object, propertyKey: IPropertyKey): IParamMetadata
{
	return {
		[EnumRestClientMetadata.PARAM_PATH]: getMemberMetadata(EnumRestClientMetadata.PARAM_PATH, target, propertyKey),
		[EnumRestClientMetadata.PARAM_QUERY]: getMemberMetadata(EnumRestClientMetadata.PARAM_QUERY, target, propertyKey),
		[EnumRestClientMetadata.PARAM_DATA]: getMemberMetadata(EnumRestClientMetadata.PARAM_DATA, target, propertyKey),
		[EnumRestClientMetadata.PARAM_HEADER]: getMemberMetadata(EnumRestClientMetadata.PARAM_HEADER, target, propertyKey),
		[EnumRestClientMetadata.PARAM_BODY]: getMemberMetadata(EnumRestClientMetadata.PARAM_BODY, target, propertyKey),
	};
}

export function HandleParamMetadata<T extends any>(fn: ((info: {
	target: T,
	propertyKey: IPropertyKey,
	thisArgv: ThisType<T>,
	argv: any[],
	paramMetadata: IParamMetadata,
}) => {
	paramMetadata: IParamMetadata,
	argv: any[],
}))
{
	return function (target: any, propertyKey: IPropertyKey, descriptor: TypedPropertyDescriptor<Function>)
	{
		const oldMethod = descriptor.value;

		descriptor.value = function (...argv: any[])
		{
			let ret: {
				paramMetadata: IParamMetadata,
				argv: any[],
			};

			let paramMetadata: IParamMetadata;

			paramMetadata = _habdleParamInfo({
				//target,
				//propertyKey,
				//thisArgv: this,
				argv,
				paramMetadata: getParamMetadata(this, propertyKey),
			});

			//console.dir(argv);

			argv = _ParamInfoToArgv(paramMetadata, argv);

			//console.dir(argv);

			ret = fn({
				target,
				propertyKey,
				thisArgv: this,
				argv,
				paramMetadata,
			});

			if (ret.paramMetadata == null)
			{
				ret.paramMetadata = paramMetadata;
			}

			if (ret.argv != null)
			{
				argv = ret.argv;
			}
			else
			{
				ret.argv = argv;
			}

			return oldMethod.apply(this, argv);
		};
	};
}

export function _habdleParamInfo<T>(info: {
	//target: T,
	//propertyKey: IPropertyKey,
	//thisArgv: ThisType<T>,
	argv: any[],
	paramMetadata: IParamMetadata,
})
{
	const { argv } = info;
	const data = cloneDeep(info.paramMetadata) as IParamMetadata;

	return Object.keys(data)
		.reduce((ret: IParamMetadata, key: keyof IParamMetadata) =>
		{
			if (data[key] == null || (Array.isArray(data[key]) && !(data[key] as IParameter[]).length))
			{
				return ret;
			}

			if (key === EnumRestClientMetadata.PARAM_BODY)
			{
				const row = data[key];
				const value = argv[row.parameterIndex];

				ret[key] = {
					...data[key],
					value,
				};
			}
			else
			{
				const arr = data[key] as IParameter[];

				ret[key] = arr.map((row) =>
				{

					const value = argv[row.parameterIndex];

					return {
						...row,
						value,
					} as any as IParameter;
				}) as IParameter[];
			}

			return ret;
		}, {} as IParamMetadata) as IParamMetadata
		;
}

export function _ParamInfoToArgv<T extends any[]>(data: IParamMetadata, argv: T)
{
	return Object.keys(data)
		.reduce(function (argv, key: keyof IParamMetadata)
		{

			let arr: IParameter[];

			if (key === EnumRestClientMetadata.PARAM_BODY)
			{
				arr = [data[key]];
			}
			else
			{
				arr = data[key] as IParameter[];
			}

			arr.forEach((row) =>
			{
				argv[row.parameterIndex] = row.value == null ? row.defaultValue : row.value;
			});

			return argv;
		}, argv.slice())
		;
}
