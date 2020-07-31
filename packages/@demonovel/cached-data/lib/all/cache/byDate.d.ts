import { IArrayCachedJSONRow } from '../../../types';
import Bluebird from 'bluebird';
export declare function buildCachedByDate(list: IArrayCachedJSONRow): Bluebird<[void, void, void, void]>;
export default buildCachedByDate;
