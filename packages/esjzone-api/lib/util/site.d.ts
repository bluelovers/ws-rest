/**
 * Created by user on 2019/12/19.
 */
/// <reference types="jquery" />
import { LazyURL } from 'lazy-url';
import { IESJzoneRecentUpdateRowBook, IESJzoneChapter } from '../types';
export declare function parseUrl<T extends string | number | URL | LazyURL>(input: T): {
    type: import("@node-novel/parse-input-url").EnumParseInputUrl.URL;
    _input: T & string;
    value: LazyURL;
} | {
    type: import("@node-novel/parse-input-url").EnumParseInputUrl.STRING;
    _input: T & string;
    value: string;
} | {
    type: import("@node-novel/parse-input-url").EnumParseInputUrl.URL;
    _input: T & URL;
    value: LazyURL;
} | {
    type: import("@node-novel/parse-input-url").EnumParseInputUrl.URLSEARCHPARAMS;
    _input: T & import("http-form-urlencoded").LazyURLSearchParams;
    value: T & import("http-form-urlencoded").LazyURLSearchParams;
} | {
    type: import("@node-novel/parse-input-url").EnumParseInputUrl.URLSEARCHPARAMS;
    _input: T & URLSearchParams;
    value: import("http-form-urlencoded").LazyURLSearchParams;
} | {
    type: import("@node-novel/parse-input-url").EnumParseInputUrl.NUMBER;
    _input: T;
    value: string;
} | {
    type: import("@node-novel/parse-input-url").EnumParseInputUrl.UNKNOWN;
    _input: T;
    value: string;
};
export declare function _fixCoverUrl(cover: string | URL): string;
export declare function _remove_ad($: JQueryStatic): void;
export declare function _getBookElemDesc($: JQueryStatic): JQuery<HTMLElement>;
export declare function _getBookCover($: JQueryStatic): string;
export declare function _getBookTags($: JQueryStatic, tags?: string[]): string[];
export declare function _parseSiteLink(chapter_link: string): {
    novel_id?: string;
    chapter_id?: string;
};
export declare function _getBookChapters($: JQueryStatic, _content: JQuery<HTMLElement>, data: Pick<IESJzoneRecentUpdateRowBook, 'chapters' | 'last_update_chapter_name'>): Pick<IESJzoneRecentUpdateRowBook, "chapters" | "last_update_chapter_name">;
export declare function _matchDateString(_text: string): RegExpMatchArray;
export declare function _getBookInfo($: JQueryStatic, data: Pick<IESJzoneRecentUpdateRowBook, 'name' | 'titles' | 'authors' | 'last_update_time'>): Pick<IESJzoneRecentUpdateRowBook, "name" | "last_update_time" | "authors" | "titles">;
export declare function _getBookLinks($: JQueryStatic, links?: IESJzoneRecentUpdateRowBook["links"]): import("../types").IESJzoneLinkExternal[];
export declare function _getChapterDomContent($: JQueryStatic): JQuery<HTMLElement>;
export declare function _getChapterData($: JQueryStatic): Pick<IESJzoneChapter, 'author' | 'dateline' | 'chapter_name'>;
