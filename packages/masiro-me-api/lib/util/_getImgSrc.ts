
export function _getImgSrc(_img: JQuery<HTMLImageElement> | JQuery<HTMLElement>, baseURL?: string): string
{
	let src = _img.prop('lay-src') || _img.prop('src') || _img.attr('lay-src') || _img.attr('src');

	if (src?.length)
	{
		return _handleImgURL(new URL(src, baseURL)).href
	}
}

export function _handleImgURL(url: URL)
{
	if (url.hostname.includes('masiro'))
	{
		url.searchParams.delete('quality');
	}

	return url
}
