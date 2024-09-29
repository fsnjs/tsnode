import { dirname, join } from 'path';
import { readFileSync } from 'fs';
import { TsConfig } from './tsconfig.js';

/**
 * Resolves typescript project filesystem paths.
 * @param tsconfigPath The path to the project's `tsconfig.json`.
 * @returns An object containing the tsconfig.json file, its directory,
 * and the project out directory.
 */
export function resolveTsProjectPaths(tsconfigPath: string) {
    /** Parsed `tsconfig.json` file. **/
    let tsconfig: TsConfig = JSON.parse(readFileSync(tsconfigPath, 'utf-8'));

    /** `tsconfig.json` root directory. */
    const tsconfigDir = dirname(tsconfigPath);

    /** Output directory, resolved from `tsconfig`. */
    let outDir = join(tsconfigDir, tsconfig.compilerOptions.outDir);

    return { tsconfig, tsconfigDir, outDir };
}
