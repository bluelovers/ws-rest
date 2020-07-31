/**
 * Created by user on 2019/8/30.
 */
import Axios from 'axios';
import extendAxios from '../lib';
import { setupCache } from 'axios-cache-adapter'
import { attach as RaxAttach, RetryConfig as IAxiosRetryConfig } from 'retry-axios';

RaxAttach(Axios);
	//.axios

extendAxios(Axios)
	.axios
	.get("http://v2.api.dmzj.com1/novel/2700.json")
	.then(r => console.dir(r))
;
