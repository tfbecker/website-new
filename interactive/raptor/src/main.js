import { Schematic, STAGE_TITLES, mixtureTemp, TURBINE_OK_C, wallThicknessMm } from './schematic.js';
import { turbineWidget } from './widgets.js';

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];

// ------------------------------------------------------------ step-by-step schematic

const sch = new Schematic($('#schematic'));
const steps = $$('.step');
let active = -1;

function activate(i) {
  if (i === active || i < 0) return;
  active = i;
  sch.setStage(i);
  steps.forEach((s, j) => s.classList.toggle('active', i === j));
  $('#stage-title').textContent = STAGE_TITLES[i];
  $('#stage-num').textContent = `Step ${i + 1} of ${steps.length}`;
  $$('#stage-dots button').forEach((b, j) => b.setAttribute('aria-current', j === i ? 'step' : 'false'));
}

// thin trigger band: in the middle on desktop, below the sticky figure on phones
let observer;
function observeSteps() {
  if (observer) observer.disconnect();
  const narrow = matchMedia('(max-width: 899px)').matches;
  observer = new IntersectionObserver((entries) => {
    for (const e of entries) if (e.isIntersecting) activate(steps.indexOf(e.target));
  }, { rootMargin: narrow ? '-66% 0px -26% 0px' : '-48% 0px -48% 0px' });
  steps.forEach((s) => observer.observe(s));
}
const dots = $('#stage-dots');
steps.forEach((s, i) => {
  const b = document.createElement('button');
  b.type = 'button';
  b.setAttribute('aria-label', `Go to step ${i + 1}: ${STAGE_TITLES[i]}`);
  b.addEventListener('click', () => {
    const narrow = matchMedia('(max-width: 899px)').matches;
    const y = s.getBoundingClientRect().top + window.scrollY - (narrow ? window.innerHeight * 0.6 : window.innerHeight * 0.3);
    window.scrollTo({ top: y, behavior: 'smooth' });
    activate(i);
  });
  dots.appendChild(b);
});
observeSteps();
matchMedia('(max-width: 899px)').addEventListener('change', observeSteps);
activate(0);

// any control inside a step also makes that step the active one
for (const el of $$('.step input, .step button')) {
  el.addEventListener('pointerdown', () => activate(steps.indexOf(el.closest('.step'))));
  el.addEventListener('focus', () => activate(steps.indexOf(el.closest('.step'))));
}

// step 1: tank pressure
const pr = $('#ctl-pressure');
const prOut = $('#out-pressure');
const onPr = () => {
  const v = pr.value / 100;
  sch.set('pressure', v);
  prOut.textContent = v < 0.15 ? 'a gentle hiss' : v < 0.5 ? 'a decent push' : v < 0.85 ? 'a strong push' : 'as hard as this tank can go';
};
pr.addEventListener('input', onPr); onPr();

// step 2: chamber pressure vs tank wall
const pc = $('#ctl-pc');
const pcOut = $('#out-pc');
const wallOut = $('#out-wall');
const onPc = () => {
  const bar = +pc.value;
  sch.set('chamberBar', bar);
  pcOut.textContent = `${bar} bar`;
  const mm = wallThicknessMm(bar);
  wallOut.textContent = mm >= 100 ? `${(mm / 10).toFixed(0)} cm` : `${mm.toFixed(0)} mm`;
};
pc.addEventListener('input', onPc); onPc();
$('#btn-backflow').addEventListener('click', () => { activate(1); sch.set('backflowAt', sch.time); });

// step 3: batteries
const bat = $('#ctl-battery');
bat.addEventListener('click', () => {
  const on = bat.getAttribute('aria-pressed') !== 'true';
  bat.setAttribute('aria-pressed', String(on));
  bat.textContent = on ? 'Back to the question mark' : 'Try batteries';
  sch.set('battery', on);
});

// step 4: gas generator mixture
const mix = $('#ctl-mix');
const mixOut = $('#out-mix');
const tempOut = $('#out-temp');
const verdict = $('#out-verdict');
const onMix = () => {
  const m = mix.value / 100;
  sch.set('mixture', m);
  mixOut.textContent = m < 0.3 ? 'mostly fuel' : m > 0.7 ? 'mostly oxygen' : 'close to balanced';
  const t = mixtureTemp(m);
  tempOut.textContent = t > 2000 ? 'over 3,000 °C' : t > TURBINE_OK_C ? 'well over 1,000 °C' : 'a few hundred °C';
  const ok = t <= TURBINE_OK_C;
  verdict.textContent = ok ? 'Turbine is happy.' : 'Turbine blades melt.';
  verdict.className = ok ? 'ok' : 'bad';
};
mix.addEventListener('input', onMix); onMix();

