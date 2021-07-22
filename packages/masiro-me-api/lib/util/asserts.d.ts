import { IMasiroMeBook, IMasiroMeBookMini, IMasiroMeBookWithChapters } from '../types';
export declare function isBookWithChapters<T extends IMasiroMeBook | IMasiroMeBookMini>(book: T): book is T & IMasiroMeBookWithChapters;
