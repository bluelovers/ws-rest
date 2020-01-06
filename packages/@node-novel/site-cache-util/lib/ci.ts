/**
 * Created by user on 2020/1/6.
 */

export function isCi()
{
	return process.env.COMPUTERNAME === 'USER-2019'
}

export default isCi
