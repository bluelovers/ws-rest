/**
 * Created by user on 2020/1/6.
 */

export function isCi()
{
	return process.env.COMPUTERNAME !== 'USER-2019'
}

export function skipCi()
{
	return `\n\n[skip ci]`;
}

export default isCi
