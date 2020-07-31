/// <reference types="bluebird" />
/**
 * Created by user on 2020/1/20.
 */
import DiscuzClient from 'discuz-api/lib';
import { IDiscuzForumPickThreads } from 'discuz-api/lib/types';
export declare function getThreadsByFid<API extends DiscuzClient>(api: API, threadOptions: {
    fid: string;
}, extraOptions: {
    cacheFileInfoPath: (id: string | number) => string;
}): import("bluebird")<IDiscuzForumPickThreads>;
export default getThreadsByFid;
