// Builds the body of the "Past courses" page (ChabadOne web document) from data/courses.json.
// Output: pages/past-courses-body.html, paste-ready for the page's Source view.
// Only global cc-* components; the theme's courseLibrary() adds the filter and the course pop-up.
// Run from the repo root: node tools/build-courses-page.mjs
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DATA = JSON.parse(fs.readFileSync(path.join(ROOT, 'data/courses.json'), 'utf8'));
const CDN = 'https://cdn.jsdelivr.net/gh/rabbi-dubov/bhchabad-site@main/data/covers-thumb/';
const HERO_IMG = '/media/images/1393/wBNe13937531.jpg'; // already in My Images (Learn page "past courses" card)
const LEARN = '/7581757';

const e = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const slug = s => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 48).replace(/-+$/, '');

// Topics: key, chip label, colour class (theme --cc-book-1..5)
const TOPICS = [
  ['soul', 'Mysticism and the soul', 1],
  ['big', 'Big questions', 2],
  ['law', 'Law, ethics and history', 3],
  ['life', 'Life and relationships', 4],
  ['torah', 'Torah, prayer and holidays', 5],
];
const TOPIC_OF = { // title keyword -> topic
  'Kabbalah': 'soul', 'Jewpernatural': 'soul', 'Meditation from Sinai': 'soul', 'Journey of the Soul': 'soul',
  'Paradigm Shift': 'soul', 'What Is?': 'soul', 'Lift Your Life': 'soul',
  'For All Humankind': 'big', 'My G-d': 'big', 'This Can Happen': 'big', 'Course of Why': 'big',
  'Wrestling with Faith': 'big', 'To Believe': 'big',
  'Sinai and Civics': 'law', 'Responsa': 'law', 'Decoding the Talmud': 'law', 'Judaism Decoded': 'law',
  'Crime and Consequence': 'law', 'Great Debates': 'law', 'Gifts to the World': 'law', 'Beyond Right': 'law',
  'Survival of a Nation': 'law', 'Outsmarting Antisemitism': 'law', 'Decisions of Fate': 'law',
  'Colorful Profiles': 'law', 'Book Smart': 'law',
  'Happiness': 'life', 'Advice for Life': 'life', 'Nurturing Relationships': 'life', 'Communication': 'life',
  'Worrier to Warrior': 'life', 'Judaism at Home': 'life', 'Pirkei Avot': 'life', 'Well-Connected': 'life',
  'One Wow Moment': 'life',
  'Secrets of the Bible': 'torah', 'High Holidays': 'torah', 'With All My Heart': 'torah', 'Heaven on Earth': 'torah',
  'Read it in Hebrew': 'torah', 'A Work of Heart': 'torah', 'NEXT GENesis': 'torah',
};
const topicOf = t => Object.entries(TOPIC_OF).find(([k]) => t.toLowerCase().includes(k.toLowerCase()))?.[1] || 'big';
const T = Object.fromEntries(TOPICS.map(([k, l, n]) => [k, { label: l, n }]));
const SEASON = { Winter: 1, Spring: 2, Summer: 3, Fall: 4 };
const REC = { youtube: 'Watch the classes', spotify: 'Listen on the podcast' }; // Wix audio stays off until it is moved

const all = DATA.courses.map(c => {
  const women = c.series === 'RCS';
  const season = /^[A-Z]/.test(c.season) ? c.season.split(' ')[0] : 'Fall';
  const recs = (c.recordings || []).filter(r => REC[r.type]);
  const cover = c.coverFile && fs.existsSync(path.join(ROOT, 'data/covers-thumb', c.coverFile.replace(/\.\w+$/, '.webp')))
    ? CDN + c.coverFile.replace(/\.\w+$/, '.webp') : null;
  return {
    title: c.title.startsWith('Sinai and Civics') ? 'Sinai and Civics' : c.title,
    when: women ? `Women's series ${c.season}` : `${season} ${c.year}`,
    sort: `${c.year}-${SEASON[season] || 4}${women ? 'b' : 'a'}`,
    topic: topicOf(c.title), women, desc: c.description || '', lessons: c.lessons || [], rec: recs[0] || null,
    cover, current: c.status === 'current', id: 'c-' + c.year + '-' + slug(c.title),
  };
});
const past = all.filter(c => !c.current).sort((a, b) => (a.sort < b.sort ? 1 : -1));
const nWomen = all.filter(c => c.women).length;
const nRec = past.filter(c => c.rec).length;

