import LazyURL from 'lazy-url';

export type IUrlLike = string | URL | LazyURL;

export function urlNormalize2(input: IUrlLike)
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

	//return new LazyURL(input).toRealString();
	return input.toString();
}

export default urlNormalize;
