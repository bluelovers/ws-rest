import { LazyURL } from 'lazy-url';
import { IAllowedInput } from '@node-novel/parse-input-url';
/**
 * 支援
 * - https://masi.ro/n378
 * - https://masi.ro/c29630
 * - https://masi.ro/p6172
 * - https://masi.ro/f25
 * - novel_id=
 * - cid=
 * - forum_id=
 * - post_id=
 * - user_id=
 */
export declare function _parseUrlInfo<T extends IAllowedInput>(input: T): {
    novel_id: string;
    chapter_id: string;
    forum_id: string;
    post_id: string;
    user_id: string;
    value: string;
    _input: T | (T & string) | (T & LazyURL) | (T & URL) | (T & import("http-form-urlencoded").LazyURLSearchParams) | (T & URLSearchParams);
};
export declare type IReturnTypeParseUrlInfo = ReturnType<typeof _parseUrlInfo>;
export declare function _buildURLByParseUrlInfo(input: Partial<IReturnTypeParseUrlInfo>, baseURL?: string): string;
