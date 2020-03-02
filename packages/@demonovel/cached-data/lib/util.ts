import { removeZeroWidth, nbspToSpace } from 'zero-width/lib';
import hashSum from 'hash-sum';
import { v5 as uuidv5 } from 'uuid';

export function trim(input: string)
{
	return removeZeroWidth(nbspToSpace(input))
		.replace(/^[\s　\u00A0]+|[\s　\u00A0]+$/g, '')
	;
}

export function newUUID(siteID: string, id: string): string
{
	let seed = siteID + '#' + id;
	//return hashSum(seed)
	return uuidv5(seed, uuidv5.URL)
}
