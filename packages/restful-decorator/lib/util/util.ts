/**
 * Created by user on 2019/6/9.
 */

export function includesKey<T, K extends (keyof T | string)[]>(target: T, keys: K): boolean
{
	return Object.keys(target)
		.some(k => keys.includes(k))
}
