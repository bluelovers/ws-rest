import { createSniffHTMLEncoding, createIconvDecode } from '../util';

export const defaultEncoding = 'GBK';

export const sniffHTMLEncoding = createSniffHTMLEncoding(defaultEncoding);

export const iconvDecode = createIconvDecode(defaultEncoding, sniffHTMLEncoding);

export default {
	defaultEncoding,
	sniffHTMLEncoding,
	iconvDecode,
}
