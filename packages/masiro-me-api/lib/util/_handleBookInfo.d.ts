import { IMasiroMeBook, IMasiroMeBookMini, IMasiroMeBookWithChapters } from '../types';
export declare function _handleBookInfo<T extends IMasiroMeBook | IMasiroMeBookMini>(book: T): T & IMasiroMeBookWithChapters;
