/**
 * Created by user on 2019/6/8.
 */

import _merge from 'lodash/merge';

export function mergeClone<T>(defaults?: T, ...opts: T[])
{
	return merge({}, defaults, ...opts);
}

export function merge<T>(defaults?: T, ...opts: T[])
{
	return _merge(defaults, ...opts);
}

export default merge;