// step 6: turbine share widget
turbineWidget($('#turbine-widget'), $('#ctl-share'), $('#out-share'), $('#out-heat'));

// step 7: plumbing layers
const layers = { regen: $('#ly-regen'), press: $('#ly-press'), igniters: $('#ly-ign'), purge: $('#ly-purge') };
for (const [k, el] of Object.entries(layers)) {
  el.addEventListener('change', () => { activate(6); sch.set(k, el.checked); });
}
$('#ly-all').addEventListener('click', () => {
  const allOn = Object.values(layers).every((el) => el.checked);
  for (const [k, el] of Object.entries(layers)) { el.checked = !allOn; sch.set(k, !allOn); }
  $('#ly-all').textContent = allOn ? 'Switch them all on' : 'Switch them all off';
  activate(6);
});

// ------------------------------------------------------------ 3D (loaded lazily so the text never waits for WebGL)

function webglOK() {
  try { const c = document.createElement('canvas'); return !!(c.getContext('webgl2') || c.getContext('webgl')); } catch { return false; }
}

const VERSIONS = {
  1: { thrust: 185, mass: 2080, total: 3630 },
  2: { thrust: 230, mass: 1630, total: 2875 },
  3: { thrust: 280, mass: 1525, total: 1720 },
};

async function init3D() {
  const heroEl = $('#hero3d');
  const exEl = $('#explorer3d');
  if (!webglOK()) {
    for (const el of [heroEl, exEl]) el.classList.add('no-webgl');
    return;
  }
  const { HeroViewer, ExplorerViewer } = await import('./engine3d.js');
  new HeroViewer(heroEl);

  const info = $('#ex-info');
  const ex = new ExplorerViewer(exEl, {
    hotspotLayer: $('#hotspots'),
    onSelect: (h) => {
      info.innerHTML = '';
      const t = document.createElement('strong'); t.textContent = h.name;
      const p = document.createElement('p'); p.textContent = h.text;
      info.append(t, p);
    },
  });

  const setVersion = (v) => {
    ex.setVersion(v);
    $$('[data-version]').forEach((b) => b.setAttribute('aria-pressed', String(+b.dataset.version === v)));
    const d = VERSIONS[v];
    $('#st-thrust').textContent = `${d.thrust} tf`;
    $('#st-mass').textContent = `${d.mass.toLocaleString('en-US')} kg`;
    $('#st-total').textContent = `${d.total.toLocaleString('en-US')} kg`;
    $('#st-thrust-bar').style.width = `${(d.thrust / 280) * 100}%`;
    $('#st-mass-bar').style.width = `${(d.mass / 3630) * 100}%`;
    $('#st-total-bar').style.width = `${(d.total / 3630) * 100}%`;
    $('#ex-shield-note').textContent = v === 3 ? 'Raptor 3 needs no heat shield: nothing fragile is left on the outside.' : 'Raptor 1 and 2 needed a heat shield on the ship side to protect all that plumbing from the exhaust.';
  };
  $$('[data-version]').forEach((b) => b.addEventListener('click', () => setVersion(+b.dataset.version)));
  setVersion(3);

  const tog = (id, fn) => {
    const el = $(id);
    const apply = () => fn(el.checked);
    el.addEventListener('change', apply);
    apply();
  };
  tog('#ex-flow', (on) => ex.setFlow(on));
  tog('#ex-fire', (on) => ex.setFire(on));
  tog('#ex-shield', (on) => ex.setShield(on));
  tog('#ex-labels', (on) => ex.setLabels(on));
  const exp = $('#ex-explode');
  exp.addEventListener('input', () => ex.setExplode(exp.value / 100));

  // links in the text that drive the explorer
  $$('[data-show-version]').forEach((a) => a.addEventListener('click', (e) => {
    e.preventDefault();
    setVersion(+a.dataset.showVersion);
    $('#explorer').scrollIntoView({ behavior: 'smooth', block: 'start' });
  }));
}

init3D().catch((err) => {
  console.error(err);
  for (const el of $$('#hero3d, #explorer3d')) el.classList.add('no-webgl');
});
