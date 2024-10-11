import { execSync } from 'child_process';
import { cpSync, existsSync, readFileSync, writeFileSync } from 'fs';
import { join, resolve } from 'path';
import { exit } from 'process';
import { globSync } from 'glob';
import { TsConfig } from './ts/tsconfig.js';
import { LocalDependency } from './schema/fsn-package.schema.js';

export function postbuild(
    keepLifecycleScripts: boolean,
    assets: string[] = [],
    // @ts-ignore @to-do
    localDependencies?: Record<string, LocalDependency>
) {
    const dist = (() => {
        let outDir = resolve('dist');

        if (existsSync(resolve('tsconfig.json'))) {
            let source = readFileSync(resolve('tsconfig.json'), 'utf-8');
            const { compilerOptions: tsconfig }: TsConfig = JSON.parse(source);
            if (!tsconfig.outDir) return outDir;
            return resolve(tsconfig.outDir);
        }

        return outDir;
    })();

    const conf = JSON.parse(readFileSync(resolve('package.json'), 'utf-8'));
    delete conf.devDependencies;
    if (!keepLifecycleScripts) delete conf.scripts;
    delete conf.workspaces;
    writeFileSync(join(dist, 'package.json'), JSON.stringify(conf, null, 4));

    if (existsSync(resolve('README.md'))) {
        cpSync(resolve('README.md'), resolve(dist, 'README.md'));
    }

    if (existsSync(resolve('LICENSE'))) {
        cpSync(resolve('LICENSE'), resolve(dist, 'README'));
    }

    assets.forEach((a) => {
        cpSync(resolve(a), resolve('dist', a), { recursive: true });
    });

    const distFiles = globSync(join(dist, '**/*.js'));
    const bin = distFiles.find((f) => /bin|cli/.test(f));
    if (!bin) exit();
    execSync('chmod 755 ' + bin);
}
