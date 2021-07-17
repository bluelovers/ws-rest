/// <reference types="jquery" />
import { IMasiroMeRecentUpdate, IMasiroMeRecentUpdateOptions, IRawMasiroMeLoadMoreNovels } from '../types';
export declare function _getRecentUpdate($: JQueryStatic, json: Pick<IRawMasiroMeLoadMoreNovels, 'page' | 'pages' | 'total'>, baseURL: string, extra: IMasiroMeRecentUpdateOptions): IMasiroMeRecentUpdate;
