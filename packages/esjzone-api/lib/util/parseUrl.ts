import { LazyURL } from 'lazy-url';
import { _handleInputUrl } from '@node-novel/parse-input-url';

export function parseUrl<T extends string | number | URL | LazyURL>(input: T)
{
	let data = _handleInputUrl(input);

	let ret = {
		...data,
	};

	switch (data.type)
	{

	}

	return ret;
}
