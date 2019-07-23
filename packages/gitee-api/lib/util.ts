// @ts-ignore
import isBase64 from 'is-base64';
import { IRepoInfo1, IRepoInfo2 } from './types';
import { ITSPickExtra, ITSValueOrArray, ITSOverwrite } from 'ts-type';

export function toBase64(content: string | Buffer): string
{
	if (typeof content !== 'string' || !isBase64(content))
	{
		// @ts-ignore
		return Buffer.from(content).toString('base64');
	}

	return content
}

export function isForkFrom<T extends IRepoInfo2 | IRepoInfo1>(repoData: T, target: {
	owner: string,
	repo: string,
})
{
	const { owner, repo } = target;
	const full_name = [owner, repo].join('/');

	let {parent} = repoData;
	while(parent)
	{
		if (parent.path === repo && parent.namespace.path === owner)
		{
			return true;
		}

		if (parent.full_name === full_name)
		{
			return true;
		}

		parent = parent.parent;
	}

	return false;
}

export function valueToArray<T>(input: unknown | ITSValueOrArray<T>): T[]
{
	return Array.isArray(input) ? input : [input];
}