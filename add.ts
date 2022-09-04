import { mkdir, writeFile } from 'fs/promises';
import { join } from 'path';

const url = process.argv.slice(2)?.[0];

if (!url) {
    console.log('Please, provide url.');
    process.exit(1);
}

const oldPlugins = (await import('./plugins.json') as any).default;

const BASE_URL = `${url}/dist`;

let manifest: any = await fetch(`${BASE_URL}/hykord_plugin_zone_manifest.json`);
console.log('Fetching manifest...');
if (!manifest || !manifest.ok) {
    console.log('Missing hykord_plugin_zone_manifest.json');
    process.exit(1);
}
manifest = await manifest.json();

let index: any = await fetch(`${BASE_URL}/index.js`);
console.log('Fetching index...');
if (!index || !index.ok) {
    console.log('Missing index.js');
    process.exit(1);
}
index = await index.text();

const directory = url.replace('http://', '').replace('https://', '');
await mkdir(join(directory, 'dist'), { recursive: true });
await writeFile(join(directory, 'dist', 'index.js'), index);

oldPlugins.push({ name: manifest.name, description: manifest.description, author: manifest.author, path: directory });

await writeFile(join(import.meta.dir, 'plugins.json'), JSON.stringify(oldPlugins));