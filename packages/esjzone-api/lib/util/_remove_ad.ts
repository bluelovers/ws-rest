export function _remove_ad($: JQueryStatic)
{
	$('p[class]:has(> script), script[src*=google], > .adsbygoogle').remove();
}
