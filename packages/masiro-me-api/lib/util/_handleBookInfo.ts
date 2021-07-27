import { IMasiroMeBook, IMasiroMeBookMini, IMasiroMeBookWithChapters } from '../types';
import { trimUnsafe } from './trim';
import { isBookWithChapters } from './asserts';
import { typePredicates } from 'ts-type-predicates';

export function _handleBookInfo<T extends IMasiroMeBook | IMasiroMeBookMini>(book: T)
{
	typePredicates<IMasiroMeBookWithChapters>(book);

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
			if (value === null || (typeof value === 'string' || Array.isArray(value)) && !value.length)
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

	if (isBookWithChapters(book))
	{
		let timestamp = 0;
		let chapters_num = 0;

		if (book.chapters.length)
		{

			book.chapters.forEach((vol) =>
			{
				vol.chapters.forEach((ch) =>
				{

					timestamp = Math.max(ch.chapter_updated, timestamp)

					chapters_num++;

				})
			});

		}

		if (!book.updated && timestamp)
		{
			book.updated = timestamp
		}

		book.chapters_num = chapters_num;
	}

	return book;
}
