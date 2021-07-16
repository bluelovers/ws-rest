import { trimUnsafe } from './trim';

export function _getBookTranslator($: JQueryStatic, translator: string[] = [])
{
	$('.n-detail .n-translator a')
		.each((index, elem) =>
		{

			let s = trimUnsafe($(elem).text())

			if (s.length)
			{
				translator ??= [];
				translator.push(s)
			}
		})
	;

	return translator
}
