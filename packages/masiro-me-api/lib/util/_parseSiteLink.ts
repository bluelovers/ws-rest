export function _parseSiteLink(chapter_link: string): {
	novel_id?: string,
	chapter_id?: string,
}
{
	let novel_id: string;
	let chapter_id: string;

	let _m = chapter_link
		.match(/novelReading\?cid=(\d+)/)
	;

	if (_m)
	{
		chapter_id = _m[1];

		return {
			chapter_id,
		}
	}

	_m = chapter_link
		.match(/novelView\?novel_id=(\d+)/)
	;

	if (_m)
	{
		novel_id = _m[1];

		return {
			novel_id,
		}
	}
}
