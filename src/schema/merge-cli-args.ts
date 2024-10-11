import { FsnPackageConfig } from './fsn-package.schema.js';
import { findBack } from '../util/find-back.js';
import { logErr } from '../util/log-err.js';
import { exit } from 'process';

export declare interface CliOptions {
    assets: string[];
    deleteDestPath: boolean;
    keepLifecycleScripts: boolean;
    project: string;
    source: string;
    tsconfig: string;
    watch: boolean;
    copyReadme: boolean;
}

export function mergeCliOptions(
    {
        deleteDestPath,
        keepLifecycleScripts,
        project: tsconfig,
        assets,
        source,
        copyReadme
    }: Partial<CliOptions>,
    {
        assets: pkgAssets,
        deleteDestPath: pkgDeleteDestPath,
        keepLifecycleScripts: pkgKeepLfclScripts,
        lib,
        localDependencies,
        tsconfig: pkgTsconfig,
        copyReadme: pkgCopyReadme
    }: Partial<FsnPackageConfig> = {}
): FsnPackageConfig {
    tsconfig = findBack(tsconfig ?? pkgTsconfig ?? 'tsconfig.json');

    if (!tsconfig) {
        // prettier-ignore
        logErr('This command is not available when running the Fusion CLI outside of a TypeScript project.');
        exit();
    }

    deleteDestPath = deleteDestPath ?? pkgDeleteDestPath ?? false;
    keepLifecycleScripts = keepLifecycleScripts ?? pkgKeepLfclScripts ?? false;
    assets = assets ?? pkgAssets ?? [];
    source = source ?? lib?.entryFile ?? 'public-api.ts';
    localDependencies ??= {};
    copyReadme = copyReadme ?? pkgCopyReadme ?? true;

    return {
        tsconfig,
        assets,
        deleteDestPath,
        keepLifecycleScripts,
        lib: { entryFile: source, bin: lib?.bin },
        localDependencies,
        copyReadme
    };
}
