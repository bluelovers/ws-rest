import { IMasiroMeBookMini, IMasiroMeRecentUpdate, IRawMasiroMeLoadMoreNovels } from '../types';
import { trimUnsafe } from './trim';
import { _parseSiteLink } from './_parseSiteLink';
import { zhRegExp } from 'regexp-cjk';
import { _handleBookInfo } from './_handleBookInfo';
import { _getImgSrc } from './_getImgSrc';

export function _getRecentUpdate($: JQueryStatic, json: Pick<IRawMasiroMeLoadMoreNovels, 'page' | 'pages' | 'total'>, baseURL?: string)
{
	let data: IMasiroMeRecentUpdate = {
		page: parseInt(json.page),
		pages: json.pages,
		total: json.total,

		list: [] as IMasiroMeBookMini[],
	};

	$('.layui-card').each((i, elem) =>
	{
		let _this = $(elem);

		let title = trimUnsafe(_this.find('.layui-card-header').text());

		let _a = _this.find('a:has(.layui-card-header)');
		let novel_link = _a.prop('href');

		let _m = _parseSiteLink(novel_link);

		let _n_info = _this.find('.n-info');

		let authors: string[] = [];
		let _author = trimUnsafe(_n_info.find('.author').text().replace(new zhRegExp(/^\s*作者(?:：|:)\s*/), ''));

		if (_author.length)
		{
			authors.push(_author)
		}

		let translator: string[] = [];

		_n_info.find('.translators .ts').each((i, elem) =>
		{
			let s = trimUnsafe($(elem).text())

			if (s.length)
			{
				translator.push(s)
			}
		})

		let tags: string[] = [];

		_n_info.find('.tag')
			.each((index, elem) =>
			{
				let s = trimUnsafe($(elem).text())

				if (s.length)
				{
					tags.push(s)
				}
			})
		;

		let _img = _this.find('img.n-img');
		let cover = _getImgSrc(_img, baseURL);

		let last_update_name = trimUnsafe(_this.find('.new_up').text().replace(new zhRegExp(/^\s*最新(?:：|:)\s*/), ''));

		data.list.push(_handleBookInfo({
			id: _m.novel_id,
			title,
			cover,
			authors,
			translator,
			tags,
			last_update_name,
		}))

	})

	return data
}
