import { slugify } from 'cjk-conv/lib/zh/table/list';
import removeZeroWidth from 'zero-width/lib';
import { toHalfWidth } from 'str-util';

export function slugifyNovel(title: string)
{
	title = removeZeroWidth(toHalfWidth(title));

	title = [
		/\s+/g,
		/[’'"]+/g,
		/[\\\/\[\]{}()~「」【】、,…・。―〈〉『』—《》（），﹑]+/g,
		/[<>]+/g,
		/[#.?!+·-]+/g,
		/[◆◇■□★▼＊☆◊§～*↣＝=═\-－─—　 ※…⋯◯○~∞&%]+/g,
		/[&=]+/g,
		/[×:@]+/g,
	].reduce((t1, re) =>
	{
		let t2 = t1.replace(re, '');

		if (t2.length)
		{
			return t2;
		}

		return t1
	}, title);

	return slugify(title, true)
}

export default slugifyNovel
