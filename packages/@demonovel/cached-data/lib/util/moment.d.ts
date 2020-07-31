import moment, { Moment } from 'moment-timezone';
export declare function _process<T extends Moment>(moment: T): moment.Moment;
export declare function createMomentByMilliseconds(milliseconds: number): moment.Moment;
export declare function createMomentBySeconds(unix: number): moment.Moment;
