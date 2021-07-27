import { IMasiroMeBook, IMasiroMeBookMini, IMasiroMeBookWithChapters } from '../types';
import { typePredicates } from 'ts-type-predicates';
import sortObjectKeys from 'sort-object-keys2';

export function _sortBookFields<T extends IMasiroMeBook | IMasiroMeBookMini>(book: T)
{
	return sortObjectKeys(book, {
		keys: [
			'id',
			'title',
			'titles',
			'cover',
			'authors',
			'translator',
			'updated',
			'status',
			'status_text',
			'chapters_num',
			'last_update_name',
			'tags',
			'content',
			'chapters',
		] as (keyof IMasiroMeBookWithChapters)[],
		useSource: true,
	})
}
