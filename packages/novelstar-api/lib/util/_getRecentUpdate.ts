import { INovelStarBookMini, INovelStarRecentUpdate, INovelStarRecentUpdateOptionsRaw, IWordsObject } from '../types';
import { _parseUrlInfo } from './_parseUrlInfo';

export function _getRecentUpdate($: JQueryStatic, page: number, baseURL: string, extra: INovelStarRecentUpdateOptionsRaw)
{
	let range: IWordsObject = {};

	$('.container .page-m li:not(.arrr) a')
		.each((i, elem) => {
			let _a = $(elem);

			let p = parseInt(_a.text());

			if (_a.is('active'))
			{
				page = p;
			}

			range.min = Math.min(range.min ?? p, p);
			range.max = Math.max(range.max ?? p, p);

		})
	;

	let list: INovelStarBookMini[] = [];

	$('section .container .pd-list .item')
		.each((i, elem) => {
			let _this = $(elem);

			let _src = _this.find('.img-wrap .cover-true .pd-default-img img').prop('src');

			let cover: string;

			if (_src?.length && !/\.jpg$/.test(_src))
			{
				cover = _src;
			}

			let _a = _this.find('.pd-tt a[href*="books"]');

			let title = _a.text();

			let _m = _parseUrlInfo(_a.prop('href'));

			let content = _this.find('.pd-desc').text();

			let last_update_name = _this.find('.pd-latest-update a').text();

			let novel_r18 = _this.find('.pd-tt .pd-tag .restrict18').length > 0;

			list.push({
				id: _m.novel_id,
				title,
				novel_r18,
				cover,
				last_update_name,
				content,
			})

		})
	;

	return <INovelStarRecentUpdate>{
		page,
		extra,
		range: {
			...range,
		},
		list,
	}
}
