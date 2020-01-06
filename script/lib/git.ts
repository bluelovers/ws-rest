/**
 * Created by user on 2020/1/6.
 */

export function buildGitRemote(options: {
	user?: string,
	pass?: string,
	host: string,
	repo: string,
})
{
	let auth: string = '';

	if (options.user)
	{
		auth += options.user;

		if (options.pass)
		{
			auth += ':' + options.user;
		}

		auth += '@';
	}

	return `https://${auth}${options.host}/${options.repo}.git`;
}
