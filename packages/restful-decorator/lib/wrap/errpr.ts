/**
 * Created by user on 2019/6/11.
 */
import { AxiosError } from 'axios';

export function mergeAxiosErrorWithResponseData<E extends AxiosError>(e: E)
{
	if (e.response && e.response.data)
	{
		e.message += ' ' + JSON.stringify(e.response.data);
	}

	return e
}
