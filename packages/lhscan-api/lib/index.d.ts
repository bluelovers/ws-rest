/// <reference types="node" />
import { AbstractHttpClient } from 'restful-decorator/lib';
import { IBluebird } from 'restful-decorator/lib/index';
import LazyURL from 'lazy-url';
import Bluebird from 'bluebird';
import { ISearchSingle, ISearchSingleDataRowPlus, IMangaData, IMangaReadData, IMangaListOptions, IMangaList } from './types';
import AbstractHttpClientWithJSDom from 'restful-decorator-plugin-jsdom/lib';
export declare class LHScanClient extends AbstractHttpClientWithJSDom {
    constructor(...argv: ConstructorParameters<typeof AbstractHttpClient>);
    _searchSingle(keyword: string): IBluebird<ISearchSingle[]>;
    createURL(url: string): LazyURL;
    searchSingle(keyword: string): Bluebird<{
        data: ISearchSingleDataRowPlus[];
        header: import("./types").ISearchSingleHeader;
    }[]>;
    protected _manga(id_key: string): Bluebird<IMangaData>;
    manga(id_key: string): Bluebird<IMangaData>;
    read(opts: {
        id_key: string;
        chapter_id: string | number;
    }): Bluebird<IMangaReadData>;
    fetchBuffer(url: string): Promise<Buffer>;
    mangaList(query?: IMangaListOptions): Bluebird<IMangaList>;
}
export default LHScanClient;
