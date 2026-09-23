// Step-by-step 2D schematic. Each stage is a pure function of (params, time)
// that returns a map of elements; the renderer eases every element toward its
// target, so parts glide, fade in and pipes "draw themselves" between stages.

let TEXT_SCALE = 1;

export const W = 480;
export const H = 700;

// ---------------------------------------------------------------- geometry

const FX = 120; // fuel column
const OX = 360; // oxidizer column
const CX = 240; // engine axis

const ENGINE = { cx: CX, top: 390, chamberH: 70, chamberW: 84, throatW: 36, exitY: 600, exitW: 180, plume: 1, cold: 0 };
const FUEL_TANK = { x: 60, y: 24, w: 120, h: 110 };
const OX_TANK = { x: 300, y: 24, w: 120, h: 110 };

const pt = (x, y) => [x, y];

function tank(base, fluid, label, sub, wall = 2) {
  return { type: 'tank', ...base, fluid, label, sub, wall, level: 0.72 };
}

function lbl(x, y, text, o = {}) {
  return { type: 'label', x, y, text, align: 'center', size: 12, weight: 500, tone: 'muted', ...o };
}

function pipe(pts, fluid, o = {}) {
  return { type: 'pipe', pts, fluid, w: 4, speed: 60, gap: 14, ...o };
}

// Points hugging the outside of the nozzle, from (near) the exit up to the chamber.
function nozzleWallPath(e, side, off = 7) {
  const s = side; // -1 left, +1 right
  const pts = [];
  const tw = e.throatW / 2, ew = e.exitW / 2;
  const throatY = e.top + e.chamberH + 14;
  // bell: bezier from throat to exit, sampled in reverse (exit -> throat)
  const p0 = [e.cx + s * tw, throatY];
  const p1 = [e.cx + s * (tw + 10), throatY + 26];
  const p2 = [e.cx + s * (ew - 12), e.exitY - 64];
  const p3 = [e.cx + s * ew, e.exitY];
  for (let i = 12; i >= 0; i--) {
    const t = i / 12;
    const x = bez(p0[0], p1[0], p2[0], p3[0], t);
    const y = bez(p0[1], p1[1], p2[1], p3[1], t);
    pts.push([x + s * off, y]);
  }
  pts.push([e.cx + s * (e.chamberW / 2 + off), e.top + e.chamberH]);
  pts.push([e.cx + s * (e.chamberW / 2 + off), e.top + 6]);
  return pts;
}

function bez(a, b, c, d, t) {
  const u = 1 - t;
  return u * u * u * a + 3 * u * u * t * b + 3 * u * t * t * c + t * t * t * d;
}

// ---------------------------------------------------------------- physics toys

// Mixture 0 (all fuel) .. 0.5 (balanced) .. 1 (all oxygen) -> rough gas temperature in C.
export function mixtureTemp(m) {
  const peak = 3300, floor = 500;
  const k = Math.exp(-Math.pow((m - 0.5) / 0.13, 2));
  return floor + (peak - floor) * k;
}

export const TURBINE_OK_C = 900;

// Thin-wall hoop stress estimate for a 9 m steel tank that has to sit 25% above chamber pressure.
export function wallThicknessMm(chamberBar) {
  const P = chamberBar * 1.25 * 1e5; // Pa
  const r = 4.5; // m
  const sigma = 500e6; // Pa, cryogenic stainless, no safety factor
  return (P * r / sigma) * 1000;
}

// ---------------------------------------------------------------- stages

