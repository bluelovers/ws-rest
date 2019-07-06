/**
 * Created by user on 2019/6/11.
 */
import { AxiosError } from 'axios';

export function mergeAxiosErrorWithResponseData<E extends AxiosError>(e: E, cb?: (data: unknown) => boolean)
{
	if (e.response && e.response.data)
	{
		if (!cb || cb(e.response.data))
		{
			e.message += ' ' + JSON.stringify(e.response.data);
		}
	}

	return e
}
