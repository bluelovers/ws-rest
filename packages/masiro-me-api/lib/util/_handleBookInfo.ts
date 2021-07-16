import { IMasiroMeBook } from '../types';

export function _handleBookInfo<T extends IMasiroMeBook>(book: T)
{
	Object.entries(book)
		.forEach(([key, value]) =>
		{
			if (Array.isArray(value) && !value.length)
			{
				book[key as keyof T] = void 0;
			}
		})
	;

	if (!book.content?.length)
	{
		book.content = void 0;
	}

	return book;
}