export const STAGES = [
  // 0: cold gas thruster
  (p) => {
    const s = p.pressure ?? 0.6;
    return {
      tankG: { type: 'tank', x: 170, y: 30, w: 140, h: 210, fluid: 'gas', label: 'Pressurized gas', sub: 'e.g. nitrogen', wall: 2 + s * 4, level: 1 },
      pG: pipe([pt(CX, 240), pt(CX, 318)], 'gas', { speed: 30 + 170 * s, w: 4 }),
      valve: { type: 'valve', x: CX, y: 280 },
      engine: { type: 'engine', cx: CX, top: 318, chamberH: 6, chamberW: 16, throatW: 10, exitY: 392, exitW: 66, plume: 0.15 + 0.85 * s, cold: 1 },
      lNoz: lbl(CX + 74, 364, 'Nozzle', { align: 'left' }),
      lVal: lbl(CX + 20, 284, 'Valve', { align: 'left' }),
    };
  },

  // 1: pressure-fed bipropellant
  (p, t) => {
    const pc = p.chamberBar ?? 60;
    const wall = Math.min(3 + (pc / 350) * 24, 40);
    const tankBar = Math.round(pc * 1.25);
    const els = {
      tankF: tank(FUEL_TANK, 'fuel', 'Methane', `~${tankBar} bar`, wall),
      tankO: tank(OX_TANK, 'ox', 'Liquid oxygen', `~${tankBar} bar`, wall),
      fMain: pipe([pt(FX, 134), pt(FX, 340), pt(216, 340), pt(216, ENGINE.top)], 'fuel'),
      oMain: pipe([pt(OX, 134), pt(OX, 340), pt(264, 340), pt(264, ENGINE.top)], 'ox'),
      engine: { type: 'engine', ...ENGINE },
      lChamber: lbl(CX, 430, 'Chamber', { tone: 'ink', size: 11 }),
      lTankRule: lbl(CX, 186, 'tank pressure  >  chamber pressure', { size: 12, tone: 'ink', weight: 600 }),
    };
    const bf = p.backflowAt ? (t - p.backflowAt) : -1;
    if (bf >= 0 && bf < 3.4) {
      const k = Math.min(1, bf / 1.2);
      els.fMain.speed = 0; els.oMain.speed = 0;
      els.engine.plume = 0.15;
      els.fireF = pipe([pt(216, ENGINE.top), pt(216, 340), pt(FX, 340), pt(FX, 134)], 'fire', { w: 6, speed: 150, clip: k });
      els.fireO = pipe([pt(264, ENGINE.top), pt(264, 340), pt(OX, 340), pt(OX, 134)], 'fire', { w: 6, speed: 150, clip: k });
      els.lTankRule = lbl(CX, 186, 'chamber wins: flame runs up the lines', { size: 12, tone: 'danger', weight: 700 });
    }
    return els;
  },

  // 2: pumps
  (p, t) => {
    const els = {
      tankF: tank(FUEL_TANK, 'fuel', 'Methane', 'low pressure, light'),
      tankO: tank(OX_TANK, 'ox', 'Liquid oxygen', 'low pressure, light'),
      fMain: pipe([pt(FX, 134), pt(FX, 340), pt(216, 340), pt(216, ENGINE.top)], 'fuel', { speed: 90 }),
      oMain: pipe([pt(OX, 134), pt(OX, 340), pt(264, 340), pt(264, ENGINE.top)], 'ox', { speed: 90 }),
      pumpF: { type: 'pump', x: FX, y: 200, r: 22, spin: 1 },
      pumpO: { type: 'pump', x: OX, y: 200, r: 22, spin: 1 },
      engine: { type: 'engine', ...ENGINE },
      lPumpF: lbl(FX - 30, 204, 'Pump', { align: 'right' }),
      lPumpO: lbl(OX + 30, 204, 'Pump', { align: 'left' }),
      shaftF: { type: 'shaft', x1: FX + 22, y1: 200, x2: 176, y2: 200, spin: 1 },
      shaftO: { type: 'shaft', x1: OX - 22, y1: 200, x2: 304, y2: 200, spin: 1 },
    };
    if (p.battery) {
      const charge = 1 - ((t * 0.22) % 1);
      els.powF = { type: 'battery', x: 176, y: 182, w: 44, h: 36, charge };
      els.powO = { type: 'battery', x: 260, y: 182, w: 44, h: 36, charge };
      els.lPow = lbl(CX, 244, 'batteries + electric motors', { size: 11 });
    } else {
      els.powF = { type: 'box', x: 176, y: 182, w: 44, h: 36, text: '?' };
      els.powO = { type: 'box', x: 260, y: 182, w: 44, h: 36, text: '?' };
      els.lPow = lbl(CX, 244, 'what spins these?', { size: 11 });
    }
    return els;
  },

  // 3: gas generator
  (p) => {
    const m = p.mixture ?? 0.12;
    const temp = mixtureTemp(m);
    const heat = Math.min(1, Math.max(0, (temp - 500) / 2800));
    const melting = temp > TURBINE_OK_C;
    return {
      tankF: tank(FUEL_TANK, 'fuel', 'Methane', 'low pressure'),
      tankO: tank(OX_TANK, 'ox', 'Liquid oxygen', 'low pressure'),
      fMain: pipe([pt(FX, 134), pt(FX, 340), pt(216, 340), pt(216, ENGINE.top)], 'fuel', { speed: 90 }),
      oMain: pipe([pt(OX, 134), pt(OX, 340), pt(264, 340), pt(264, ENGINE.top)], 'ox', { speed: 90 }),
      pumpF: { type: 'pump', x: FX, y: 200, r: 22, spin: 1 },
      pumpO: { type: 'pump', x: OX, y: 200, r: 22, spin: 1 },
      shaft: { type: 'shaft', x1: FX + 22, y1: 200, x2: OX - 22, y2: 200, spin: 1 },
      turb: { type: 'turbine', x: CX, y: 200, r: 22, spin: 1.3, heat, melting },
      gg: { type: 'burner', x: CX - 14, y: 124, w: 28, h: 44, kind: 'gg', mix: m },
      gF: pipe([pt(FX, 262), pt(186, 262), pt(186, 146), pt(CX - 14, 146)], 'fuel', { w: 2.5, speed: 50, gap: 16 }),
      gO: pipe([pt(OX, 262), pt(294, 262), pt(294, 146), pt(CX + 14, 146)], 'ox', { w: 2.5, speed: 50, gap: 16 }),
      ggT: pipe([pt(CX, 168), pt(CX, 178)], 'fuelgas', { w: 5, speed: 40 }),
      dump: pipe([pt(CX, 222), pt(CX, 300), pt(336, 300), pt(336, 548)], 'smoke', { w: 5, speed: 70, gap: 12 }),
      dumpOut: { type: 'dump', x: 336, y: 548, len: 1 },
      engine: { type: 'engine', ...ENGINE },
      lGG: lbl(CX, 112, 'Gas generator', { tone: 'ink', weight: 600 }),
      lTurb: lbl(CX, 238 + 16, melting ? 'turbine melting!' : 'Turbine', { tone: melting ? 'danger' : 'ink', weight: melting ? 700 : 500 }),
      lDump: lbl(348, 520, 'dumped', { align: 'left', size: 11 }),
      lDump2: lbl(348, 534, 'overboard', { align: 'left', size: 11 }),
    };
  },

  // 4: staged combustion (single oxygen-rich preburner, one shaft)
  () => ({
    tankF: tank(FUEL_TANK, 'fuel', 'Methane', 'low pressure'),
    tankO: tank(OX_TANK, 'ox', 'Liquid oxygen', 'low pressure'),
    fMain: pipe([pt(FX, 134), pt(FX, 340), pt(216, 340), pt(216, ENGINE.top)], 'fuel', { speed: 90 }),
    oAll: pipe([pt(OX, 134), pt(OX, 262), pt(294, 262), pt(294, 146), pt(CX + 18, 146)], 'ox', { speed: 90, w: 5 }),
    pumpF: { type: 'pump', x: FX, y: 200, r: 22, spin: 1.3 },
    pumpO: { type: 'pump', x: OX, y: 200, r: 22, spin: 1.3 },
    shaft: { type: 'shaft', x1: FX + 22, y1: 200, x2: OX - 22, y2: 200, spin: 1.3 },
    turb: { type: 'turbine', x: CX, y: 200, r: 22, spin: 1.6, heat: 0.25 },
    gg: { type: 'burner', x: CX - 18, y: 118, w: 36, h: 52, kind: 'or' },
    gF: pipe([pt(FX, 262), pt(186, 262), pt(186, 146), pt(CX - 18, 146)], 'fuel', { w: 2.5, speed: 50, gap: 16 }),
    ggT: pipe([pt(CX, 170), pt(CX, 178)], 'oxgas', { w: 6, speed: 40 }),
    hotO: pipe([pt(CX, 222), pt(CX, ENGINE.top)], 'oxgas', { w: 7, speed: 90, gap: 12 }),
    engine: { type: 'engine', ...ENGINE },
    lGG: lbl(CX, 106, 'Preburner', { tone: 'ink', weight: 600 }),
    lAllO: lbl(OX + 8, 290, 'all the oxygen', { align: 'left', size: 11 }),
    lBitF: lbl(FX - 8, 290, 'a little fuel', { align: 'right', size: 11 }),
    lHot: lbl(CX + 12, 312, 'hot, oxygen-rich gas', { align: 'left', size: 11 }),
  }),

  // 5: full flow
  (p) => fullFlow(p, false),

  // 6: full flow + plumbing layers
  (p, t) => fullFlow(p, true, t),
];

