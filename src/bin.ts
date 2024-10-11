#!/usr/bin/env node

import yargs, { ArgumentsCamelCase } from 'yargs';
import { argv } from 'process';
import { readFileSync } from 'fs';
import { hideBin } from 'yargs/helpers';
import { resolve } from 'path';

import { CliOptions, mergeCliOptions } from './schema/merge-cli-args.js';
import { build } from './build.js';
import { postbuild } from './postbuild.js';
import { readPackageConfig } from './schema/read-package-config.js';

const version = (() => {
    const source = readFileSync(resolve('package.json'), 'utf-8');
    const { version }: { version: string } = JSON.parse(source);
    return version;
})();

yargs(hideBin(argv))
    .command(
        '$0',
        'Build a typescript project.',
        (yargs) => {
            return yargs
                .option('project', {
                    alias: 'p',
                    desc: 'Provide the path to a tsconfig.json file.',
                    type: 'string'
                })
                .option('assets', {
                    desc: 'Path to directories or files that should be copied to the output directory.',
                    type: 'array',
                    string: true
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
        (opts: ArgumentsCamelCase<CliOptions>) => {
            const pkg = readPackageConfig();

            const {
                assets,
                deleteDestPath,
                keepLifecycleScripts,
                lib,
                tsconfig,
                localDependencies
            } = mergeCliOptions(opts, pkg);

            build(
                tsconfig,
                lib.entryFile,
                opts.watch,
                deleteDestPath
            ).subscribe({
                complete: () => {
                    postbuild(
                        keepLifecycleScripts,
                        <string[]>assets,
                        localDependencies
                    );
                }
            });
        }
    )
    .parseSync();
