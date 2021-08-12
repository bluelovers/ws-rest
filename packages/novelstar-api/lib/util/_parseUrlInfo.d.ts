import { IAllowedInput } from '@node-novel/parse-input-url';
import { ITSRequireAtLeastOne } from 'ts-type';
/**
 * 支援
 * - https://www.novelstar.com.tw/books/7495.html
 */
export declare function _parseUrlInfo<T extends IAllowedInput>(input: T): {
    novel_id: string;
    chapter_id: string;
    user_id: string;
    value: string;
    _input: T | (T & string) | (T & import("lazy-url").LazyURL) | (T & URL) | (T & import("http-form-urlencoded").LazyURLSearchParams) | (T & URLSearchParams);
};
export declare type IReturnTypeParseUrlInfo = ReturnType<typeof _parseUrlInfo>;
export declare function _buildURLByParseUrlInfo(input: ITSRequireAtLeastOne<IReturnTypeParseUrlInfo, Exclude<keyof IReturnTypeParseUrlInfo, 'value' | '_input'>>, baseURL?: string): string;
