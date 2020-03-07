import moment, { Moment } from 'moment-timezone';

export function _process<T extends Moment>(moment: T)
{
	return moment
		.utcOffset(8)
		;
}

export function createMomentByMilliseconds(milliseconds: number)
{
	return _process(moment(milliseconds));
}

export function createMomentBySeconds(unix: number)
{
	return _process(moment.unix(unix));
}
