import { writeFile } from 'fs/promises';
import { join } from 'path';

const url = process.argv.slice(2)?.[0];

if (!url) {
    console.log('Please, provide url.');
    process.exit(1);
}

let oldPlugins = (await import('./plugins.json') as any).default;

const directory = url.replace('http://', '').replace('https://', '');

oldPlugins = oldPlugins.filter(p => p.path !== directory);

await writeFile(join(import.meta.dir, 'plugins.json'), JSON.stringify(oldPlugins));
// manually remove it ah