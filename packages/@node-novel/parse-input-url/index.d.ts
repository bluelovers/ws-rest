/**
 * Created by user on 2020/4/9.
 */
import LazyURLSearchParams from 'http-form-urlencoded';
import { LazyURL } from 'lazy-url';
export declare enum EnumParseInputUrl {
    UNKNOWN = 0,
    STRING = 1,
    NUMBER = 2,
    URL = 3,
    URLSEARCHPARAMS = 4
}
export declare type IAllowedInput = string | number | URL | LazyURL | LazyURLSearchParams | URLSearchParams;
export declare function _handleInputUrl<T extends IAllowedInput>(_input: T): {
    type: EnumParseInputUrl.URL;
    _input: T & string;
    value: LazyURL;
} | {
    type: EnumParseInputUrl.STRING;
    _input: T & string;
    value: string;
} | {
    type: EnumParseInputUrl.URL;
    _input: (T & LazyURL) | (T & URL);
    value: LazyURL;
} | {
    type: EnumParseInputUrl.URLSEARCHPARAMS;
    _input: (T & LazyURLSearchParams) | (T & URLSearchParams);
    value: LazyURLSearchParams;
} | {
    type: EnumParseInputUrl.NUMBER;
    _input: T;
    value: string;
} | {
    type: EnumParseInputUrl.UNKNOWN;
    _input: T;
    value: string;
};
export default _handleInputUrl;
