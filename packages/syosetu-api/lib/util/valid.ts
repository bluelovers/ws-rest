/**
 * Created by user on 2020/4/9.
 */

export function validNcode(ncode: string)
{
	return /^(n[\w]{5,6})$/.test(ncode)
}

