import AbstractHttpClientWithJSDom from 'restful-decorator-plugin-jsdom/lib/index';
import Bluebird from 'bluebird';
import { Cookie } from 'tough-cookie';
import { INovelStarRecentUpdate, INovelStarRecentUpdateAll, INovelStarRecentUpdateAllOptions, INovelStarRecentUpdateOptions, INovelStarRecentUpdateOptionsRaw } from './types';
export declare class NovelStarClient extends AbstractHttpClientWithJSDom {
    checkLogin(): Bluebird<string>;
    isLogin(): Bluebird<string>;
    _getAuthCookies(): Record<"mid", Cookie>;
    _recentUpdate(page?: number, extra?: INovelStarRecentUpdateOptionsRaw): Bluebird<INovelStarRecentUpdate>;
    recentUpdate(page?: number, extra?: INovelStarRecentUpdateOptions): Bluebird<INovelStarRecentUpdate>;
    recentUpdateAll(options?: INovelStarRecentUpdateAllOptions, extra?: INovelStarRecentUpdateOptions): Bluebird<INovelStarRecentUpdateAll>;
}
export default NovelStarClient;
