/**
 * Created by user on 2019/6/8.
 */

import { getMemberMetadata, getMetadataLazy, getPrototypeOfConstructor, getPrototypeOfMetadata, hasMemberMetadata, hasPrototypeOfMetadata, setMemberMetadata, setPrototypeOfMetadata, IPropertyKey } from '..';
import { getMetadataPropertyFirst,  getMetadataTopFirst } from '../index';


@Reflect.metadata('kkkk', 1111)
class C1
{
	constructor()
	{
		show(`constructor`, this, `constructor`);
	}

	@LOG
	@Reflect.metadata('kkkk', 2222)
	m1()
	{
		show(`m1`, this, `m1`);
	}
}

function LOG(target: any, propertyName: IPropertyKey, descriptor: TypedPropertyDescriptor<any>)
{
	const old = descriptor.value;

	show(`decorators target`, target, `m1`);
}

show(`C1`, C1, `m1`);

(new C1).m1();

function show(label: string, target: any, key: string)
{
	console.log(label);

	console.log(1, getMemberMetadata('kkkk', target));
	console.log(2, getPrototypeOfMetadata('kkkk', target));

	console.log(3, getMemberMetadata('kkkk', target, key));
	console.log(4, getPrototypeOfMetadata('kkkk', target, key));



	console.log(5, getMetadataLazy('kkkk', target));
	console.log(6, getMetadataLazy('kkkk', target, key));

	console.log(7, getMetadataTopFirst('kkkk', target));
	console.log(8, getMetadataTopFirst('kkkk', target, key));


	console.log(9, getMetadataPropertyFirst('kkkk', target, key));

	console.log(`---------------`);
}
