
export function _checkLogin($: JQueryStatic): string
{
	let username = $('.member-info:eq(0) a.head-account-btn[href*="member/home"]')
		.text()
		.replace(/^\s+|\s+$/g, '')
	;

	if (username?.length)
	{
		return username
	}

	return null
}
