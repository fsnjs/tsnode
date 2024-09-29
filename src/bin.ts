#!/usr/bin/env node

import yargs from 'yargs';
import { argv, exit } from 'process';
import { hideBin } from 'yargs/helpers';
import { existsSync, readFileSync } from 'fs';
import { resolve } from 'path';

import { postbuild } from './postbuild.js';
import { build } from './build.js';
import { logErr } from './util/log-err.js';

const version = (() => {
    const source = readFileSync(resolve('package.json'), 'utf-8');
    const { version }: { version: string } = JSON.parse(source);
    return version;
})();

await yargs(hideBin(argv))
    .command(
        'build',
        'Build a typescript project.',
        (yargs) => {
            return yargs
                .option('project', {
                    alias: 'p',
                    desc: 'Provide the path to a tsconfig.json file.',
                    type: 'string',
                    default: 'tsconfig.json'
                })
                .option('assets', {
                    desc: 'Path to directories or files that should be copied to the output directory.',
                    type: 'array'
                })
                .option('deleteDestPath', {
                    desc: 'Delete output path before build.',
                    type: 'boolean',
                    default: false
                })
                .option('keepLifecycleScripts', {
                    desc: 'Enable this to keep the "scripts" section in package.json.',
                    type: 'boolean',
                    default: false
                })
                .option('watch', {
                    desc: 'Watch files for changes.',
                    type: 'boolean',
                    default: false
                })
                .option('source', {
                    alias: 'src',
                    desc: 'Provide the name, relative path, or absolute path of a .ts file',
                    type: 'string'
                })
                .version(version)
                .help();
        },
        async ({
            project,
            watch,
            source,
            deleteDestPath,
            keepLifecycleScripts,
            assets
        }) => {
            project = resolve(project);

            if (!existsSync(project)) {
                logErr(
                    'This command is not available when running the Fusion CLI outside of a TypeScript workspace.'
                );
                exit();
            }

            build(project, source, watch, deleteDestPath).subscribe({
                complete: async () => {
                    await postbuild(keepLifecycleScripts, <string[]>assets);
                }
            });
        }
    )
    .parse();
