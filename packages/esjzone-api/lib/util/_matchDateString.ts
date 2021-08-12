export function _matchDateString(_text: string)
{
	return _text.match(/\b(\d{4}\-\d{1,2}\-\d{1,2}\s+\d{1,2}:\d{1,2}:\d{1,2})\b/) || _text.match(/\b(\d{4}\-\d{1,2}\-\d{1,2})\b/)
}
