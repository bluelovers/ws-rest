/**
 * Created by user on 2019/12/16.
 */

export function _p_2_br<T extends any = HTMLElement>(target: T, $: JQueryStatic)
{
	return $(target)
		.each(function (i: number, elem: any)
		{
			let _this = $(elem) as JQuery<HTMLElement>;

			let _html = _this
				.html()
				.replace(/(?:&nbsp;?)/g, ' ')
				.replace(/[\xA0\s]+$/g, '')
			;

			if (_html == '<br/>' || _html == '<br>')
			{
				_html = '';
			}

			_this.after(`${_html}<br/>`);
			_this.remove()
		})
		;
}
