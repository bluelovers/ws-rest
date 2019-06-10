/**
 * Created by user on 2019/6/10.
 */

import { console, Console, chalkByConsole } from 'debug-color2';

export { console };

export const consoleDebug = new Console(console, {
	label: true,
	inspectOptions: {
		depth: 5,
	}
});



export default consoleDebug

