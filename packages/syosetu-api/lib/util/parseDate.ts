import { moment } from '@node-novel/site-cache-util/lib/moment';

export function parseDateStringToMoment(dateString: string, format = 'YYYY-MM-DD hh:mm:ss')
{
	return moment.tz(dateString, format, 'Asia/Tokyo')
}
