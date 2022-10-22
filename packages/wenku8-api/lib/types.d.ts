/**
 * Created by user on 2019/11/24.
 */
export interface IWenku8RecentUpdate {
    page: number;
    end: number;
    last_update_time: number;
    data: IWenku8RecentUpdateRow[];
}
export type IArticleToplistSortType = 'lastupdate' | 'postdate' | 'anime' | 'allvisit';
export type IArticleSearchType = 'articlename' | 'author';
export interface IWenku8RecentUpdateWithSortType extends IWenku8RecentUpdate {
    sort: IArticleToplistSortType;
}
export interface IWenku8RecentUpdateCache extends Omit<IWenku8RecentUpdate, 'page'> {
    from: number;
    to: number;
    size: number;
}
export interface IWenku8RecentUpdateRow extends IWenku8BookInfoMini {
    /**
     * 出版商
     */
    publisher: string;
    status: string;
    cover: string;
    last_update_time: number;
    last_update_chapter_name?: string;
}
export interface IWenku8RecentUpdateRowBook extends IWenku8RecentUpdateRow {
    desc: string;
    /**
     * 因版权问题xxxx
     */
    copyright_remove?: boolean;
    tags?: string[];
}
export interface IWenku8BookInfoMini {
    id: string;
    cid: string;
    name: string;
    authors: string;
}
export interface IWenku8BookChapters extends IWenku8BookInfoMini {
    chapters: IWenku8BookChaptersVol[];
}
export interface IWenku8BookChaptersVol {
    volume_order: number;
    volume_name: string;
    chapters: IWenku8BookChaptersVolChapter[];
}
export interface IWenku8RecentUpdateRowBookWithChapters extends IWenku8RecentUpdateRowBook, Pick<IWenku8BookChapters, 'chapters'> {
}
export interface IWenku8BookChaptersVolChapter {
    novel_id: string;
    cid: string;
    "chapter_id": string;
    "chapter_name": string;
    "chapter_order": number;
}
export interface IWenku8SearchList extends IWenku8RecentUpdate {
    searchtype: IArticleSearchType;
    searchkey: string;
}
export type IParametersSlice<T extends (...args: any) => any> = T extends (arg1: any, ...args: infer P) => any ? P : never;
