import { IRepoInfo1, IRepoInfo2 } from './types';
import { ITSValueOrArray } from 'ts-type';
export declare function toBase64(content: string | Buffer): string;
export declare function isForkFrom<T extends IRepoInfo2 | IRepoInfo1>(repoData: T, target: {
    owner: string;
    repo: string;
}): boolean;
export declare function valueToArray<T>(input: unknown | ITSValueOrArray<T>): T[];
