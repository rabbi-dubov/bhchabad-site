// Release step: point the header loader at one exact release.
//
//   node tools/pin.mjs            uses the current commit (run it right after the release commit is pushed)
//   node tools/pin.mjs <id>       uses the commit id you give (40 characters), e.g. to go back to an earlier release
//
// It writes the id into loader/header.html (the line `var LIVE = "..."`) and checks that jsDelivr really serves
// that release. The SAME one-line change must then be made in ChabadOne > Settings > General Settings >
// Custom Header Code (Save, "I agree" + Ok, Preview, Publish). Until that is published, visitors keep the previous
// release. See SKILL.md, section 6, "Release".
import fs from 'node:fs';
import crypto from 'node:crypto';
import { execSync } from 'node:child_process';

const id = (process.argv[2] || execSync('git rev-parse HEAD').toString()).trim();
if (!/^[0-9a-f]{40}$/.test(id)) { console.error('Give the full 40-character commit id.'); process.exit(1); }

const file = 'loader/header.html';
let text = fs.readFileSync(file, 'utf8').replace(/\r\n/g, '\n');
const line = /var LIVE = "([0-9a-f]{40})";/;
const now = line.exec(text);
if (!now) { console.error('No `var LIVE = "..."` line in ' + file + '.'); process.exit(1); }
text = text.replace(line, 'var LIVE = "' + id + '";');
fs.writeFileSync(file, text);

const want = fs.readFileSync('live/VERSION', 'utf8').trim();
const base = 'https://cdn.jsdelivr.net/gh/rabbi-dubov/bhchabad-site@' + id + '/live/';
let ok = true;
for (const name of ['theme.min.js', 'theme.min.css']) {
  let first = '';
  try { first = (await (await fetch(base + name)).text()).slice(0, 40); } catch (e) { first = 'could not be fetched'; }
  const good = first.includes('v' + want);
  if (!good) { ok = false; }
  console.log((good ? 'ok    ' : 'WRONG ') + name + ': ' + first.trim());
}
const rest = text.split('\n').slice(1).join('\n').trim();
console.log('');
console.log('Previous release id: ' + now[1]);
console.log('New release id:      ' + id + '   (live/VERSION ' + want + ')');
console.log('Fingerprint of loader/header.html after its first line: ' + crypto.createHash('sha256').update(rest, 'utf8').digest('hex').slice(0, 16));
console.log('');
console.log(ok
  ? 'Next: in ChabadOne, Custom Header Code, change the LIVE id to the new one (nothing else), Save, "I agree" + Ok, Preview, Publish.'
  : 'STOP: jsDelivr does not serve this release at that id. Is the release commit pushed? Do not change ChabadOne yet.');
process.exitCode = ok ? 0 : 1;