function fullFlow(p, extras, t = 0) {
  const regen = extras && p.regen;
  const els = {
    tankF: tank(FUEL_TANK, 'fuel', 'Methane', 'low pressure'),
    tankO: tank(OX_TANK, 'ox', 'Liquid oxygen', 'low pressure'),
    pumpF: { type: 'pump', x: FX, y: 200, r: 22, spin: 1.5 },
    pumpO: { type: 'pump', x: OX, y: 200, r: 22, spin: 1.5 },
    // ox side (gliding in from the single-shaft layout)
    shaft: { type: 'shaft', x1: OX, y1: 222, x2: OX, y2: 248, spin: 1.5 },
    turb: { type: 'turbine', x: OX, y: 268, r: 20, spin: 1.8, heat: 0.18 },
    gg: { type: 'burner', x: 414, y: 244, w: 28, h: 48, kind: 'or' },
    oAll5: pipe([pt(OX, 134), pt(OX, 200), pt(428, 200), pt(428, 244)], 'ox', { speed: 90, w: 5 }),
    ggT: pipe([pt(414, 268), pt(380, 268)], 'oxgas', { w: 6, speed: 40 }),
    hotO5: pipe([pt(OX, 288), pt(OX, 340), pt(264, 340), pt(264, ENGINE.top)], 'oxgas', { w: 7, speed: 90, gap: 12 }),
    // fuel side (new)
    shaftF2: { type: 'shaft', x1: FX, y1: 222, x2: FX, y2: 248, spin: 1.5 },
    turbF: { type: 'turbine', x: FX, y: 268, r: 20, spin: 1.8, heat: 0.18 },
    pbF: { type: 'burner', x: 38, y: 244, w: 28, h: 48, kind: 'fr' },
    pbFT: pipe([pt(66, 268), pt(100, 268)], 'fuelgas', { w: 6, speed: 40 }),
    hotF: pipe([pt(FX, 288), pt(FX, 340), pt(216, 340), pt(216, ENGINE.top)], 'fuelgas', { w: 7, speed: 90, gap: 12 }),
    // the "little bit of the other one"
    xF: pipe([pt(80, 200), pt(80, 232), pt(436, 232), pt(436, 244)], 'fuel', { w: 2.2, speed: 60, gap: 18 }),
    xO: pipe([pt(400, 200), pt(400, 238), pt(44, 238), pt(44, 244)], 'ox', { w: 2.2, speed: 60, gap: 18 }),
    engine: { type: 'engine', ...ENGINE },
    lPbF: lbl(52, 312, 'fuel-rich', { size: 11, tone: 'ink', weight: 600 }),
    lPbF2: lbl(52, 326, 'preburner', { size: 11, tone: 'ink', weight: 600 }),
    lPbO: lbl(428, 312, 'oxygen-rich', { size: 11, tone: 'ink', weight: 600 }),
    lPbO2: lbl(428, 326, 'preburner', { size: 11, tone: 'ink', weight: 600 }),
    lTurbF: lbl(FX + 26, 272, 'turbine', { align: 'left', size: 11 }),
    lTurbO: lbl(OX - 26, 272, 'turbine', { align: 'right', size: 11 }),
    lGas: lbl(CX, 428, 'gas meets gas', { size: 11, tone: 'ink', weight: 600 }),
  };
  if (!regen) {
    els.fAll5 = pipe([pt(FX, 134), pt(FX, 200), pt(52, 200), pt(52, 244)], 'fuel', { speed: 90, w: 5 });
  } else {
    const e = ENGINE;
    const wall = nozzleWallPath(e, -1);
    els.fAll5r = pipe([pt(FX, 134), pt(FX, 200), pt(22, 200), pt(22, wall[0][1]), wall[0], ...wall.slice(1), pt(e.cx - e.chamberW / 2 - 7, 372), pt(52, 372), pt(52, 292)], 'fuel', { speed: 120, w: 4, gap: 12 });
    const wallR = nozzleWallPath(e, 1);
    els.regenR = pipe(wallR, 'fuel', { speed: 90, w: 3, gap: 14 });
    els.lRegen = lbl(346, 566, 'methane cools', { align: 'left', size: 11, tone: 'ink', weight: 600 });
    els.lRegen2 = lbl(346, 580, 'the nozzle walls', { align: 'left', size: 11 });
    els.engine = { ...els.engine, regen: 1 };
  }
  if (extras && (p.regen || p.purge)) { delete els.lPbF; delete els.lPbF2; }
  if (extras && p.press) {
    els.prF = pipe([pt(38, 256), pt(10, 256), pt(10, 12), pt(FX, 12), pt(FX, 24)], 'fuelvap', { w: 2, speed: 45, gap: 16 });
    els.prO = pipe([pt(442, 256), pt(470, 256), pt(470, 12), pt(OX, 12), pt(OX, 24)], 'oxvap', { w: 2, speed: 45, gap: 16 });
    els.lPr = lbl(CX, 16, 'warm gas back to the tanks', { size: 11 });
  }
  if (extras && p.igniters) {
    els.spF = { type: 'spark', x: 52, y: 252, t };
    els.spO = { type: 'spark', x: 428, y: 252, t: t + 0.37 };
    els.spC = { type: 'spark', x: CX, y: ENGINE.top + 18, t: t + 0.71 };
    els.lSp = lbl(CX + 50, ENGINE.top + 50, 'igniters', { align: 'left', size: 11, tone: 'ink', weight: 600 });
  }
  if (extras && p.purge) {
    els.n2 = { type: 'box', x: 360, y: 470, w: 68, h: 34, text: 'N₂', small: 'purge / spin-up' };
    els.n2L = { type: 'box', x: 70, y: 520, w: 56, h: 30, text: 'N₂' };
    els.pu1 = pipe([pt(428, 487), pt(468, 487), pt(468, 280), pt(442, 280)], 'purge', { w: 1.8, speed: 30, gap: 20, dash: 1 });
    els.pu2 = pipe([pt(360, 487), pt(300, 487), pt(300, 420), pt(282, 420)], 'purge', { w: 1.8, speed: 30, gap: 20, dash: 1 });
    els.pu3 = pipe([pt(70, 535), pt(46, 535), pt(46, 292)], 'purge', { w: 1.8, speed: 30, gap: 20, dash: 1 });
    els.sens = { type: 'sensors', pts: [[FX + 18, 188], [OX - 18, 188], [FX - 16, 282], [OX + 16, 282], [CX - 30, 405], [CX + 30, 405], [52, 244], [428, 244], [210, 560], [276, 530]] };
  }
  return els;
}

