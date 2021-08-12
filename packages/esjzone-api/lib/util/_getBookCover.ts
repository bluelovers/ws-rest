import { _fixCoverUrl } from './_fixCoverUrl';

export function _getBookCover($: JQueryStatic)
{
	let _cover: string;
	$('.container .product-gallery')
		.find(`.gallery-item img[src], a img[src]`)
		.toArray()
		.some((elem) =>
		{

			let cover = _fixCoverUrl($(elem).prop('src'))

			if (cover = _fixCoverUrl(cover))
			{
				return _cover = cover;
			}
		})
	;

	return _cover
}
