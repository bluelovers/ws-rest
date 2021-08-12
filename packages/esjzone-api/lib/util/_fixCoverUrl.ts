import { LazyURL } from 'lazy-url';

export function _fixCoverUrl(cover: string | URL)
{
	if (!cover)
	{
		return;
	}

	let u = new LazyURL(cover);
	if (
		/esjzone/.test(u.host) && u.pathname.includes('empty.jpg')
		|| /pinimg/.test(u.host) && u.pathname.includes('861e5157abc25f92f6b49af0f1465927.jpg')
	)
	{
		return
	}

	return u.toRealString();
}
