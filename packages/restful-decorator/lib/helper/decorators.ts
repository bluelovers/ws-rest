/**
 * Created by user on 2019/6/11.
 */
import { IPropertyKey } from 'reflect-metadata-util';

export function checkMemberDecoratorsOnly(name: string, target: any, propertyName: IPropertyKey)
{
	if (!propertyName)
	{
		throw new ReferenceError(`@${name} current only support for member/method, wellcome send PR`)
	}
}
