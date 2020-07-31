export * from 'moment';
import { MomentInput } from 'moment';
import moment from 'moment-timezone';
export { moment };
export declare function toMoment(inp?: MomentInput, ...argv: any[]): moment.Moment;
export declare function unixMoment(timestamp: number): moment.Moment;
export default moment;
