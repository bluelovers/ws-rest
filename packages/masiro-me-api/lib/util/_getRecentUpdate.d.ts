/// <reference types="jquery" />
import { IMasiroMeRecentUpdate, IRawMasiroMeLoadMoreNovels } from '../types';
export declare function _getRecentUpdate($: JQueryStatic, json: Pick<IRawMasiroMeLoadMoreNovels, 'page' | 'pages' | 'total'>, baseURL?: string): IMasiroMeRecentUpdate;
