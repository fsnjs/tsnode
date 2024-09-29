import { existsSync } from 'fs';
import { dirname, join, resolve } from 'path';

export function findBack(filename: string, path = resolve()) {
    const filePath = join(path, filename);
    if (existsSync(filePath)) return filePath;
    if (path.length === 1) throw new Error(`Failed to resolve ${filename}.`);
    return findBack(filename, dirname(path));
}
