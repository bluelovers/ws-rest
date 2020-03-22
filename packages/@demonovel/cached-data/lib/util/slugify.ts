import { slugify } from 'cjk-conv/lib/zh/table/list';
import removeZeroWidth from 'zero-width/lib';
import { toHalfWidth } from 'str-util';

export function slugifyNovel3(title: string)
{
	return removeZeroWidth(toHalfWidth(title))
		.toLocaleLowerCase()
		;
}

export function slugifyNovel2(title: string)
{
	return slugify(slugifyNovel3(title), true);
}

export function slugifyNovel(title: string)
{
	title = slugifyNovel3(title);

	title = [
		/\s+/g,
		/[’'"]+/g,
		/[\\\/\[\]{}()~「」【】、,…・。―〈〉『』—《》（），﹑／＼]+/g,
		/[<>]+/g,
		/[#.?!+·-•]+/g,
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
