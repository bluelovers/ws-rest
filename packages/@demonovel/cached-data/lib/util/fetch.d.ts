import Bluebird from 'bluebird';
export declare function fetchCache<T>(url: string, file: string): Bluebird<T>;
export default fetchCache;
