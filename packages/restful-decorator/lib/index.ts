/**
 * Created by user on 2019/6/9.
 */

import * as Decorators from './decorators';
import { AbstractHttpClient } from './wrap/abstract';
import Bluebird from 'bluebird';

export type IBluebird<T> = Bluebird<T>

export { Decorators }
export { AbstractHttpClient }
