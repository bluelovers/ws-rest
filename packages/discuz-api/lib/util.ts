/**
 * Created by user on 2019/11/21.
 */

// @ts-ignore
import { removeZeroWidth } from 'zero-width';
import { crlf } from 'crlf-normalize';

export { removeZeroWidth }

export function trimUnsafe<T extends string>(input: T): T
{
	// @ts-ignore
	return removeZeroWidth(crlf(input))
		.replace(/^\s+|\s+$/gu, '')
		.replace(/[\u00A0]/gu, ' ')
		.replace(/[\t ]+/gu, ' ')
		.trim()
}

