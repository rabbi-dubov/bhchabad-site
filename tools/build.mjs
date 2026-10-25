#!/usr/bin/env node
// Node twin of build.py for computers without Python (same output, same checks).
//   node tools/build.mjs test      -> test/theme.min.css + test/theme.min.js + VERSION   (seen with ?cc=test)
//   node tools/build.mjs promote   -> copy test/ to live/                                (seen by every visitor)
// After pushing, purge jsDelivr (see README).
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const now = new Date();
const pad = n => String(n).padStart(2, '0');
const ver = `${now.getUTCFullYear()}${pad(now.getUTCMonth() + 1)}${pad(now.getUTCDate())}.${pad(now.getUTCHours())}${pad(now.getUTCMinutes())}`;

function buildCss() {
  let css = fs.readFileSync(path.join(root, 'src/theme.css'), 'utf8');
  css = css.replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/\s+/g, ' ')
    .replace(/\s*([{};,])\s*/g, '$1')
    .replace(/\s*>\s*/g, '>')
    .replace(/;}/g, '}')
    .trim();
  if (/[&<]/.test(css)) { throw new Error('CSS must not contain & or <'); }
  return css;
}

function buildJs() {
  const out = path.join(root, 'test', '.theme.tmp.js');
  execFileSync(process.platform === 'win32' ? 'npx.cmd' : 'npx', ['--yes', 'terser@5', 'src/theme.js', '-c', '-m', '-o', out], { cwd: root, stdio: 'inherit', shell: process.platform === 'win32' });
  const js = fs.readFileSync(out, 'utf8').trim();
  fs.unlinkSync(out);
  if (js.includes(']]>') || js.toLowerCase().includes('</script')) { throw new Error('JS must not contain ]]> or </script'); }
  return js;
}

const mode = process.argv[2];
if (mode === 'test') {
  const dir = path.join(root, 'test');
  fs.mkdirSync(dir, { recursive: true });
  const css = buildCss(), js = buildJs();
  fs.writeFileSync(path.join(dir, 'theme.min.css'), `/* BH Chabad theme v${ver} */${css}\n`);
  fs.writeFileSync(path.join(dir, 'theme.min.js'), `/* BH Chabad theme v${ver} */${js}\n`);
  fs.writeFileSync(path.join(dir, 'VERSION'), ver + '\n');
  console.log('test/ version', ver);
} else if (mode === 'promote') {
  for (const f of ['theme.min.css', 'theme.min.js', 'VERSION']) {
    fs.copyFileSync(path.join(root, 'test', f), path.join(root, 'live', f));
  }
  console.log('live/ now =', fs.readFileSync(path.join(root, 'live/VERSION'), 'utf8').trim());
} else {
  console.log('usage: node tools/build.mjs test|promote');
  process.exit(1);
}
