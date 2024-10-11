import { existsSync } from 'fs';
import { dirname, join, resolve } from 'path';

export function findBack(filename: string, path = resolve()) {
    const filePath = join(path, filename);
    if (existsSync(filePath)) return filePath;
    if (path.length === 1) return undefined;
    return findBack(filename, dirname(path));
}