function card(c) {
  const t = T[c.topic];
  const tags = ['cc-tag-' + c.topic, c.women ? 'cc-tag-women' : '', c.rec ? 'cc-tag-rec' : ''].filter(Boolean).join(' ');
  const cover = c.cover ? `<div class="cc-course__cover"><img src="${c.cover}" alt="" loading="lazy" /></div>\n` : '';
  const link = c.rec ? `<a href="${e(c.rec.url)}" target="_blank" rel="noopener">${REC[c.rec.type]}</a>` : '';
  const more = c.lessons.length
    ? `\n<div class="cc-course__more"><p class="cc-dialog__h">${c.lessons.length} lessons</p><ol class="cc-dialog__lessons">${c.lessons.map(l => `<li>${e(l)}</li>`).join('')}</ol></div>` : '';
  return `<div class="cc-course${c.cover ? ' cc-course--cover' : ''} cc-topic-${t.n} ${tags}" id="${c.id}">
${cover}<p class="cc-course__when">${e(c.when)}</p>
<h3 class="cc-course__title cc-head"><a class="cc-course__open" href="#${c.id}">${e(c.title)}</a></h3>
<p class="cc-course__desc">${e(c.desc)}</p>
<div class="cc-course__foot"><span class="cc-course__topic">${e(c.women ? "Women's series with Mushky Dubov" : t.label)}</span>${link}</div>${more}
</div>`;
}

const chips = [['all', 'All courses'], ...TOPICS.map(([k, l]) => [k, l]), ['women', "Women's series"], ['rec', 'With recordings']]
  .map(([k, l]) => `<a href="#${k}">${e(l)}</a>`).join('\n');

const body = `<div class="cc-landing">
<div class="cc-hero">
<div class="cc-wrap">
<div class="cc-hero__text">
<p class="cc-eyebrow">Learn</p>
<h1 class="cc-hero__title cc-head">Every course we've taught</h1>
<p class="cc-hero__sub">Since 2017: a new course each season from the Rohr Jewish Learning Institute with Rabbi Levi Dubov, and a monthly series for women with Mushky Dubov. Tap any course for its lessons and recordings.</p>
<ul class="cc-stats">
<li><strong>${all.length}</strong><span>courses taught</span></li>
<li><strong>${nWomen}</strong><span>women's series</span></li>
<li><strong>${nRec}</strong><span>with recordings</span></li>
</ul>
</div>
<div class="cc-hero__media"><img src="${HERO_IMG}" alt="A class from a past course" /></div>
</div>
</div>
<div class="cc-section cc-section--white cc-library" id="library">
<div class="cc-wrap">
<div class="cc-chips">
${chips}
</div>
<div class="cc-courses">
${past.map(card).join('\n')}
</div>
<div class="cc-callout">
<div>
<h3 class="cc-head">This season</h3>
<p>Our current courses, weekly classes and women's learning are on the Learn page. The first class of every course is free.</p>
</div>
<a class="cc-btn" href="${LEARN}">See what's on now</a>
</div>
</div>
</div>
</div>
`;

fs.mkdirSync(path.join(ROOT, 'pages'), { recursive: true });
fs.writeFileSync(path.join(ROOT, 'pages/past-courses-body.html'), body);
console.log(`ok: ${past.length} past courses, ${all.length} total, ${nWomen} women's series, ${nRec} with recordings, ${past.filter(c => !c.cover).length} without cover, ${past.filter(c => !c.lessons.length).length} without lessons; ${body.length} chars`);
