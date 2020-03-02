import { INovelStatCache, createFromJSON, createMoment } from '@node-novel/cache-loader';
import Bluebird from 'bluebird';
import { siteID, IFilterNovelDataPlus } from './types';
import NodeNovelInfo from 'node-novel-info/class';
import dotValues2 from 'dot-values2/lib'
import { newUUID, trim } from '../util';
import { ICachedJSONRowPlus, IRecordCachedJSONRow } from '../types';

export function build(source: INovelStatCache)
{
	return Bluebird
		.resolve(source)
		.then(table => createFromJSON(table))
		.then(async (nc) =>
		{

			let novels = nc.filterNovel();

			let list = dotValues2.get(novels, `*.*`) as IFilterNovelDataPlus[];

			return list
				.map(novel =>
				{
					let id = novel.pathMain_base + '/' + novel.novelID;

					console.log(siteID, id);

					let info = NodeNovelInfo.create(novel.mdconf);

					let novelID = novel.novelID;

					let uuid = newUUID(siteID, id);

					let pathMain = novel.pathMain_base;

					let title = info.title();

					let content = dotValues2.get(novel, 'mdconf.novel.preface') as string;

					if (content)
					{
						content = trim(content)
					}
					else
					{
						content = void 0
					}

					let updated = novel.cache.epub_date || 0;

					if (updated)
					{
						updated = createMoment(updated).unix()
					}

					let item: ICachedJSONRowPlus = {
						siteID,
						pathMain,
						novelID,
						uuid,
						id,
						title,
						titles: info.titles(),
						cover: dotValues2.get(novel, 'mdconf.novel.cover') as string,
						authors: info.authors(),
						updated,
						//chapters_num,
						//last_update_name,
						tags: info.tags(),
						content,

						epub_basename: novel.cache.epub_basename,
						pathMain_real: novel.pathMain,
					};

					return item
				})
				.filter(Boolean)
				.sort((a, b) =>
				{
					let i = (b.updated - a.updated);

					if (b.updated > a.updated)
					{
						return 1
					}
					else if (b.updated < a.updated)
					{
						return -1
					}

					return 0
				})
				.reduce((a, item) =>
				{
					a[item.uuid] = item;
					return a;
				}, {} as IRecordCachedJSONRow)
				;
		})
	;
}

export default build
