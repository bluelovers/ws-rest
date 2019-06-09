/**
 * Created by user on 2019/6/7.
 */

import { ITSOverwrite } from 'ts-type';

export type IMethod<T = {}, P = {}> = {
	$parent?: IMethod<P>,
} & ITSOverwrite<Omit<P, '$parent'>, Omit<T, '$parent'>>;

export function subobject<T = {}, P = {}>(attr: T, parent?: IMethod<P> | null): IMethod<T, P>
{
	const current = Object.create(parent);

	return Object.assign(current, {
		...attr,
		$parent: parent
	});
}

export default subobject;
