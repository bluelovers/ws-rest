import { IArrayCachedJSONRow } from '../../../types';
import { outputJSON } from 'fs-extra';
import { join } from "path";
import { __rootCache } from '../../__root';
import Bluebird from 'bluebird';
import { createMomentByMilliseconds as createMoment } from '../../util/moment';

export function buildCachedByDate(list: IArrayCachedJSONRow)
{
	let recordDays: {
		[Date: number]: string[],
	} = {};

	let recordWeeks: {
		[Date: number]: string[],
	} = {};

	let recordMonths: {
		[Date: number]: string[],
	} = {};

	let recordUndefined: {
		[Date: number]: string[],
	} = {};

	let len = {
		days: 0,
		weeks: 0,
		months: 0,
	}

	let max = {
		days: 30,
		weeks: 7,
		months: 0,
	}

	list
		.forEach(item => {

			let { updated = 0, uuid } = item;

			if (updated)
			{
				let m = createMoment(updated);

				let ud = m.clone()
					.startOf('day')
					//.unix()
					.valueOf()
				;

				let uw = m.clone()
					.startOf('week')
					//.unix()
					.valueOf()
				;

				let um = m.clone()
					.startOf('month')
					//.unix()
					.valueOf()
				;

				if (len.days <= max.days && !(ud in recordDays))
				{
					len.days++;
					console.log(`recordDays`.padEnd(13, ' '), String(len.days).padStart(3, ' '), ud, createMoment(ud).format());
				}
				if (len.weeks <= max.weeks && !(uw in recordWeeks))
				{
					len.weeks++;
					console.log(`recordWeeks`.padEnd(13, ' '), String(len.weeks).padStart(3, ' '), uw, createMoment(uw).format());
				}

				if (len.days <= max.days)
				{
					recordDays[ud] = recordDays[ud] || [];
					recordDays[ud].push(uuid)
				}

				if (len.weeks <= max.weeks)
				{
					recordWeeks[uw] = recordWeeks[uw] || [];
					recordWeeks[uw].push(uuid)
				}

				if (!(um in recordMonths))
				{
					len.months++;
					console.log(`recordMonths`.padEnd(13, ' '), String(len.months).padStart(3, ' '), um, createMoment(um).format());
				}

				recordMonths[um] = recordMonths[um] || [];
				recordMonths[um].push(uuid)
			}
			else
			{
				recordUndefined[0] = recordUndefined[0] || [];
				recordUndefined[0].push(uuid)
			}

		})
	;

	return Bluebird.all([
		outputJSON(join(__rootCache, 'preset', `date_days.json`), recordDays, {
			spaces: 2,
		}),
		outputJSON(join(__rootCache, 'preset', `date_weeks.json`), recordWeeks, {
			spaces: 2,
		}),
		outputJSON(join(__rootCache, 'preset', `date_months.json`), recordMonths, {
			spaces: 2,
		}),
		outputJSON(join(__rootCache, 'preset', `date_undefined.json`), recordUndefined, {
			spaces: 2,
		}),
	])
}

export default buildCachedByDate
