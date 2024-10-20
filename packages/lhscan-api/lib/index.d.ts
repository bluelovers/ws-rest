import { AbstractHttpClient } from 'restful-decorator/lib';
import { IBluebird } from 'restful-decorator/lib/index';
import LazyURL from 'lazy-url';
import Bluebird from 'bluebird';
import { ISearchSingle, ISearchSingleDataRowPlus, IMangaData, IMangaReadData, IMangaListOptions, IMangaList, IMangaDataMetaPop } from './types';
import AbstractHttpClientWithJSDom from 'restful-decorator-plugin-jsdom/lib';
export declare class LHScanClient extends AbstractHttpClientWithJSDom {
    constructor(...argv: ConstructorParameters<typeof AbstractHttpClient>);
    /**
     * @FIXME _iconvDecode 會錯誤解碼 導致無法分析日文
     */
    _iconvDecode(buf: Buffer): string;
    _searchSingle(keyword: string): IBluebird<ISearchSingle[]>;
    createURL(url: string): LazyURL;
    searchSingle(keyword: string): Bluebird<{
        data: ISearchSingleDataRowPlus[];
        header: import("./types").ISearchSingleHeader;
    }[]>;
    mangaMetaPop(id: string | number): Bluebird<IMangaDataMetaPop>;
    protected _manga(id_key: string): Bluebird<IMangaData>;
    manga(id_key: string): Bluebird<IMangaData>;
    read(opts: {
        id_key: string;
        chapter_id: string | number;
    }): Bluebird<IMangaReadData>;
    fetchBuffer(url: string): Promise<Buffer>;
    mangaList(query?: IMangaListOptions): Bluebird<IMangaList>;
    protected _mangaList(query?: IMangaListOptions): Bluebird<IMangaList>;
    author(author: string, query?: IMangaListOptions): Bluebird<IMangaList>;
    mangaListByGenre(tag: string | string[], query?: IMangaListOptions): Bluebird<IMangaList>;
    mangaListByStatusOnGoing(query?: IMangaListOptions): Bluebird<IMangaList>;
    mangaListByGroup(group: string, query?: IMangaListOptions): Bluebird<IMangaList>;
}
export default LHScanClient;
