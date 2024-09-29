import { existsSync } from 'fs';
import { exit } from 'process';
import { glob } from 'glob';
import { join, resolve } from 'path';
import { logErr } from './util/log-err.js';

export async function resolveSrcFile(srcFileNameOrPath: string, tsDir: string) {
    if (existsSync(srcFileNameOrPath)) return srcFileNameOrPath;
    const resolved = resolve(srcFileNameOrPath);
    if (existsSync(resolved)) return resolved;

    const sourcePath = await glob(join(tsDir, '**', srcFileNameOrPath));

    if (sourcePath.length === 0) {
        logErr(
            `Source file ${srcFileNameOrPath} could not be resolved. ` +
                `Provide an absolute path to the source file or a valid filename.`
        );
        exit();
    }

    if (sourcePath.length > 1) {
        logErr(
            `Multiple files matching name ${srcFileNameOrPath} were found in the ` +
                `out directory. Provide an absolute path to the source file.`
        );
        exit();
    }

    return sourcePath[0];
}
