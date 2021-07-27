import { EnumNovelStatus } from "node-novel-info/lib/const";
export declare enum EnumSiteID {
    'dmzj' = "dmzj",
    'esjzone' = "esjzone",
    'demonovel' = "demonovel",
    'masiro' = "masiro",
    'wenku8' = "wenku8",
    'masiro_me' = "masiro_me"
}
export interface ICachedJSONRow {
    siteID: string | EnumSiteID;
    novelID: string;
    uuid: string;
    id: string;
    title: string;
    subtitle?: string;
    cover?: string;
    authors?: string[];
    updated: number;
    chapters_num?: number;
    last_update_name?: string;
    tags?: string[];
    content: string;
}
export interface ICachedJSONRowPlus extends ICachedJSONRow {
    pathMain: string;
    pathMain_real: string;
    titles: string[];
    epub_basename: string;
    illusts: string[];
    publishers: string[];
    status: EnumNovelStatus | number;
}
export interface IRecordCachedJSONRow extends Record<string, ICachedJSONRowPlus> {
}
