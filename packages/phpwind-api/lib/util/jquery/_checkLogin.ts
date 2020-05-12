/// <reference types="jquery" />

export function _checkLoginByJQuery($: JQueryStatic)
{
	return $('#user-login a[href^="u.php"], #user-login a[href*="action-quit-verify-"]')
		.length > 1
}

export function _checkLoginUsername($: JQueryStatic)
{
	if (_checkLoginByJQuery($))
	{
		let user = $('#user-login a[href^="u.php"]')
			.text()
			.replace(/^\s+|\s+$/g, '')
		;

		if (user.length)
		{
			return user
		}
	}

	return
}
