/**
 * Created by user on 2019/8/24.
 */
export interface IGeaderWithData<H, D> {
    header: H;
    data: D[];
}
export interface ISearchSingle extends IGeaderWithData<ISearchSingleHeader, ISearchSingleDataRow> {
}
export interface ISearchSingleHeader {
    title: string;
    num: number;
    limit: number;
}
export interface ISearchSingleDataRow {
    primary: string;
    secondary: string;
    image: string;
    onclick: string;
}
export interface ISearchSingleDataRowPlus extends ISearchSingleDataRow {
    href: string;
    path: string;
    id_key: string;
}
export interface IMangaDataBase {
    id_key: string;
    title: string;
    last_chapter?: IMangaChapter;
}
export interface IMangaData extends IMangaDataBase {
    other_names: string;
    cover: string;
    authors: string[];
    tags: string[];
    magazine: string[];
    chapters: IMangaChapter[];
}
export interface IMangaChapter {
    id_key: string;
    chapter_id: string;
}
export interface IMangaReadData extends IMangaChapter {
    images: string[];
}
export type IMangaListOptionsSort = 'name' | 'views' | 'last_update';
export type IMangaListOptionsSortType = 'ASC' | 'DESC';
export declare enum EnumMangaListStatus {
    Complete = 1,
    OnGoing = 2,
    Pause = 3
}
export interface IMangaListOptions {
    listType?: 'pagination' | string;
    page?: string | number;
    artist?: string;
    author?: string;
    group?: string;
    m_status?: EnumMangaListStatus;
    name?: string;
    genre?: string;
    ungenre?: string;
    sort?: IMangaListOptionsSort;
    sort_type?: IMangaListOptionsSortType;
}
export interface IMangaListRow extends IMangaDataBase {
    id: string;
}
export interface IMangaList {
    page: number;
    page_max: number;
    query: IMangaListOptions;
    list: IMangaListRow[];
}
export interface IMangaDataMetaPop extends Pick<IMangaData, 'title' | 'other_names' | 'authors' | 'tags'>, Pick<IMangaListRow, 'id'> {
    last_update: number;
}
export interface IMangaListRowWithExtra extends IDataWithLastUpdate<IMangaListRow> {
    other_names?: string;
}
export type IDataWithLastUpdate<T extends Record<any, any>, U extends Record<any, any> = {}> = T & {
    last_update?: number;
} & U;
