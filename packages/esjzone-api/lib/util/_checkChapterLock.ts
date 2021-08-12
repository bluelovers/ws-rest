import { _getChapterDomContent } from './_getChapterDomContent';
import { _formData } from './_formData';

export function _checkChapterLock($: JQueryStatic)
{
	let $content = _getChapterDomContent($);

	let pw: JQuery<HTMLInputElement> = $content.find('#pw') as any;

	return {
		locked: pw.length > 0,
		input: pw,
		form: _formData($),
	}
}
