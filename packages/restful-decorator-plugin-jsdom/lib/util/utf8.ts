/**
 * Created by user on 2019/12/12.
 */

import { createSniffHTMLEncoding, createIconvDecode } from '../util';

export const defaultEncoding = 'UTF8';

export const sniffHTMLEncoding = createSniffHTMLEncoding(defaultEncoding);

export const iconvDecode = createIconvDecode(defaultEncoding, sniffHTMLEncoding);

export default {
	defaultEncoding,
	sniffHTMLEncoding,
	iconvDecode,
}
