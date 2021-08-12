export function _parseSiteLink(chapter_link: string): {
	novel_id?: string,
	chapter_id?: string,
}
{
	let _m = chapter_link
		.match(/esjzone\.cc\/forum\/(\d+)\/(\d+)\.html?/)
	;

	let novel_id: string;
	let chapter_id: string;

	if (_m)
	{
		novel_id = _m[1];
		chapter_id = _m[2];

		return {
			novel_id,
			chapter_id,
		}
	}

	_m = chapter_link
		.match(/esjzone\.cc\/detail\/(\d+)/)
	;

	if (_m)
	{
		novel_id = _m[1];

		return {
			novel_id,
		}
	}
}