export const STAGE_TITLES = [
  'Cold gas thruster',
  'Pressure-fed engine',
  'Pump-fed engine',
  'Gas generator cycle',
  'Staged combustion',
  'Full-flow staged combustion',
  'Full flow, with the plumbing',
];

// ---------------------------------------------------------------- renderer

const NUM_KEYS = ['x', 'y', 'w', 'h', 'r', 'x1', 'y1', 'x2', 'y2', 'wall', 'level', 'cx', 'top', 'chamberH', 'chamberW', 'throatW', 'exitY', 'exitW', 'plume', 'cold', 'heat', 'spin', 'speed', 'clip', 'charge', 'regen', 'mix', 'len'];

export class Schematic {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.stage = 0;
    this.params = {};
    this.cur = {};
    this.time = 0;
    this.phase = {}; // per pipe particle offset (px)
    this.running = false;
    this.reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
    this.colors = null;
    this.resize();
    new ResizeObserver(() => this.resize()).observe(canvas);
    matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => { this.colors = null; });
    const io = new IntersectionObserver((es) => { this.visible = es[0].isIntersecting; if (this.visible) this.start(); }, { rootMargin: '100px' });
    io.observe(canvas);
    document.addEventListener('visibilitychange', () => { if (!document.hidden) this.start(); });
    this.snap = true;
  }

  resize() {
    const r = this.canvas.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.canvas.width = Math.max(1, Math.round(r.width * dpr));
    this.canvas.height = Math.max(1, Math.round(r.height * dpr));
    this.scale = Math.min(this.canvas.width / W, this.canvas.height / H);
    this.ox = (this.canvas.width - W * this.scale) / 2;
    this.oy = (this.canvas.height - H * this.scale) / 2;
  }

  setStage(i) { this.stage = i; this.start(); }
  set(k, v) { this.params[k] = v; this.start(); }

  start() {
    if (this.running) return;
    this.running = true;
    this.last = performance.now();
    const loop = (now) => {
      if (!this.visible || document.hidden) { this.running = false; return; }
      const dt = Math.min(0.1, (now - this.last) / 1000);
      this.last = now;
      this.time += dt;
      this.step(dt);
      this.draw();
      requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);
  }

  step(dt) {
    const target = STAGES[this.stage](this.params, this.time);
    const k = this.snap ? 1 : 1 - Math.exp(-dt * 7);
    this.snap = false;
    for (const id in target) {
      const tg = target[id];
      let c = this.cur[id];
      if (!c || c.type !== tg.type) {
        c = this.cur[id] = { ...tg, alpha: 0, grow: tg.type === 'pipe' ? 0 : 1 };
        if (tg.pts) c.pts = tg.pts.map((q) => q.slice());
      }
      for (const key in tg) {
        const v = tg[key];
        if (NUM_KEYS.includes(key) && typeof v === 'number' && typeof c[key] === 'number') c[key] += (v - c[key]) * k;
        else if (key === 'pts') {
          if (c.pts.length === v.length) c.pts.forEach((q, i) => { q[0] += (v[i][0] - q[0]) * k; q[1] += (v[i][1] - q[1]) * k; });
          else c.pts = v.map((q) => q.slice());
        } else c[key] = v;
      }
      c.alpha += (1 - c.alpha) * k;
      if (c.type === 'pipe') c.grow = Math.min(1, c.grow + dt * 1.6);
    }
    for (const id in this.cur) {
      const c = this.cur[id];
      if (!(id in target)) {
        c.alpha += (0 - c.alpha) * k * 1.4;
        if (c.alpha < 0.02) delete this.cur[id];
      }
      if (c.type === 'pipe') {
        const sp = this.reduced ? c.speed * 0.25 : c.speed;
        this.phase[id] = ((this.phase[id] || 0) + sp * dt);
      }
    }
  }

  palette() {
    if (this.colors) return this.colors;
    const cs = getComputedStyle(document.documentElement);
    const v = (n) => cs.getPropertyValue(n).trim();
    this.colors = {
      bg: v('--fig-bg'), ink: v('--ink'), muted: v('--muted'), line: v('--rule'), panel: v('--fig-panel'), steel: v('--steel'),
      fuel: v('--fuel'), ox: v('--ox'), fuelgas: v('--fuelgas'), oxgas: v('--oxgas'), gas: v('--coldgas'), danger: v('--danger'),
      fire: '#ff6a1a', smoke: v('--smoke'), purge: v('--purge'), fuelvap: v('--fuel'), oxvap: v('--ox'),
    };
    return this.colors;
  }

  draw() {
    const { ctx, canvas } = this;
    const C = this.palette();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.setTransform(this.scale, 0, 0, this.scale, this.ox, this.oy);
    // keep labels readable when the figure is small (phones)
    const cssScale = this.scale / Math.min(window.devicePixelRatio || 1, 2);
    TEXT_SCALE = Math.max(1, Math.min(1.5, 0.82 / cssScale));
    const order = ['engine', 'dump', 'pipe', 'shaft', 'tank', 'valve', 'burner', 'pump', 'turbine', 'box', 'battery', 'spark', 'sensors', 'label'];
    const items = Object.entries(this.cur).sort((a, b) => order.indexOf(a[1].type) - order.indexOf(b[1].type));
    // pipe halos first so crossings read as over/under
    for (const [id, e] of items) {
      ctx.globalAlpha = Math.max(0, Math.min(1, e.alpha));
      const fn = DRAW[e.type];
      if (fn) fn(ctx, e, C, this.time, this.phase[id] || 0);
    }
    ctx.globalAlpha = 1;
  }
}

