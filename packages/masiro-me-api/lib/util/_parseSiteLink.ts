import { _parseUrlInfo } from './_parseUrlInfo';

/**
 * @deprecated
 */
export function _parseSiteLink(chapter_link: string): {
	novel_id?: string,
	chapter_id?: string,
}
{
	let _m = _parseUrlInfo(chapter_link)

	if (_m.novel_id || _m.chapter_id)
	{
		return _m;
	}
}
