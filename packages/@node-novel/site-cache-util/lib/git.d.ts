/**
 * Created by user on 2019/12/13.
 */
import { gitDiffStagedDir, gitDiffStagedFile, gitDiffStaged } from '@git-lazy/diff-staged';
import matchGlob from '@git-lazy/util/util/match';
import { crossSpawnSync, SpawnSyncOptions, SpawnSyncReturns } from '@git-lazy/util/spawn/git';
export { gitDiffStagedDir, gitDiffStagedFile, gitDiffStaged };
export { matchGlob };
export { crossSpawnSync, SpawnSyncOptions, SpawnSyncReturns };
import Bluebird from 'bluebird';
import { ITSResolvable } from 'ts-type';
export declare function filterGitDiffStagedFiles(options: {
    git_root: string;
    pattern?: string[];
}): Bluebird<string[]>;
export declare function reportDiffStagedNovels<T extends object>(options: {
    git_root: string;
    pattern?: string[];
    callback?(json: T, id: string): ITSResolvable<string>;
}): Bluebird<string>;
