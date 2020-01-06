
// @ts-ignore
export * from 'moment';
import { MomentInput } from 'moment';
import moment from 'moment-timezone';

moment.tz.setDefault("Asia/Taipei");

export { moment };

export function toMoment(inp?: MomentInput, ...argv: any[])
{
	return moment(inp, ...argv)
}

export function unixMoment(timestamp: number)
{
	return moment.unix(timestamp)
}

export default moment
