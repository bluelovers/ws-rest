/**
 * Created by user on 2019/6/9.
 */
import { ITSArrayListMaybeReadonly, ITSValueOrArray } from 'ts-type';

const SymTransform = Symbol('transform');
const SymOptions = Symbol('options');

export interface IOptions
{
	/**
	 * '&k=&v=1' => '&k&v=1'
	 * only work for create new
	 */
	emptyValueToKeyOnly?: boolean,
	/**
	 * transform value to x-www-form-urlencoded
	 */
	transform?: boolean,

	allowNull?: boolean,
}

export type IURLSearchParamsInit = any[][] | [any, any][] | Record<string, any> | string | URLSearchParams;

export class LazyURLSearchParams extends URLSearchParams implements URLSearchParams
{
	[SymOptions]: IOptions;
	[SymTransform](value: any, options?: IOptions)
	{
		options = options || this[SymOptions];

		return transformValue(value, options);
	}

	constructor(init?: IURLSearchParamsInit, options?: IOptions)
	{
		if (!options)
		{
			if (init instanceof LazyURLSearchParams)
			{
				options = Object.assign({}, init[SymOptions]);
			}
			else
			{
				options = {};
			}
		}

		if (options.transform == null)
		{
			options.transform = true;
		}

		super(_core(init, options));

		this[SymOptions] = options;
	}

	/**
	 * all null value will transform to ''
	 */
	append(name: string, value: string | any, options?: IOptions)
	{
		options = options || this[SymOptions];

		if (options.transform)
		{
			value = this[SymTransform](value, options)
		}

		super.append(name, value as any)
	}

	/**
	 * all null value will transform to ''
	 */
	set(name: string, value: string | any, options?: IOptions)
	{
		options = options || this[SymOptions];

		if (options.transform)
		{
			value = this[SymTransform](value, options)
		}

		super.set(name, value as any)
	}

	/**
	 * append
	 */
	push(...values: ITSArrayListMaybeReadonly<unknown>[])
	{
		values.forEach(([k, v]) => this.append(k as string, v));
	}

	/**
	 * set
	 */
	extend(values: Record<any, any>, options?: IOptions)
	{
		Object.entries(values).forEach(([k, v]) => this.set(k as string, v, options));
	}

	clone<T extends URLSearchParams = LazyURLSearchParams>(): T
	{
		return new LazyURLSearchParams(this) as any
	}

	toString()
	{
		return super.toString();
	}

}

export function _core(init?: IURLSearchParamsInit, options?: IOptions)
{
	options = options || {};

	//console.dir(options);

	if (typeof init != 'string' && options.transform && !(init instanceof URLSearchParams) && init)
	{
		const { emptyValueToKeyOnly } = options;

		if (!Array.isArray(init))
		{
			init = Object.entries(init)
		}

		let arr = (init as [string, unknown][]).reduce((arr, [key, value]) => {

			if (value == null || emptyValueToKeyOnly && value === '')
			{
				arr.push(transformKey(key));
			}
			else
			{
				let u = new URLSearchParams();
				u.append(key, transformValue(value, options));
				arr.push(u.toString());
			}

			return arr;
		}, [] as string[])

		init = arr.join('&');
	}
	else if (init == null)
	{
		init = void 0;
	}

	//console.dir(init);

	return init;
}

export function transformKey(value: string)
{
	return encodeURIComponent(value)
}

export function transformValue(value: any, options?: IOptions)
{
	if (value == null)
	{
		if (options && options.allowNull)
		{
			return value
		}

		return '';
	}
	else if (typeof value === 'object')
	{
		return JSON.stringify(value)
	}

	return value.toString();
}

export default LazyURLSearchParams
