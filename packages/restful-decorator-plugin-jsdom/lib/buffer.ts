import { Buffer } from "buffer";

export function arrayBufferToString(buf: number[])
{
	return Buffer.from(buf).toString();
}
