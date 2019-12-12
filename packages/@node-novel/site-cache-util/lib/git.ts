/**
 * Created by user on 2019/12/13.
 */

import { gitDiffStagedDir, gitDiffStagedFile, gitDiffStaged } from '@git-lazy/diff-staged';
import matchGlob from '@git-lazy/util/util/match';
import { crossSpawnSync, SpawnSyncOptions, SpawnSyncReturns } from '@git-lazy/util/spawn/git';

export { gitDiffStagedDir, gitDiffStagedFile, gitDiffStaged }
export { matchGlob }
export { crossSpawnSync, SpawnSyncOptions, SpawnSyncReturns }
