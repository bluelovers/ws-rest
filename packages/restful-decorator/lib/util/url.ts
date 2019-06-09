import LazyURL from 'lazy-url';

export type IUrlLike = string | URL | LazyURL;

export function urlNormalize(input: IUrlLike)
{
	if (input instanceof LazyURL)
	{
		return input.toRealString();
	}
	else if (input instanceof URL)
	{
		return input.toString();
	}

	return new LazyURL(input).toRealString();
}

export default urlNormalize;
