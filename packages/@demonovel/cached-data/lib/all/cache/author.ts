import { IArrayCachedJSONRow, IPresetTitles } from '../../../types';
import slugifyNovel, { slugifyNovel2 } from '../../util/slugify';
import { doTitle } from '../util';
import { array_unique_overwrite } from 'array-hyper-unique';
import { zhDictCompare } from '@novel-segment/util';
import { outputJSON } from 'fs-extra';
import { join } from "path";
import { __rootCache } from '../../__root';
import { outputJSONWithIndent } from '../../util/fs';

export function buildCachedAuthors(list: IArrayCachedJSONRow)
{
	let authors = {} as Record<string, string[]>;

	list
		.forEach(item =>
		{
			item = {
				...item,
			}

			if (!item.authors || !item.authors.length)
			{
				item.authors = [''];
			}

			let author = item.authors[0];

			if (author == null)
			{
				author = '';
			}

			author = slugifyNovel2(author);

			let list: string[] = [
				author
			];

			item.authors
				.forEach(title =>
				{
					title = slugifyNovel(title);
					list.push(title);

					doTitle(title, list);
				})
			;

			array_unique_overwrite(list);

			let first: string[];

			for (let author of list)
			{
				if (author in authors)
				{
					first = authors[author];
					break;
				}
			}

			if (!first)
			{
				first = authors[author] || [];
			}

			list.forEach(author =>
			{
				if ((author in authors) && authors[author] !== first)
				{
					first.push(...authors[author]);
				}
				authors[author] = first;
			});

			first.push(item.uuid);
		})
	;

	Object.values(authors)
		.forEach(v => array_unique_overwrite(v).sort())
	;

	let out: IPresetTitles = Object.entries(authors);

	out = out.sort((a, b) =>
	{
		return zhDictCompare(a[0], b[0])
	})

	return outputJSONWithIndent<IPresetTitles>(join(__rootCache, 'preset', `authors.json`), out)
}

export default buildCachedAuthors
