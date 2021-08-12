import { IESJzoneFrom } from '../types';

export function _formData($: JQueryStatic): IESJzoneFrom
{
	return {
		/**
		 * chapter_id
		 */
		rid: $(':hidden[name="rid"]:eq(0)').val(),
		tid: $(':hidden[name="tid"]:eq(0)').val(),
		/**
		 * novel_id
		 */
		code: $(':hidden[name="code"]:eq(0)').val(),
		token: $(':hidden[name="token"]:eq(0)').val(),
	} as any
}