// ---------------------------------------------------------------- drawing

function polyLength(pts) {
  let L = 0;
  for (let i = 1; i < pts.length; i++) L += Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]);
  return L;
}

function pointAt(pts, s) {
  for (let i = 1; i < pts.length; i++) {
    const a = pts[i - 1], b = pts[i];
    const l = Math.hypot(b[0] - a[0], b[1] - a[1]);
    if (s <= l) { const t = l ? s / l : 0; return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t]; }
    s -= l;
  }
  return pts[pts.length - 1];
}

function tracePartial(ctx, pts, upto) {
  ctx.beginPath();
  ctx.moveTo(pts[0][0], pts[0][1]);
  let s = upto;
  for (let i = 1; i < pts.length; i++) {
    const a = pts[i - 1], b = pts[i];
    const l = Math.hypot(b[0] - a[0], b[1] - a[1]);
    if (s >= l) { ctx.lineTo(b[0], b[1]); s -= l; } else { const t = l ? s / l : 0; ctx.lineTo(a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t); break; }
  }
}

function roundRect(ctx, x, y, w, h, r) {
  r = Math.max(0, Math.min(r, w / 2, h / 2));
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function hexA(hex, a) {
  if (!hex || hex[0] !== '#') return hex;
  let h = hex.slice(1);
  if (h.length === 3) h = h.split('').map((c) => c + c).join('');
  const n = parseInt(h, 16);
  return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${a})`;
}

function text(ctx, s, x, y, o, C) {
  ctx.font = `${o.weight || 500} ${(o.size || 12) * TEXT_SCALE}px Geist, ui-sans-serif, system-ui, sans-serif`;
  ctx.textAlign = o.align || 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = o.tone === 'ink' ? C.ink : o.tone === 'danger' ? C.danger : C.muted;
  ctx.fillText(s, x, y);
}

const DRAW = {
  label(ctx, e, C) {
    // soft background so labels stay legible over pipes
    ctx.save();
    const fs = (e.size || 12) * TEXT_SCALE;
    ctx.font = `${e.weight || 500} ${fs}px Geist, ui-sans-serif, system-ui, sans-serif`;
    const w = ctx.measureText(e.text).width;
    const x0 = e.align === 'left' ? e.x : e.align === 'right' ? e.x - w : e.x - w / 2;
    ctx.fillStyle = hexA(C.bg, 0.85);
    ctx.fillRect(x0 - 3, e.y - fs / 2 - 2, w + 6, fs + 4);
    ctx.restore();
    text(ctx, e.text, e.x, e.y, e, C);
  },

  tank(ctx, e, C, t) {
    const r = Math.min(26, e.w / 2);
    // liquid / gas fill
    ctx.save();
    roundRect(ctx, e.x, e.y, e.w, e.h, r);
    ctx.fillStyle = C.panel;
    ctx.fill();
    ctx.clip();
    const col = C[e.fluid] || C.gas;
    if (e.fluid === 'gas') {
      ctx.fillStyle = hexA(col, 0.12);
      ctx.fillRect(e.x, e.y, e.w, e.h);
      ctx.fillStyle = hexA(col, 0.55);
      for (let i = 0; i < 46; i++) {
        const px = e.x + 12 + ((Math.sin(i * 12.9898) * 43758.5453) % 1 + 1) % 1 * (e.w - 24);
        const py = e.y + 12 + ((Math.sin(i * 78.233) * 12345.678) % 1 + 1) % 1 * (e.h - 24);
        const j = 2.5 + (e.wall - 2) * 0.8;
        ctx.beginPath();
        ctx.arc(px + Math.sin(t * 5 + i) * j, py + Math.cos(t * 4.3 + i * 1.7) * j, 2, 0, Math.PI * 2);
        ctx.fill();
      }
    } else {
      const ly = e.y + e.h * (1 - e.level);
      ctx.fillStyle = hexA(col, 0.2);
      ctx.fillRect(e.x, ly, e.w, e.h);
      ctx.strokeStyle = hexA(col, 0.6);
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      for (let x = e.x; x <= e.x + e.w; x += 4) ctx.lineTo(x, ly + Math.sin(x * 0.12 + t * 2) * 1.2);
      ctx.stroke();
    }
    ctx.restore();
    // wall
    const wall = Math.max(1.5, e.wall);
    ctx.lineWidth = wall;
    ctx.strokeStyle = C.steel;
    roundRect(ctx, e.x + wall / 2, e.y + wall / 2, e.w - wall, e.h - wall, r - wall / 2);
    ctx.stroke();
    ctx.lineWidth = 1;
    ctx.strokeStyle = hexA(C.ink, 0.5);
    roundRect(ctx, e.x, e.y, e.w, e.h, r);
    ctx.stroke();
    const ts = TEXT_SCALE;
    TEXT_SCALE = Math.min(ts, 1.2); // tank labels must fit inside the tank
    text(ctx, e.label, e.x + e.w / 2, e.y + Math.max(24, wall + 16), { tone: 'ink', weight: 600, size: 12 }, C);
    if (e.sub) text(ctx, e.sub, e.x + e.w / 2, e.y + Math.max(24, wall + 16) + 16 * TEXT_SCALE, { size: 11 }, C);
    TEXT_SCALE = ts;
  },

  pipe(ctx, e, C, t, phase) {
    const col = C[e.fluid] || C.gas;
    const L = polyLength(e.pts);
    const upto = L * (e.grow ?? 1) * (e.clip ?? 1);
    if (upto < 0.5) return;
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';
    // halo
    tracePartial(ctx, e.pts, upto);
    ctx.strokeStyle = C.bg;
    ctx.lineWidth = e.w + 4;
    ctx.stroke();
    // tube
    tracePartial(ctx, e.pts, upto);
    ctx.strokeStyle = hexA(col, e.fluid === 'fire' ? 0.55 : e.fluid === 'gas' ? 0.4 : 0.28);
    ctx.lineWidth = e.w;
    if (e.dash) ctx.setLineDash([5, 4]);
    ctx.stroke();
    ctx.setLineDash([]);
    // particles
    const gas = /gas|smoke|vap|fire|purge/.test(e.fluid);
    const gap = e.gap || 14;
    const off = ((phase % gap) + gap) % gap;
    ctx.fillStyle = col;
    for (let s = off; s < upto; s += gap) {
      const [x, y] = pointAt(e.pts, s);
      ctx.beginPath();
      const rad = gas ? Math.max(1.4, e.w * 0.42) : Math.max(1.2, e.w * 0.36);
      if (gas) ctx.globalAlpha *= 0.85;
      ctx.arc(x, y, rad, 0, Math.PI * 2);
      ctx.fill();
      if (gas) ctx.globalAlpha /= 0.85;
    }
  },

  shaft(ctx, e, C, t) {
    ctx.lineCap = 'butt';
    ctx.strokeStyle = C.steel;
    ctx.lineWidth = 6;
    ctx.beginPath(); ctx.moveTo(e.x1, e.y1); ctx.lineTo(e.x2, e.y2); ctx.stroke();
    ctx.strokeStyle = hexA(C.ink, 0.45);
    ctx.lineWidth = 6;
    ctx.setLineDash([2, 6]);
    ctx.lineDashOffset = -t * 60 * (e.spin || 1);
    ctx.beginPath(); ctx.moveTo(e.x1, e.y1); ctx.lineTo(e.x2, e.y2); ctx.stroke();
    ctx.setLineDash([]);
    ctx.lineDashOffset = 0;
  },

  valve(ctx, e, C) {
    ctx.fillStyle = C.panel;
    ctx.strokeStyle = C.ink;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(e.x - 10, e.y - 7); ctx.lineTo(e.x + 10, e.y + 7); ctx.lineTo(e.x + 10, e.y - 7); ctx.lineTo(e.x - 10, e.y + 7); ctx.closePath();
    ctx.fill(); ctx.stroke();
  },

  pump(ctx, e, C, t) {
    ctx.fillStyle = C.panel;
    ctx.strokeStyle = C.ink;
    ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.arc(e.x, e.y, e.r, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    const a0 = t * 6 * (e.spin || 1);
    ctx.strokeStyle = hexA(C.ink, 0.7);
    ctx.lineWidth = 1.6;
    for (let i = 0; i < 6; i++) {
      const a = a0 + (i * Math.PI) / 3;
      ctx.beginPath();
      ctx.moveTo(e.x + Math.cos(a) * 4, e.y + Math.sin(a) * 4);
      ctx.quadraticCurveTo(e.x + Math.cos(a + 0.5) * e.r * 0.6, e.y + Math.sin(a + 0.5) * e.r * 0.6, e.x + Math.cos(a + 0.9) * (e.r - 4), e.y + Math.sin(a + 0.9) * (e.r - 4));
      ctx.stroke();
    }
    ctx.fillStyle = C.ink;
    ctx.beginPath(); ctx.arc(e.x, e.y, 3, 0, Math.PI * 2); ctx.fill();
  },

  turbine(ctx, e, C, t) {
    const heat = e.heat || 0;
    const shake = e.melting ? Math.sin(t * 60) * 1.5 : 0;
    const x = e.x + shake;
    const hot = `rgba(${Math.round(120 + 135 * heat)},${Math.round(90 + 40 * (1 - heat))},${Math.round(60 * (1 - heat))},${0.15 + 0.6 * heat})`;
    ctx.fillStyle = C.panel;
    ctx.beginPath(); ctx.arc(x, e.y, e.r, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = hot;
    ctx.beginPath(); ctx.arc(x, e.y, e.r, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = e.melting ? C.danger : C.ink;
    ctx.lineWidth = e.melting ? 2.5 : 1.5;
    ctx.stroke();
    const a0 = -t * 8 * (e.spin || 1);
    ctx.strokeStyle = hexA(C.ink, 0.75);
    ctx.lineWidth = 1.4;
    for (let i = 0; i < 12; i++) {
      const a = a0 + (i * Math.PI) / 6;
      ctx.beginPath();
      ctx.moveTo(x + Math.cos(a) * 6, e.y + Math.sin(a) * 6);
      ctx.lineTo(x + Math.cos(a + 0.35) * (e.r - 3), e.y + Math.sin(a + 0.35) * (e.r - 3));
      ctx.stroke();
    }
  },

  burner(ctx, e, C, t) {
    const flick = 0.75 + 0.25 * Math.sin(t * 31) * Math.sin(t * 17.3);
    let col;
    if (e.kind === 'or') col = C.oxgas;
    else if (e.kind === 'fr') col = C.fuelgas;
    else {
      // gas generator: color follows the mixture slider
      const m = e.mix ?? 0.1;
      const k = Math.exp(-Math.pow((m - 0.5) / 0.13, 2));
      col = k > 0.5 ? '#fff4c2' : m < 0.5 ? C.fuelgas : C.oxgas;
    }
    ctx.fillStyle = C.panel;
    roundRect(ctx, e.x, e.y, e.w, e.h, 9);
    ctx.fill();
    const g = ctx.createRadialGradient(e.x + e.w / 2, e.y + e.h / 2, 1, e.x + e.w / 2, e.y + e.h / 2, e.h * 0.6);
    g.addColorStop(0, hexA(col, 0.95 * flick));
    g.addColorStop(1, hexA(col, 0.12));
    ctx.fillStyle = g;
    roundRect(ctx, e.x, e.y, e.w, e.h, 9);
    ctx.fill();
    ctx.strokeStyle = C.ink;
    ctx.lineWidth = 1.5;
    ctx.stroke();
  },

  engine(ctx, e, C, t) {
    const { cx, top, chamberH: ch, chamberW: cw, throatW: tw, exitY, exitW: ew } = e;
    const throatY = top + ch + 14;
    // plume
    if (e.plume > 0.01) drawPlume(ctx, cx, exitY, ew * 0.92, (e.cold ? 90 : 120) * e.plume + 10, t, e.cold > 0.5, C);
    // body path
    ctx.beginPath();
    ctx.moveTo(cx - cw / 2, top + 10);
    ctx.quadraticCurveTo(cx - cw / 2, top, cx - cw / 2 + 10, top);
    ctx.lineTo(cx + cw / 2 - 10, top);
    ctx.quadraticCurveTo(cx + cw / 2, top, cx + cw / 2, top + 10);
    ctx.lineTo(cx + cw / 2, top + ch);
    ctx.lineTo(cx + tw / 2, throatY);
    ctx.bezierCurveTo(cx + tw / 2 + 10, throatY + 26, cx + ew / 2 - 12, exitY - 64, cx + ew / 2, exitY);
    ctx.lineTo(cx - ew / 2, exitY);
    ctx.bezierCurveTo(cx - ew / 2 + 12, exitY - 64, cx - tw / 2 - 10, throatY + 26, cx - tw / 2, throatY);
    ctx.lineTo(cx - cw / 2, top + ch);
    ctx.closePath();
    ctx.fillStyle = C.panel;
    ctx.fill();
    // inner glow
    if (!e.cold || e.cold < 0.5) {
      const g = ctx.createLinearGradient(0, top, 0, exitY);
      const f = 0.8 + 0.2 * Math.sin(t * 29);
      g.addColorStop(0, `rgba(255,190,90,${0.55 * f * Math.min(1, e.plume * 1.5)})`);
      g.addColorStop(0.35, `rgba(255,140,60,${0.35 * f * Math.min(1, e.plume * 1.5)})`);
      g.addColorStop(1, 'rgba(255,120,40,0.05)');
      ctx.fillStyle = g;
      ctx.fill();
    }
    ctx.strokeStyle = C.ink;
    ctx.lineWidth = 1.6;
    ctx.stroke();
    if (e.regen > 0.05) {
      ctx.strokeStyle = hexA(C.fuel, 0.6 * e.regen);
      ctx.lineWidth = 3;
      ctx.stroke();
    }
    // injector plate
    if (ch > 30) {
      ctx.strokeStyle = hexA(C.ink, 0.6);
      ctx.lineWidth = 1;
      ctx.setLineDash([2, 3]);
      ctx.beginPath(); ctx.moveTo(cx - cw / 2 + 6, top + 8); ctx.lineTo(cx + cw / 2 - 6, top + 8); ctx.stroke();
      ctx.setLineDash([]);
    }
  },

  dump(ctx, e, C, t) {
    for (let i = 0; i < 7; i++) {
      const k = ((t * 0.9 + i / 7) % 1);
      const y = e.y + k * 110;
      const x = e.x + Math.sin(i * 3 + t * 2) * 6 * k;
      ctx.fillStyle = hexA(C.smoke, 0.5 * (1 - k));
      ctx.beginPath(); ctx.arc(x, y, 4 + 12 * k, 0, Math.PI * 2); ctx.fill();
    }
  },

  box(ctx, e, C) {
    ctx.fillStyle = C.panel;
    ctx.strokeStyle = hexA(C.ink, 0.6);
    ctx.lineWidth = 1.2;
    ctx.setLineDash([4, 3]);
    roundRect(ctx, e.x, e.y, e.w, e.h, 6);
    ctx.fill(); ctx.stroke();
    ctx.setLineDash([]);
    text(ctx, e.text, e.x + e.w / 2, e.y + e.h / 2 - (e.small ? 5 : 0), { size: e.small ? 13 : 18, weight: 700, tone: 'ink' }, C);
    if (e.small) text(ctx, e.small, e.x + e.w / 2, e.y + e.h / 2 + 10, { size: 9 }, C);
  },

  battery(ctx, e, C) {
    ctx.fillStyle = C.panel;
    ctx.strokeStyle = C.ink;
    ctx.lineWidth = 1.5;
    roundRect(ctx, e.x, e.y, e.w - 4, e.h, 4);
    ctx.fill(); ctx.stroke();
    ctx.fillStyle = C.ink;
    ctx.fillRect(e.x + e.w - 4, e.y + e.h / 2 - 5, 4, 10);
    const c = Math.max(0, Math.min(1, e.charge));
    ctx.fillStyle = c < 0.25 ? C.danger : '#22a06b';
    ctx.fillRect(e.x + 3, e.y + 3, (e.w - 10) * c, e.h - 6);
  },

  spark(ctx, e, C) {
    const ph = (e.t * 2.2) % 1;
    if (ph > 0.35) return;
    const a = 1 - ph / 0.35;
    ctx.strokeStyle = `rgba(250,204,21,${a})`;
    ctx.lineWidth = 2;
    for (let i = 0; i < 6; i++) {
      const ang = (i * Math.PI) / 3 + e.t;
      ctx.beginPath();
      ctx.moveTo(e.x + Math.cos(ang) * 3, e.y + Math.sin(ang) * 3);
      ctx.lineTo(e.x + Math.cos(ang) * 10, e.y + Math.sin(ang) * 10);
      ctx.stroke();
    }
  },

  sensors(ctx, e, C) {
    for (const [x, y] of e.pts) {
      ctx.fillStyle = C.panel;
      ctx.strokeStyle = C.purge;
      ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.arc(x, y, 4.5, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
      ctx.fillStyle = C.purge;
      ctx.beginPath(); ctx.arc(x, y, 1.6, 0, Math.PI * 2); ctx.fill();
    }
  },
};

function drawPlume(ctx, cx, y, w, len, t, cold, C) {
  const flick = 1 + 0.05 * Math.sin(t * 37) + 0.04 * Math.sin(t * 23.3);
  const L = len * flick;
  const g = ctx.createLinearGradient(0, y, 0, y + L);
  if (cold) {
    g.addColorStop(0, hexA(C.gas, 0.45));
    g.addColorStop(1, hexA(C.gas, 0));
  } else {
    g.addColorStop(0, 'rgba(255,250,235,0.95)');
    g.addColorStop(0.25, 'rgba(255,205,110,0.85)');
    g.addColorStop(0.7, 'rgba(255,130,50,0.35)');
    g.addColorStop(1, 'rgba(255,90,30,0)');
  }
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.moveTo(cx - w / 2, y);
  ctx.quadraticCurveTo(cx - w * 0.46, y + L * 0.55, cx - w * 0.06, y + L);
  ctx.lineTo(cx + w * 0.06, y + L);
  ctx.quadraticCurveTo(cx + w * 0.46, y + L * 0.55, cx + w / 2, y);
  ctx.closePath();
  ctx.fill();
  if (!cold && L > 60) {
    for (let i = 0; i < 4; i++) {
      const dy = y + L * (0.14 + i * 0.18);
      const dw = w * 0.22 * (1 - i * 0.16);
      ctx.fillStyle = `rgba(255,255,240,${0.45 - i * 0.09})`;
      ctx.beginPath();
      ctx.moveTo(cx, dy - 9); ctx.lineTo(cx + dw / 2, dy); ctx.lineTo(cx, dy + 9); ctx.lineTo(cx - dw / 2, dy);
      ctx.closePath();
      ctx.fill();
    }
  }
}
