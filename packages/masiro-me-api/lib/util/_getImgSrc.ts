
export function _getImgSrc(_img: JQuery<HTMLImageElement> | JQuery<HTMLElement>, baseURL?: string): string
{
	let src = _img.prop('lay-src') || _img.prop('src') || _img.attr('lay-src') || _img.attr('src');

	return new URL(src, baseURL).href
}
