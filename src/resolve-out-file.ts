import { globSync } from 'glob';
import { join } from 'path';

export function resolveOutFile(outPath: string, outFile: string) {
    const matches = globSync(join(outPath, '**/' + outFile + '.js'));

    if (matches.length === 0) {
        throw new Error(`Compiled file could not be resolved.`);
    }

    if (matches.length > 1) {
        throw new Error(
            `Multiple files in the out directory that match the name ${outFile}.`
        );
    }

    return matches[0];
}
