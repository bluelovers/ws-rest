import { trimUnsafe } from './trim';
import { _parseSiteLink } from './_parseSiteLink';
import { IMasiroMeBookWithChapters } from '../types';

export function _getBookChapters($: JQueryStatic)
{
	let volume_order = 0;
	let chapter_order = 0;

	const root: IMasiroMeBookWithChapters["chapters"] = [];

	root[volume_order] = {
		volume_name: null as null,
		volume_order,
		chapters: [],
	};

	$('.content .box-body .chapter-content .chapter-ul').find('.chapter-box, .episode-box')
		.each((i, elem) =>
		{
			let _this = $(elem);

			if (_this.is('.chapter-box'))
			{
				_this.find('.sign.minus').remove();

				let volume_name = trimUnsafe(_this.text());

				if (volume_name)
				{
					if (chapter_order || root[volume_order].volume_name != null)
					{
						volume_order++;
					}

					root[volume_order] = {
						volume_name,
						volume_order,
						chapters: [],
					};

					chapter_order = 0;
				}
			}
			else
			{
				let _a = _this.parent('a:eq(0)');

				let chapter_link = _a.prop('href');
				let _m = _parseSiteLink(chapter_link);

				let chapter_name = trimUnsafe(_a.find('span:eq(0)').text());

				if (!_m?.chapter_id)
				{
					throw new Error(`failed to parse ${chapter_link} ／ ${chapter_name}`)
				}

				root[volume_order]
					.chapters
					.push({
						chapter_id: _m.chapter_id,
						chapter_name,
						chapter_order,
					})
				;

				chapter_order++;
			}

		})
	;

	return root
}
