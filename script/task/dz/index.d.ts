/**
 * Created by user on 2020/1/19.
 */
import Bluebird from 'bluebird';
export interface IMY_HASHED_JSON_ROW {
    baseURL: string;
    cookies: Record<string, string>;
    siteType?: string | 'discuz' | 'phpwind';
}
declare const _default: Bluebird<void>;
export default _default;
