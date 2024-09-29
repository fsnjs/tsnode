import { existsSync } from 'fs';
import { resolve } from 'path';

export function exists(path: string, type: 'src' | 'tsconfig.json') {
    path = resolve(path);
    if (existsSync(path)) return path;
    throw new Error(`${type} file does not exist at ${path}.`);
}
