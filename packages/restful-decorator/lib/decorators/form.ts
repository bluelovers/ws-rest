import { IPropertyKey } from 'reflect-metadata-util';
import { TransformRequest } from './config/index';
import LazyURLSearchParams from 'http-form-urlencoded';
import { Headers } from './headers';
import { checkMemberDecoratorsOnly } from '../helper/decorators';

/**
 * 請將此 decorators 放在其他 TransformRequest 之前
 */
export function TransformFormUrlencoded(target: any, propertyName: IPropertyKey)
{
	checkMemberDecoratorsOnly(`TransformFormUrlencoded`, target, propertyName);

	return TransformRequest((data, headers) =>
	{
		if (data && !Array.isArray(data) && typeof data === 'object')
		{
			let u = new LazyURLSearchParams();

			u.extend(data);

			return u.toString()
		}

		return data;
	})(target, propertyName)
}

/**
 * 請將此 decorators 放在其他 TransformRequest 之前
 */
export function FormUrlencoded(target: any, propertyName: IPropertyKey)
{
	checkMemberDecoratorsOnly(`FormUrlencoded`, target, propertyName);

	Headers({
		'Content-Type': 'application/x-www-form-urlencoded',
	})(target, propertyName);

	TransformFormUrlencoded(target, propertyName);
}

export default FormUrlencoded
