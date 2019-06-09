import { IPropertyKey } from 'reflect-metadata-util';
import { TransformRequest } from './config/index';
import LazyURLSearchParams from 'http-form-urlencoded';
import { Headers } from './headers';

export function TransformFormUrlencoded(target: any, propertyName?: IPropertyKey)
{
	return TransformRequest((data, headers) =>
	{
		if (data && !Array.isArray(data) && typeof data === 'object')
		{
			let u = new LazyURLSearchParams();

			u.extend(data)

			return u.toString()
		}

		return data;
	})(target, propertyName)
}

export function FormUrlencoded(target: any, propertyName?: IPropertyKey)
{
	Headers({
		'content-type': 'application/x-www-form-urlencoded',
	})(target, propertyName);

	TransformFormUrlencoded(target, propertyName);
}

export default FormUrlencoded
