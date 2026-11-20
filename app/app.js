// Leonida Legend: GTA VI trophy tracker and guide.
// All data lives in data/trophies.json. Progress is kept in localStorage
// on this device only; export and import move it as a small JSON file.
const KEY = 'gta6-trophy-guide-v1';
const DEMO_EARNED = [2, 3, 4, 8, 15, 16, 18, 20, 21, 32, 35, 42, 44, 46, 52, 53, 54, 55];
const params = new URLSearchParams(location.search);
const shot = params.get('shot');
const demo = params.get('demo') === 'earned';

let earned = new Set();
try { earned = new Set(JSON.parse(localStorage.getItem(KEY) ?? '[]')); } catch { earned = new Set(); }
if (demo && earned.size === 0) { earned = new Set(DEMO_EARNED); save(); }

const doc = await (await fetch('data/trophies.json')).json();
const trophies = doc.trophies;
const byId = new Map(trophies.map((t) => [t.id, t]));

const $ = (id) => document.getElementById(id);
const rowsEl = $('rows');
const searchEl = $('search');
const kindEl = $('kind');
const gradeEl = $('grade');
const missableOnlyEl = $('missableOnly');
const earnedOnlyEl = $('earnedOnly');
const spoilerEl = $('spoiler');

function save() { localStorage.setItem(KEY, JSON.stringify([...earned].sort((a, b) => a - b))); }
function gradeCount(g) { return trophies.filter((t) => t.grade === g).length; }
function earnedGradeCount(g) { return trophies.filter((t) => t.grade === g && earned.has(t.id)).length; }

function gradeChip(g, label) {
  const span = document.createElement('span');
  span.className = 'chip';
  span.textContent = `${label}: ${earnedGradeCount(g)}/${gradeCount(g)}`;
  return span;
}

function renderProgress() {
  $('progressText').textContent = `${earned.size} of ${trophies.length} earned`;
  const pct = Math.round((earned.size / trophies.length) * 100);
  $('progressPct').textContent = `${pct}% to platinum`;
  $('progressFill').style.width = `${pct}%`;
  const chips = $('gradeChips');
  chips.replaceChildren(
    gradeChip('platinum', 'Platinum'), gradeChip('gold', 'Gold'),
    gradeChip('silver', 'Silver'), gradeChip('bronze', 'Bronze'),
  );
  const miss = trophies.filter((t) => t.missable);
  const missDone = miss.filter((t) => earned.has(t.id)).length;
  $('progressSummary').textContent = `You have earned ${earned.size} of ${trophies.length} trophies (${pct}%). ` +
    `Missables secured: ${missDone} of ${miss.length}. ` +
    `The platinum, Vice Got a Price!, unlocks when the other 54 are done.`;
  const stats = $('kindStats');
  stats.replaceChildren();
  const kinds = [...new Set(trophies.map((t) => t.kind))];
  for (const k of kinds) {
    const total = trophies.filter((t) => t.kind === k).length;
    const done = trophies.filter((t) => t.kind === k && earned.has(t.id)).length;
    const div = document.createElement('div');
    div.className = 'stat';
    div.textContent = `${k}: ${done}/${total}`;
    stats.append(div);
  }
}

function cardFor(t, openGuide) {
  const card = document.createElement('article');
  card.className = 'card' + (earned.has(t.id) ? ' earned' : '');
  card.dataset.trophyId = String(t.id);
  const head = document.createElement('div');
  head.className = 'card-head';
  const box = document.createElement('input');
  box.type = 'checkbox';
  box.checked = earned.has(t.id);
  box.setAttribute('aria-label', `Mark ${t.name} earned`);
  box.addEventListener('change', () => {
    if (box.checked) earned.add(t.id); else earned.delete(t.id);
    save(); renderAll();
  });
  const title = document.createElement('h3');
  const hidden = spoilerEl.checked && t.story && !earned.has(t.id);
  title.textContent = hidden ? 'Hidden story trophy' : t.name;
  const grade = document.createElement('span');
  grade.className = `grade ${t.grade}`;
  grade.textContent = t.grade;
  head.append(box, title, grade);
  card.append(head);
  if (hidden) {
    const p = document.createElement('p');
    p.className = 'desc spoiled';
    p.textContent = 'Story trophy hidden by the spoiler setting — earn it in-game to reveal the name and guide.';
    card.append(p);
    return card;
  }
  const desc = document.createElement('p');
  desc.className = 'desc';
  desc.textContent = t.description;
  card.append(desc);
  const tags = document.createElement('div');
  tags.className = 'tags';
  const kindTag = document.createElement('span');
  kindTag.className = 'tag';
  kindTag.textContent = t.kind;
  tags.append(kindTag);
  if (t.missable) {
    const m = document.createElement('span');
    m.className = 'tag miss';
    m.textContent = 'MISSABLE';
    tags.append(m);
  }
  card.append(tags);
  if (t.missable && t.missableWhy) {
    const why = document.createElement('p');
    why.className = 'miss-why';
    why.textContent = `Why it is missable: ${t.missableWhy}`;
    card.append(why);
  }
  const toggle = document.createElement('button');
  toggle.type = 'button';
  toggle.className = 'guide-toggle';
  toggle.textContent = openGuide ? 'Hide guide' : 'Show guide + sources';
  const guideBox = document.createElement('div');
  guideBox.className = 'guide';
  guideBox.hidden = !openGuide;
  const g = document.createElement('p');
  g.textContent = t.guide;
  const src = document.createElement('p');
  src.className = 'sources';
  src.textContent = `Sources: ${(t.sources || doc.sources).join(' · ')}`;
  guideBox.append(g, src);
  toggle.addEventListener('click', () => {
    guideBox.hidden = !guideBox.hidden;
    toggle.textContent = guideBox.hidden ? 'Show guide + sources' : 'Hide guide';
  });
  card.append(toggle, guideBox);
  return card;
}

