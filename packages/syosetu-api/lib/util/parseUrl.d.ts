import { LazyURL } from 'lazy-url';
export declare function parseUrlInfo<T extends string | number | URL | LazyURL>(input: T): {
    novel_r18: boolean;
    novel_id: string;
    chapter_id: string;
};
export declare function buildLink(data: {
    novel_r18?: boolean;
    novel_id: string;
    chapter_id?: string;
    protocol?: string;
}): `${string}//novel18.syosetu.com/${string}/${string}` | `${string}//ncode.syosetu.com/${string}/${string}`;
export declare function buildUrl(data: {
    novel_r18?: boolean;
    novel_id: string;
    chapter_id?: string;
    protocol?: string;
}): LazyURL;
