import zhRegExp from '../util/zhRegExp';
import slugifyNovel from '../util/slugify';

const r1 = new zhRegExp(/の|と/g);
const r2 = new zhRegExp(/(妹|哥){2,}/g);
const r3 = new zhRegExp(/公主|王女|姫/g);
const r4 = new zhRegExp(/魔(?:術|法|導)/g);
const r5 = new zhRegExp(/屬性|狀態/g);
const r6 = new zhRegExp(/地下?城|迷宮|地牢/g);
const r7 = new zhRegExp(/(?:術|法|導)(?:师|士)/g);
const r8 = new zhRegExp(/召唤(?:师|士)/g);
const r9 = new zhRegExp(/暗杀者?|刺客|杀手/g);
const r10 = new zhRegExp(/哥不林|哥布林/g);
const r11 = new zhRegExp(/適合|適任|合格/g);

const c3 = slugifyNovel('姫');
const c4 = slugifyNovel('魔術');
const c5 = slugifyNovel('屬性');
const c6 = slugifyNovel('迷宮');
const c7 = slugifyNovel('術师');
const c8 = slugifyNovel('召唤师');
const c9 = slugifyNovel('刺客');
const c10 = slugifyNovel('哥不林');
const c11 = slugifyNovel('適合');

export function doTitle(title: string, list: string[])
{
	let title_new = title.replace(r1, '')

	if (title_new.length && title !== title_new)
	{
		list.push(title_new);
		doTitle(title_new, list);
	}

	title_new = title
		.replace(r2, '$1')
		.replace(r3, c3)
		.replace(r4, c4)
		.replace(r5, c5)
		.replace(r6, c6)
		.replace(r7, c7)
		.replace(r8, c8)
		.replace(r9, c9)
		.replace(r10, c10)
		.replace(r11, c11)
	;

	if (title_new.length && title !== title_new)
	{
		list.push(title_new);
		doTitle(title_new, list);
	}

	return title_new
}
