import { IMasiroMeBook, IMasiroMeBookMini } from '../types';
import { trimUnsafe } from './trim';

export function _handleBookInfo<T extends IMasiroMeBook | IMasiroMeBookMini>(book: T)
{
	if (book.tags?.length)
	{
		book.tags = book.tags
			.filter(Boolean)
			.map(s => s.split('/').map(s => trimUnsafe(s)))
			.flat()
			.filter(Boolean)
	}

	Object.entries(book)
		.forEach(([key, value]) =>
		{
			if (value === null || (typeof value === 'string'|| Array.isArray(value)) && !value.length)
			{
				book[key as keyof T] = void 0;
			}
		})
	;

	if (book.cover?.length)
	{
		if (book.cover.includes('other-210706104151-kJQE.jpg'))
		{
			book.cover = void 0;
		}
	}
	else if (!book.cover?.length)
	{
		book.cover = void 0;
	}

	return book;
}
