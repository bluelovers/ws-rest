/**
 * Created by user on 2020/3/2.
 */
import Bluebird from 'bluebird';
import { IFetchParams } from '../sites/types';
export default function fetchFileAll(force?: boolean, opts?: IFetchParams): Bluebird<{
    demonovel: import("@node-novel/cache-loader").INovelStatCache;
    dmzj: Record<string, import("dmzj-api/lib/types").IDmzjNovelInfoWithChapters>;
    esjzone: Record<string, import("esjzone-api/lib/types").IESJzoneRecentUpdateRowBook>;
    masiro: Record<string, import("discuz-api/lib/types").IDiscuzForumPickThreads>;
    wenku8: Record<string, import("wenku8-api/lib/types").IWenku8RecentUpdateRowBookWithChapters>;
}>;
