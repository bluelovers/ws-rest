import { IArrayCachedJSONRow, IPresetTitles } from '../../../types';
import slugifyNovel from '../../util/slugify';
import { doTitle } from '../util';
import { array_unique_overwrite } from 'array-hyper-unique';
import { zhDictCompare } from '@novel-segment/util';
import { outputJSON } from 'fs-extra';
import { join } from "path";
import { __rootCache } from '../../__root';
import { outputJSONWithIndent } from '../../util/fs';

export function buildCachedTitle(list: IArrayCachedJSONRow)
{
	let titles = {} as Record<string, string[]>;

	list
		.forEach(item =>
		{

			let title = slugifyNovel(item.title);

			let list: string[] = [];

			list.push(title);

			doTitle(title, list);

			if (item.titles)
			{
				item.titles
					.forEach(title =>
					{
						title = slugifyNovel(title);
						list.push(title);

						doTitle(title, list);
					})
				;
			}

			array_unique_overwrite(list);

			let first: string[];

			for (let title of list)
			{
				if (title in titles)
				{
					first = titles[title];
					break;
				}
			}

			if (!first)
			{
				first = titles[title] || [];
			}

			list.forEach(title =>
			{
				if ((title in titles) && titles[title] !== first)
				{
					first.push(...titles[title]);
				}
				titles[title] = first;
			});

			first.push(item.uuid);
		})
	;

	Object.values(titles)
		.forEach(v => array_unique_overwrite(v).sort())
	;

	let out: IPresetTitles = Object.entries(titles);

	out = out.sort((a, b) =>
	{
		return zhDictCompare(a[0], b[0])
	})

	return outputJSONWithIndent<IPresetTitles>(join(__rootCache, 'preset', `titles.json`), out)
}

export default buildCachedTitle
