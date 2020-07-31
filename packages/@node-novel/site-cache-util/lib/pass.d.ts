/**
 * Created by user on 2020/1/6.
 */
import { IPasswordLocal } from './types';
export declare function importPassword<T extends IPasswordLocal>(options: {
    file: string;
    __root: string;
    envPrefix?: string;
}): Promise<T>;
export default importPassword;
