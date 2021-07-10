import zhRegExp from '../util/zhRegExp';
import slugifyNovel from '../util/slugify';

const r1 = new zhRegExp(/の|と/ug);

const reList02 = [
	{
		s: /(妹|哥|姐){2,}/ug,
		r: '$1',
	},
	{
		s: /公主|王女|姫/ug,
		r: '姫',
	},
	{
		s: /魔(?:術|法|導)/ug,
		r: '魔術',
	},
	{
		s: /屬性|狀態/ug,
		r: '屬性',
	},
	{
		s: /地下?城|迷宮|地下?牢|地洞|洞窟/ug,
		r: '迷宮',
	},
	{
		s: /(?:術|法|導)(?:师|士|使)/ug,
		r: '術师',
	},
	{
		s: /召唤(?:师|士)/ug,
		r: '召唤师',
	},
	{
		s: /暗杀者?|刺客|杀手/ug,
		r: '刺客',
	},
	{
		s: /哥不林|哥布林/ug,
		r: '哥不林',
	},
	{
		s: /適合|適任|合格|合適/ug,
		r: '適合',
	},
	{
		s: /千金|小姐|令娘|令孃/ug,
		r: '千金',
	},
	{
		s: /同級生?|同學/ug,
		r: '同學',
	},
	{
		s: /食尸鬼|喰种/ug,
		r: '食尸鬼',
	},
	{
		s: /猎人|遊俠/ug,
		r: '猎人',
	},
	{
		s: /学(?:园|院|校)|高校|教室/ug,
		r: '學院',
	},
	{
		s: /異世界/ug,
		r: '異界',
	},
	{
		s: /女主角?|女主?角/ug,
		r: '女主角',
	},
	{
		s: /妖精|精靈/ug,
		r: '妖精',
	},
	{
		s: /女神/ug,
		r: '神',
	},
	{
		s: /都市|城市|村莊?/ug,
		r: '都市',
	},
	{
		s: /乙女|美?少女|女性向|女孩子?|女子/ug,
		r: '少女',
	},
	{
		s: /社|部/ug,
		r: '部',
	},
	{
		s: /(?:萝|羅)莉|幼女/ug,
		r: '萝莉',
	},
	{
		s: /食堂|飯店|飯館|餐廳|餐館/ug,
		r: '食堂',
	},
	{
		s: /中二病?/ug,
		r: '中二',
	},
	{
		s: /円|原/ug,
		r: '元',
	},
	{
		s: /人外|怪物|魔物|怪獸/ug,
		r: '魔物',
	},
	{
		s: /(?:猪|豚)+/ug,
		r: '猪',
	},
	{
		s: /女(?:皇|帝)/ug,
		r: '女王',
	},
	{
		s: /戰略/ug,
		r: '攻略',
	},
	{
		s: /亡者|死人/ug,
		r: '死者',
	},
	{
		s: /殭屍/ug,
		r: '不死者',
	},

].map(data => {
	let { s, r } = data;

	s = new zhRegExp(data.s);

	if (!/^\$\d+$/.test(r))
	{
		r = slugifyNovel(r)
	}

	return {
		s,
		r,
	}
});

//console.dir(reList02)

export function doTitle(title: string, list: string[])
{
	let title_new = title.replace(r1, '')

	if (title_new.length && title !== title_new)
	{
		list.push(title_new);
		doTitle(title_new, list);
	}

	title_new = reList02
		.reduce((title_new, data) => {

			return title_new
				.replace(data.s, data.r)
			;
		}, title)
	;

	if (title_new.length && title !== title_new)
	{
		list.push(title_new);
		doTitle(title_new, list);
	}

	return title_new
}
