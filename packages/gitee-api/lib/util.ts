// @ts-ignore
import isBase64 from 'is-base64';

export function toBase64(content: string | Buffer): string
{
	if (typeof content !== 'string' || !isBase64(content))
	{
		// @ts-ignore
		return Buffer.from(content).toString('base64');
	}

	return content
}
