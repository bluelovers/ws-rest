import { INovelStatCache, IFilterNovelData } from '@node-novel/cache-loader';
export declare type ISitesKeys = 'demonovel';
export declare let url: string;
export declare const siteID: "demonovel";
export declare const file: string;
export interface ISitesSourcePack {
    demonovel: INovelStatCache;
}
export interface IFilterNovelDataPlus extends IFilterNovelData {
    title: string;
    authors: string[];
}
