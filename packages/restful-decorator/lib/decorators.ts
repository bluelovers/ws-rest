import 'reflect-metadata';

export { CookieJarSupport } from './decorators/config/cookies';

export { RequestConfig, RequestConfigs, TransformRequest } from './decorators/config';

export {
	BodyData,
	BodyParams,
	HandleParamMetadata,
	ParamBody,
	ParamData,
	ParamHeader,
	ParamPath,
	ParamQuery,
} from './decorators/body';

export { methodBuilder } from './wrap/abstract';

export { TransformFormUrlencoded, FormUrlencoded } from './decorators/form';

export {
	GET,
	HEAD,
	POST,
	DELETE,
	PATCH,
	PUT,
} from './decorators/method';

export {
	BaseUrl,
} from './decorators/http';

export {
	Authorization,
	Headers,
} from './decorators/headers';
