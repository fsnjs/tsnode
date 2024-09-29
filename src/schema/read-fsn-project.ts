import { readFileSync } from 'fs';
import { findBack } from '../util/find-back.js';
import { FsnProjectConfig } from './fsn-project.schema.js';

export function readFsnProject() {
    const fsnProjectPath = findBack('fsn-project.json');
    const source = readFileSync(fsnProjectPath, 'utf-8');
    const fsnProject: FsnProjectConfig = JSON.parse(source);
    return fsnProject;
}
