import { IMasiroMeBook, IMasiroMeBookMini, IMasiroMeBookWithChapters } from '../types';

export function isBookWithChapters<T extends IMasiroMeBook | IMasiroMeBookMini>(book: T): book is T & IMasiroMeBookWithChapters
{
	return Array.isArray((book as IMasiroMeBookWithChapters).chapters)
}
