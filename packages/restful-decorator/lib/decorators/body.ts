/**
 * Created by user on 2019/6/8.
 */

import RequestConfig from './config';
import { EnumRestClientMetadata } from './http';
import { getMemberMetadata, IParameterDecorator, IPropertyKey, setMemberMetadata } from 'reflect-metadata-util';
import cloneDeep from 'lodash/cloneDeep';
import lodash_defaults from 'lodash/defaults';

export const SymParamMap = Symbol('ParamMap');

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

export type IEnumRestClientMetadataParamMap =
	EnumRestClientMetadata.PARAM_MAP_PATH
	| EnumRestClientMetadata.PARAM_MAP_QUERY
	| EnumRestClientMetadata.PARAM_MAP_DATA
	| EnumRestClientMetadata.PARAM_MAP_BODY
	| EnumRestClientMetadata.PARAM_MAP_HEADER
	| EnumRestClientMetadata.PARAM_MAP_AUTO
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

export interface IParamMetadata extends IParamMetadata2
{
	[EnumRestClientMetadata.PARAM_PATH]: IParameter[],
	[EnumRestClientMetadata.PARAM_QUERY]: IParameter[],
	[EnumRestClientMetadata.PARAM_DATA]: IParameter[],
	[EnumRestClientMetadata.PARAM_HEADER]: IParameter[],
	[EnumRestClientMetadata.PARAM_BODY]: IParameter,
}

export interface IParamMetadata2
{
	[EnumRestClientMetadata.PARAM_MAP_PATH]: IParameter[],
	[EnumRestClientMetadata.PARAM_MAP_QUERY]: IParameter[],
	[EnumRestClientMetadata.PARAM_MAP_DATA]: IParameter[],
	[EnumRestClientMetadata.PARAM_MAP_HEADER]: IParameter[],
	[EnumRestClientMetadata.PARAM_MAP_BODY]: IParameter[],
	[EnumRestClientMetadata.PARAM_MAP_AUTO]: IParameter[],
}

export function getParamMetadata(target: object, propertyKey: IPropertyKey): IParamMetadata
{
	let maps = getMemberMetadata(SymParamMap, target, propertyKey) as IParamMetadata2;

	return {
		[EnumRestClientMetadata.PARAM_PATH]: getMemberMetadata(EnumRestClientMetadata.PARAM_PATH, target, propertyKey),
		[EnumRestClientMetadata.PARAM_QUERY]: getMemberMetadata(EnumRestClientMetadata.PARAM_QUERY, target, propertyKey),
		[EnumRestClientMetadata.PARAM_DATA]: getMemberMetadata(EnumRestClientMetadata.PARAM_DATA, target, propertyKey),
		[EnumRestClientMetadata.PARAM_HEADER]: getMemberMetadata(EnumRestClientMetadata.PARAM_HEADER, target, propertyKey),
		[EnumRestClientMetadata.PARAM_BODY]: getMemberMetadata(EnumRestClientMetadata.PARAM_BODY, target, propertyKey),

		...maps,
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
	return function (target: any, propertyKey: IPropertyKey, descriptor: TypedPropertyDescriptor<(...argv: any[]) => any>)
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

	// @ts-ignore
	return Object.keys(data)
		// @ts-ignore
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
		// @ts-ignore
		.reduce(function (argv, key: keyof IParamMetadata | keyof IParamMetadata2)
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

			switch (key as keyof IParamMetadata2)
			{
				case EnumRestClientMetadata.PARAM_MAP_AUTO:
				case EnumRestClientMetadata.PARAM_MAP_PATH:
				case EnumRestClientMetadata.PARAM_MAP_BODY:
				case EnumRestClientMetadata.PARAM_MAP_DATA:
				case EnumRestClientMetadata.PARAM_MAP_HEADER:
				case EnumRestClientMetadata.PARAM_MAP_QUERY:

					arr.forEach((row) =>
					{
						argv[row.parameterIndex] = lodash_defaults(row.value, row.defaultValue);
					});

					break;
				default:
					arr.forEach((row) =>
					{
						argv[row.parameterIndex] = row.value == null ? row.defaultValue : row.value;
					});
					break;
			}

			return argv;
		}, argv.slice()) as any as T
		;
}

function _paramBuilderMap(paramName: IEnumRestClientMetadataParamMap)
{
	return function <K extends string = string, V = any>(defaultValue?: V): IParameterDecorator
	{
		return function (target: object, propertyKey: IPropertyKey, parameterIndex: number)
		{
			const paramObj: IParameter<K, V> = {
				key: null,
				parameterIndex,
				defaultValue,
			};

			const data = getMemberMetadata(SymParamMap, target, propertyKey) || {};

			// @ts-ignore
			data[paramName] = data[paramName] || [];

			// @ts-ignore
			data[paramName].push(paramObj);

			setMemberMetadata(SymParamMap, data, target, propertyKey);
		};
	};
}

export const ParamMapPath = _paramBuilderMap(EnumRestClientMetadata.PARAM_MAP_PATH);

export const ParamMapQuery = _paramBuilderMap(EnumRestClientMetadata.PARAM_MAP_QUERY);

export const ParamMapData = _paramBuilderMap(EnumRestClientMetadata.PARAM_MAP_DATA);

export const ParamMapHeader = _paramBuilderMap(EnumRestClientMetadata.PARAM_MAP_HEADER);

export const ParamMapAuto = _paramBuilderMap(EnumRestClientMetadata.PARAM_MAP_AUTO);

export const ParamMapBody = _paramBuilderMap(EnumRestClientMetadata.PARAM_MAP_BODY);
