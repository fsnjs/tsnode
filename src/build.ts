import { ChildProcess, spawn } from 'child_process';
import { basename } from 'path';
import { rmSync } from 'fs';
import { tap } from 'rxjs';

import { resolveOutFile } from './resolve-out-file.js';
import { resolveSrcFile } from './resolve-src-file.js';
import { TscSubject } from './ts/tsc-subject.js';
import { resolveTsProjectPaths } from './ts/resolve-ts-project-paths.js';
import ora, { Ora } from 'ora';

export function build(
    tsconfigPath: string,
    srcNmOrPath?: string,
    watch?: boolean,
    deleteDestPath?: boolean
) {
    let spinner: Ora | undefined;
    if (!watch) spinner = ora('Resolving tsconfig.json...');

    const { outDir, tsconfigDir } = resolveTsProjectPaths(tsconfigPath);
    spinner?.succeed();

    if (deleteDestPath) {
        spinner?.start('Removing existing build artifacts...');
        rmSync(outDir, { recursive: true });
        spinner?.succeed();
    }

    spinner?.start('Starting Typescript build...');

    if (!srcNmOrPath) return new TscSubject(tsconfigPath, watch);

    let nodeProc: ChildProcess | undefined;

    return new TscSubject(tsconfigPath, watch).pipe(
        tap({
            next: (next) => {
                if (nodeProc || !next.continue) return;

                /** Resolved source `.ts` file. */
                const srcPath = resolveSrcFile(srcNmOrPath, tsconfigDir);

                /** The name of the output file. */
                let outFile = basename(srcPath);
                outFile = outFile.substring(0, outFile.lastIndexOf('.'));
                outFile = resolveOutFile(outDir, outFile);

                const spawnArr = ['--enable-source-maps', outFile];
                if (watch) spawnArr.unshift('--watch');

                nodeProc = spawn('node', spawnArr, {
                    cwd: process.cwd(),
                    stdio: 'inherit'
                });
            },
            complete: () => {
                spinner?.succeed('Build complete.');
            }
        })
    );
}
