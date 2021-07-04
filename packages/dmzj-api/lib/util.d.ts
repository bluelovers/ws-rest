/**
 * Created by user on 2019/7/1.
 */
import { IDmzjNovelInfoWithChapters, IDmzjNovelInfo, IDmzjNovelInfoRecentUpdateRow } from './types';
import { removeZeroWidth } from 'zero-width';
export { removeZeroWidth };
export declare function buildVersion(): {
    channel: string;
    version: string;
};
/**
 * 修正 dmzj 小說標籤
 */
export declare function fixDmzjNovelTags(tags: string | string[]): string[];
/**
 * 修正 dmzj 上面一些錯誤的資料
 */
export declare function fixDmzjNovelInfo<T extends IDmzjNovelInfo | IDmzjNovelInfoWithChapters | IDmzjNovelInfoRecentUpdateRow>(data: T): T;
export declare function trimUnsafe<T extends string>(input: T): T;
export declare function isDmzjNovelInfoFull<T extends IDmzjNovelInfo | IDmzjNovelInfoWithChapters | IDmzjNovelInfoRecentUpdateRow>(data: T): data is Extract<IDmzjNovelInfo | IDmzjNovelInfoWithChapters, T>;
export declare function isDmzjNovelInfoFullWithChapters<T extends IDmzjNovelInfo | IDmzjNovelInfoWithChapters | IDmzjNovelInfoRecentUpdateRow>(data: T): data is Extract<IDmzjNovelInfoWithChapters, T>;
export declare function sortDmzjNovelInfoVolumes<T extends IDmzjNovelInfo["volume"] | IDmzjNovelInfoWithChapters["volume"]>(volumes: T): T;
export declare function sortDmzjNovelInfoChapters<T extends IDmzjNovelInfoWithChapters["chapters"]>(chapters: T): T;
export declare function sortDmzjNovelInfo<T extends IDmzjNovelInfo | IDmzjNovelInfoWithChapters | IDmzjNovelInfoRecentUpdateRow>(data: T): T;
