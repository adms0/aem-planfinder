import { copyFileSync, existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const distDir = resolve(__dirname, '../dist');
const clientlibDir = resolve(
  __dirname,
  '../../ui.apps/src/main/content/jcr_root/apps/planfinder/clientlibs/clientlib-site'
);

const jsSrc = resolve(distDir, 'js/site.js');
const cssSrc = resolve(distDir, 'css/site.css');

if (!existsSync(jsSrc)) {
  throw new Error(`Missing built JS bundle at ${jsSrc}`);
}
if (!existsSync(cssSrc)) {
  throw new Error(`Missing built CSS bundle at ${cssSrc}`);
}

const jsTargetDir = resolve(clientlibDir, 'js');
const cssTargetDir = resolve(clientlibDir, 'css');

mkdirSync(jsTargetDir, { recursive: true });
mkdirSync(cssTargetDir, { recursive: true });

copyFileSync(jsSrc, resolve(jsTargetDir, 'site.js'));
copyFileSync(cssSrc, resolve(cssTargetDir, 'site.css'));

writeFileSync(resolve(clientlibDir, 'js.txt'), '#base=js\nsite.js\n', 'utf8');
writeFileSync(resolve(clientlibDir, 'css.txt'), '#base=css\nsite.css\n', 'utf8');

console.log(`Synced clientlib-site assets to ${clientlibDir}`);
