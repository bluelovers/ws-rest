import { ITestData } from '../fixtures/data';
import { expect } from 'vitest';
import { expandRfc6570 } from '../../parser';
import { rfc6570ToRouter, routerToRfc6570 } from '../../index';

export function _testExpandRfc6570(actualRfc6570: string,
	rfc6570: string,
	testData: ITestData,
)
{
	expect(actualRfc6570).toStrictEqual(rfc6570);

	let actualExpanded = expandRfc6570(rfc6570, testData.data ?? {});
	expect(actualExpanded).toMatchSnapshot({
		...(testData.expectedRfc6570 ? {
			router: testData.expectedRfc6570,
		} : {}),
		...(testData.expectedExpandedUrl ? {
			url: testData.expectedExpandedUrl,
		} : {}),
	});
}

function _routerToRfc6570ToRouter(sourceRouter: string)
{
	return rfc6570ToRouter(routerToRfc6570(sourceRouter));
}

export function _rfc6570ToRouterToRfc6570(sourceRfc6570: string, opts?: { ignoreUnSupport?: boolean })
{
	return routerToRfc6570(rfc6570ToRouter(sourceRfc6570, opts));
}

export function _reProcessCheckRfc6570(actualRfc6570: string, sourceRouter: string, expectedRfc6570: string, opts?: { ignoreUnSupport?: boolean })
{
	expect({
		actualRfc6570,
		sourceRouter,
		expectedRfc6570,
	}).toMatchSnapshot({
		actualRfc6570: expectedRfc6570,
	});

	let result = rfc6570ToRouter(actualRfc6570, opts);
	expect(result).toStrictEqual(sourceRouter);

	result = routerToRfc6570(result);
	expect(result).toStrictEqual(expectedRfc6570);

	result = rfc6570ToRouter(result, opts);
	expect(result).toStrictEqual(sourceRouter);
}

function _reProcessCheckRouter(actualRouter: string, sourceRfc6570: string, expectedRouter: string)
{
	expect({
		actualRouter,
		sourceRfc6570,
		expectedRouter,
	}).toMatchSnapshot({
		actualRouter: expectedRouter,
	});

	let result = routerToRfc6570(actualRouter);
	expect(result).toStrictEqual(sourceRfc6570);

	result = rfc6570ToRouter(result);
	expect(result).toStrictEqual(expectedRouter);

	result = routerToRfc6570(result);
	expect(result).toStrictEqual(sourceRfc6570);
}
