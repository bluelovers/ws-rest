/**
 * Created by user on 2019/6/8.
 */
import { EnumRestClientMetadata } from './http';
import { IParameterDecorator, IPropertyKey } from 'reflect-metadata-util';
export declare const SymParamMap: unique symbol;
export interface IParameter<K = string, V = any> {
    key: K;
    parameterIndex: number;
    defaultValue?: V;
    value?: V | unknown;
}
export declare function BodyParams<T = any>(value: T): (target: any, propertyName?: string | symbol) => void;
export declare function BodyData<T = any>(value: T): (target: any, propertyName?: string | symbol) => void;
export declare type IEnumRestClientMetadataParam = EnumRestClientMetadata.PARAM_PATH | EnumRestClientMetadata.PARAM_QUERY | EnumRestClientMetadata.PARAM_DATA | EnumRestClientMetadata.PARAM_BODY | EnumRestClientMetadata.PARAM_HEADER;
export declare type IEnumRestClientMetadataParamMap = EnumRestClientMetadata.PARAM_MAP_PATH | EnumRestClientMetadata.PARAM_MAP_QUERY | EnumRestClientMetadata.PARAM_MAP_DATA | EnumRestClientMetadata.PARAM_MAP_BODY | EnumRestClientMetadata.PARAM_MAP_HEADER | EnumRestClientMetadata.PARAM_MAP_AUTO;
export declare function ParamBody<V = any>(defaultValue?: V): (target: object, propertyKey: string | symbol, parameterIndex: number) => void;
export declare const ParamPath: <K extends string = string, V = any>(key: K, defaultValue?: V) => IParameterDecorator<string | symbol, object>;
export declare const ParamQuery: <K extends string = string, V = any>(key: K, defaultValue?: V) => IParameterDecorator<string | symbol, object>;
export declare const ParamData: <K extends string = string, V = any>(key: K, defaultValue?: V) => IParameterDecorator<string | symbol, object>;
export declare const ParamHeader: <K extends string = string, V = any>(key: K, defaultValue?: V) => IParameterDecorator<string | symbol, object>;
export interface IParamMetadata extends IParamMetadata2 {
    [EnumRestClientMetadata.PARAM_PATH]: IParameter[];
    [EnumRestClientMetadata.PARAM_QUERY]: IParameter[];
    [EnumRestClientMetadata.PARAM_DATA]: IParameter[];
    [EnumRestClientMetadata.PARAM_HEADER]: IParameter[];
    [EnumRestClientMetadata.PARAM_BODY]: IParameter;
}
export interface IParamMetadata2 {
    [EnumRestClientMetadata.PARAM_MAP_PATH]: IParameter[];
    [EnumRestClientMetadata.PARAM_MAP_QUERY]: IParameter[];
    [EnumRestClientMetadata.PARAM_MAP_DATA]: IParameter[];
    [EnumRestClientMetadata.PARAM_MAP_HEADER]: IParameter[];
    [EnumRestClientMetadata.PARAM_MAP_BODY]: IParameter[];
    [EnumRestClientMetadata.PARAM_MAP_AUTO]: IParameter[];
}
export declare function getParamMetadata(target: object, propertyKey: IPropertyKey): IParamMetadata;
export declare function HandleParamMetadata<T extends any>(fn: ((info: {
    target: T;
    propertyKey: IPropertyKey;
    thisArgv: ThisType<T>;
    argv: any[];
    paramMetadata: IParamMetadata;
}) => {
    paramMetadata: IParamMetadata;
    argv: any[];
})): (target: any, propertyKey: string | symbol, descriptor: TypedPropertyDescriptor<Function>) => void;
export declare function _habdleParamInfo<T>(info: {
    argv: any[];
    paramMetadata: IParamMetadata;
}): IParamMetadata;
export declare function _ParamInfoToArgv<T extends any[]>(data: IParamMetadata, argv: T): any[];
export declare const ParamMapPath: <K extends string = string, V = any>(defaultValue?: V) => IParameterDecorator<string | symbol, object>;
export declare const ParamMapQuery: <K extends string = string, V = any>(defaultValue?: V) => IParameterDecorator<string | symbol, object>;
export declare const ParamMapData: <K extends string = string, V = any>(defaultValue?: V) => IParameterDecorator<string | symbol, object>;
export declare const ParamMapHeader: <K extends string = string, V = any>(defaultValue?: V) => IParameterDecorator<string | symbol, object>;
export declare const ParamMapAuto: <K extends string = string, V = any>(defaultValue?: V) => IParameterDecorator<string | symbol, object>;
export declare const ParamMapBody: <K extends string = string, V = any>(defaultValue?: V) => IParameterDecorator<string | symbol, object>;
