import { cp, mkdir, readFile, rm, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.dirname(fileURLToPath(import.meta.url));
const output = path.join(root, 'dist');
const html = await readFile(path.join(root, 'index.html'), 'utf8');
const ids = new Set([...html.matchAll(/\bid=["']([^"']+)["']/g)].map((match) => match[1]));
const missing = [];

for (const match of html.matchAll(/\b(?:src|href)=["']([^"']+)["']/g)) {
  const reference = match[1];
  if (reference.startsWith('#')) {
    if (!ids.has(reference.slice(1))) missing.push(`Missing in-page target: ${reference}`);
    continue;
  }
  if (/^(?:https?:|mailto:|tel:|data:|\/\/)/i.test(reference)) continue;
  const localPath = reference.split(/[?#]/, 1)[0];
  try {
    await stat(path.resolve(root, localPath));
  } catch {
    missing.push(`Missing local asset: ${reference}`);
  }
}

if (missing.length) {
  console.error(missing.join('\n'));
  process.exitCode = 1;
} else {
  await rm(output, { recursive: true, force: true });
  await mkdir(output, { recursive: true });
  await cp(path.join(root, 'index.html'), path.join(output, 'index.html'));
  await cp(path.join(root, 'styles.css'), path.join(output, 'styles.css'));
  await cp(path.join(root, 'script.js'), path.join(output, 'script.js'));
  await cp(path.join(root, 'assets'), path.join(output, 'assets'), { recursive: true });
  console.log(`VYRA production site built at ${path.relative(root, output)}.`);
}