function visibleTrophies() {
  const q = searchEl.value.trim().toLowerCase();
  return trophies.filter((t) => {
    if (kindEl.value !== 'all' && t.kind !== kindEl.value) return false;
    if (gradeEl.value !== 'all' && t.grade !== gradeEl.value) return false;
    if (missableOnlyEl.checked && !t.missable) return false;
    if (earnedOnlyEl.checked && !earned.has(t.id)) return false;
    if (q && !(t.name.toLowerCase().includes(q) || t.description.toLowerCase().includes(q) || t.guide.toLowerCase().includes(q))) return false;
    return true;
  });
}

function renderChecklist(openId) {
  const list = visibleTrophies();
  rowsEl.replaceChildren();
  for (const t of list) rowsEl.append(cardFor(t, openId === t.id));
  $('listHint').textContent = `Showing ${list.length} of ${trophies.length} trophies. ` +
    `Tick a trophy when you earn it — it stays ticked on this device.`;
}

function renderMissables() {
  const box = $('missableRows');
  box.replaceChildren();
  for (const t of trophies.filter((t) => t.missable)) box.append(cardFor(t, false));
}

function renderAll(openId) {
  renderProgress();
  renderChecklist(openId);
  renderMissables();
}

function showView(name) {
  for (const b of document.querySelectorAll('.tab')) b.classList.toggle('active', b.dataset.view === name);
  for (const v of document.querySelectorAll('.view')) v.classList.toggle('active', v.id === `view-${name}`);
}
for (const b of document.querySelectorAll('.tab')) b.addEventListener('click', () => showView(b.dataset.view));

for (const el of [searchEl, kindEl, gradeEl, missableOnlyEl, earnedOnlyEl, spoilerEl]) {
  el.addEventListener('input', () => renderChecklist());
  el.addEventListener('change', () => renderChecklist());
}

$('export').addEventListener('click', () => {
  const payload = { game: doc.game, exported: new Date().toISOString(), earned: [...earned].sort((a, b) => a - b) };
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' }));
  a.download = 'gta6-trophy-progress.json';
  a.click();
  URL.revokeObjectURL(a.href);
});
$('import').addEventListener('change', async (e) => {
  const file = e.target.files[0];
  if (!file) return;
  try {
    const data = JSON.parse(await file.text());
    const ids = Array.isArray(data) ? data : data.earned;
    const next = new Set(ids.filter((id) => byId.has(id)));
    earned = next;
    save(); renderAll();
  } catch { alert('That file is not a valid progress export.'); }
  e.target.value = '';
});
$('reset').addEventListener('click', () => {
  if (confirm('Clear all earned trophies on this device?')) { earned = new Set(); save(); renderAll(); }
});

window.__trophyState = () => ({
  total: trophies.length,
  earned: earned.size,
  earnedIds: [...earned].sort((a, b) => a - b),
  missable: trophies.filter((t) => t.missable).length,
  view: document.querySelector('.view.active')?.id ?? null,
});

// Deterministic screenshot modes: ?shot=checklist|roadmap|missables|progress
let openId = null;
if (shot === 'roadmap') showView('roadmap');
else if (shot === 'missables') { showView('missables'); spoilerEl.checked = true; missableOnlyEl.checked = true; }
else if (shot === 'progress') showView('progress');
else { showView('checklist'); if (demo) openId = 1; }
renderAll(openId);
window.__shotReady = true;
