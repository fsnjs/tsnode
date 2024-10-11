import { readFileSync } from 'fs';
import { findBack } from '../util/find-back.js';
import { FsnPackageConfig } from './fsn-package.schema.js';

export function readPackageConfig(): FsnPackageConfig | undefined {
    const fsnProjectPath = findBack('fsn-package.json');

    if (!fsnProjectPath) return undefined;

    const source = readFileSync(fsnProjectPath, 'utf-8');
    return JSON.parse(source);
}
