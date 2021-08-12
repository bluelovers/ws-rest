import { INovelStarRecentUpdateOptions, INumberValue, IWordsObject } from '../types';
export declare function _queryWords(min: INumberValue | INovelStarRecentUpdateOptions["words"], max?: INumberValue): string;
export declare function _parseWords(words: string): IWordsObject;
