import { cpSync, existsSync, lstatSync, mkdirSync, readdirSync, readFileSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';

const nodeModulesRoot = join(process.cwd(), 'node_modules');
const bunCacheRoot = join(homedir(), '.bun', 'install', 'cache');

function listDebugPackageDirs(rootDir) {
    const dirs = [];
    const stack = [rootDir];

    while (stack.length > 0) {
        const currentDir = stack.pop();

        for (const entry of readdirSync(currentDir, { withFileTypes: true })) {
            if (entry.name === '.bin') continue;

            const fullPath = join(currentDir, entry.name);
            let stats;

            try {
                stats = lstatSync(fullPath);
            } catch {
                continue;
            }

            if (!stats.isDirectory() && !stats.isSymbolicLink()) continue;

            if (entry.name === 'debug' && existsSync(join(fullPath, 'package.json'))) {
                dirs.push(fullPath);
                continue;
            }

            if (entry.name === 'node_modules' || currentDir.includes('node_modules')) {
                stack.push(fullPath);
            }
        }
    }

    return dirs;
}

function findCacheDir(version) {
    const entries = readdirSync(bunCacheRoot).filter((entry) => entry.startsWith('debug@'));
    const preferredPrefixes = [`debug@${version}@@@`, 'debug@4.4.3@@@'];

    for (const prefix of preferredPrefixes) {
        const match = entries.find((entry) => entry.startsWith(prefix));
        if (match && existsSync(join(bunCacheRoot, match, 'src', 'index.js'))) {
            return match;
        }
    }

    return entries.find((entry) => existsSync(join(bunCacheRoot, entry, 'src', 'index.js')));
}

function repairDebugPackage(packageDir) {
    const packageJsonPath = join(packageDir, 'package.json');
    const srcDir = join(packageDir, 'src');
    const entryPointPath = join(srcDir, 'index.js');

    if (existsSync(entryPointPath)) return false;

    const { version } = JSON.parse(readFileSync(packageJsonPath, 'utf8'));
    const cacheDirName = findCacheDir(version);

    if (!cacheDirName) {
        throw new Error(`No Bun cache entry found for debug@${version}`);
    }

    const cacheSrcDir = join(bunCacheRoot, cacheDirName, 'src');

    if (!existsSync(cacheSrcDir)) {
        throw new Error(`Bun cache entry for debug@${version} is missing src/`);
    }

    mkdirSync(srcDir, { recursive: true });
    cpSync(cacheSrcDir, srcDir, { recursive: true, dereference: true });
    return true;
}

if (!existsSync(nodeModulesRoot) || !existsSync(bunCacheRoot)) {
    process.exit(0);
}

let repairedCount = 0;

for (const packageDir of listDebugPackageDirs(nodeModulesRoot)) {
    if (repairDebugPackage(packageDir)) {
        repairedCount += 1;
    }
}

if (repairedCount > 0) {
    console.log(`repair-bun-debug: restored src/ for ${repairedCount} debug package(s)`);
}