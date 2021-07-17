import { trimUnsafe } from './trim';
import { IMasiroMeChapter } from '../types';

export function _getChapterData($: JQueryStatic)
{
	$('.translator-info').find('.smallThumb, :input, #smallThumb').remove();

	let info = trimUnsafe($('.translator-info').text());
	let memo = trimUnsafe($('.translator-memo').text());

	let data: Pick<IMasiroMeChapter, 'author' | 'dateline' | 'extra_info'>;

	if (info.length)
	{
		data ??= {};
		data.extra_info ??= {};
		data.extra_info.info = info;
	}

	if (memo.length)
	{
		data ??= {};
		data.extra_info ??= {};
		data.extra_info.memo = memo;
	}

	return data ?? null
}
