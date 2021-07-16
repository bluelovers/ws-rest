export function _checkLogin($: JQueryStatic): string
{
	let username = $('.main-header .user .dropdown-toggle span:eq(0)')
		.text()
		.replace(/^\s+|\s+$/g, '')
	;

	if (username?.length)
	{
		return username
	}
}

