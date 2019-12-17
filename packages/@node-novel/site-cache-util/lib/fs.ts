import { WriteOptions as IJSONWriteOptions, outputJSON } from 'fs-extra';
import Bluebird from 'bluebird';

export const outputJSONOptions: IJSONWriteOptions = {
	spaces: 2,
};

export function outputJSONLazy(file: string, data: any, options?: IJSONWriteOptions)
{
	if (!options)
	{
		options = outputJSONOptions
	}

	return Bluebird.resolve(outputJSON(file, data, options));
}
