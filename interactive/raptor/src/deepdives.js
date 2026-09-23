// Deep-dive widgets: regenerative cooling and tank pressurization.
import { wallState, tempColor, COPPER_MELT_C, S_THROAT } from './thermal.js';

const css = (n) => getComputedStyle(document.documentElement).getPropertyValue(n).trim();

// Canvas + animation loop that only runs while visible. draw(ctx, t, dt, fs): fs scales text on small screens.
function stage(canvas, W, H, draw) {
  const ctx = canvas.getContext('2d');
  let visible = false, running = false, last = 0, t = 0;
  const resize = () => {
    const w = canvas.getBoundingClientRect().width;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(w * (H / W) * dpr);
    canvas.style.height = `${w * (H / W)}px`;
  };
  new ResizeObserver(resize).observe(canvas);
  resize();
  const frame = (now) => {
    if (!visible || document.hidden) { running = false; return; }
    const dt = Math.min(0.1, (now - last) / 1000);
    last = now;
    t += dt;
    const s = canvas.width / W;
    ctx.setTransform(s, 0, 0, s, 0, 0);
    ctx.clearRect(0, 0, W, H);
    const cssScale = canvas.getBoundingClientRect().width / W;
    draw(ctx, t, dt, Math.max(1, Math.min(1.6, 0.85 / cssScale)));
    requestAnimationFrame(frame);
  };
  const kick = () => { if (!running && visible && !document.hidden) { running = true; last = performance.now(); requestAnimationFrame(frame); } };
  new IntersectionObserver((es) => { visible = es[0].isIntersecting; kick(); }, { rootMargin: '80px' }).observe(canvas);
  document.addEventListener('visibilitychange', kick);
  return { kick };
}

function label(ctx, s, x, y, fs, { size = 12, weight = 500, align = 'left', color, base = 'middle' } = {}) {
  ctx.font = `${weight} ${size * fs}px Geist, ui-sans-serif, system-ui, sans-serif`;
  ctx.textAlign = align;
  ctx.textBaseline = base;
  ctx.fillStyle = color || css('--muted');
  ctx.fillText(s, x, y);
}

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

// ------------------------------------------------------------------ cooling

export function coolingWidget(root) {
  const canvas = root.querySelector('canvas');
  const flowEl = root.querySelector('[data-flow]');
  const flowOut = root.querySelector('[data-flow-out]');
  const filmEl = root.querySelector('[data-film]');
  const hotOut = root.querySelector('[data-hot]');
  const coolOut = root.querySelector('[data-cool]');
  const verdict = root.querySelector('[data-verdict]');
  const spots = [...root.querySelectorAll('[data-spot]')];
  const W = 680, H = 400;
  const state = { flow: 1, film: false, s: S_THROAT, shown: 1 };

  // engine outline, parameterised by s (0 = nozzle exit, 1 = top of the chamber)
  const E = { cx: 130, yT: 40, yC: 118, yThroat: 150, yExit: 382, rc: 54, rt: 24, re: 112 };
  const at = (s) => {
    if (s <= S_THROAT) {
      const v = 1 - s / S_THROAT; // 0 at throat, 1 at exit
      return { y: E.yThroat + (E.yExit - E.yThroat) * v, r: E.rt + (E.re - E.rt) * (1 - (1 - v) * (1 - v)) };
    }
    if (s <= 0.7) {
      const k = (s - S_THROAT) / (0.7 - S_THROAT);
      return { y: E.yThroat + (E.yC - E.yThroat) * k, r: E.rt + (E.rc - E.rt) * k * k * (3 - 2 * k) };
    }
    const k = (s - 0.7) / 0.3;
    return { y: E.yC + (E.yT - E.yC) * k, r: E.rc };
  };

  const update = () => {
    state.flow = flowEl.value / 100;
    state.film = filmEl.checked;
    flowOut.textContent = `${flowEl.value}%`;
    const w = wallState(state.s, state.flow, state.film);
    hotOut.textContent = w.hot >= 3000 ? 'over 3,000 °C' : `about ${Math.round(w.hot / 10) * 10} °C`;
    coolOut.textContent = w.coolant >= 1400 ? 'boiled away' : `about ${Math.round(w.coolant / 10) * 10} °C`;
    const melt = w.hot > COPPER_MELT_C;
    let worst = 0;
    for (let i = 0; i <= 100; i++) worst = Math.max(worst, wallState(i / 100, state.flow, state.film).hot);
    verdict.className = melt || worst > COPPER_MELT_C ? 'bad' : worst > 700 ? 'warn' : 'ok';
    verdict.textContent = melt ? 'The wall melts here.'
      : worst > COPPER_MELT_C ? 'Fine here, but the wall melts at the throat.'
        : worst > 700 ? 'Too hot to last: it would survive one burn, not a hundred.'
          : 'The wall survives, flight after flight.';
    st.kick();
  };

  const st = stage(canvas, W, H, (ctx, t, dt, fs) => {
    const ink = css('--ink'), muted = css('--muted'), panel = css('--fig-panel');
    // --- left: engine with the wall colored by temperature
    const N = 80;
    const pts = [];
    for (let i = 0; i <= N; i++) { const s = i / N; pts.push({ s, ...at(s), w: wallState(s, state.flow, state.film) }); }
    // hot gas inside
    ctx.beginPath();
    pts.forEach((p, i) => (i ? ctx.lineTo(E.cx - p.r, p.y) : ctx.moveTo(E.cx - p.r, p.y)));
    for (let i = N; i >= 0; i--) ctx.lineTo(E.cx + pts[i].r, pts[i].y);
    ctx.closePath();
    const g = ctx.createLinearGradient(0, E.yT, 0, E.yExit);
    const fl = 0.85 + 0.15 * Math.sin(t * 23);
    g.addColorStop(0, `rgba(255,180,90,${0.55 * fl})`);
    g.addColorStop(0.3, `rgba(255,150,70,${0.45 * fl})`);
    g.addColorStop(1, 'rgba(255,120,60,0.08)');
    ctx.fillStyle = g;
    ctx.fill();
    // wall segments
    ctx.lineCap = 'round';
    for (let i = 0; i < N; i++) {
      const a = pts[i], b = pts[i + 1];
      const T = a.w.hot;
      const melt = T > COPPER_MELT_C;
      ctx.strokeStyle = tempColor(T);
      ctx.lineWidth = melt ? 9 + Math.sin(t * 30 + i) * 1.5 : 8;
      for (const side of [-1, 1]) {
        ctx.beginPath();
        ctx.moveTo(E.cx + side * (a.r + 4), a.y);
        ctx.lineTo(E.cx + side * (b.r + 4), b.y);
        ctx.stroke();
      }
      if (melt && i % 3 === 0) {
        const k = (t * 0.9 + i * 0.13) % 1;
        ctx.fillStyle = `rgba(255,${Math.round(200 - 120 * k)},80,${1 - k})`;
        ctx.beginPath(); ctx.arc(E.cx - a.r - 4 - 6 * k, a.y + 40 * k * k, 2.2, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(E.cx + a.r + 4 + 6 * k, a.y + 40 * k * k, 2.2, 0, Math.PI * 2); ctx.fill();
      }
    }
    // coolant dots running up inside the wall
    state.shown += (state.flow - state.shown) * Math.min(1, dt * 4);
    const speed = 0.05 + 0.2 * state.shown;
    const n = 26;
    for (let k = 0; k < n; k++) {
      const s = ((k / n) + t * speed) % 1;
      const p = at(s);
      const w = wallState(s, state.flow, state.film);
      ctx.fillStyle = tempColor(Math.min(w.coolant, 900));
      for (const side of [-1, 1]) { ctx.beginPath(); ctx.arc(E.cx + side * (p.r + 4), p.y, 2.3, 0, Math.PI * 2); ctx.fill(); }
    }
    label(ctx, 'coolant in ↑', E.cx, E.yExit + 11, fs, { size: 11, align: 'center' });
    label(ctx, 'out, to the', E.cx + E.rc + 14, E.yT + 4, fs, { size: 11 });
    label(ctx, 'preburner', E.cx + E.rc + 14, E.yT + 4 + 14 * fs, fs, { size: 11 });
    label(ctx, 'throat', E.cx - E.rt - 16, E.yThroat, fs, { size: 11, align: 'right', color: ink, weight: 600 });
    // marker of the zoomed spot
    const m = at(state.s);
    ctx.strokeStyle = ink;
    ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.arc(E.cx + m.r + 4, m.y, 9, 0, Math.PI * 2); ctx.stroke();
    ctx.setLineDash([3, 4]);
    ctx.beginPath(); ctx.moveTo(E.cx + m.r + 13, m.y); ctx.lineTo(300, 205); ctx.stroke();
    ctx.setLineDash([]);

    // --- right: cross-section of the wall
    const X0 = 300, X1 = 670;
    const w = wallState(state.s, state.flow, state.film);
    const melt = w.hot > COPPER_MELT_C;
    const where = state.s > 0.75 ? 'chamber' : Math.abs(state.s - S_THROAT) < 0.05 ? 'throat' : 'nozzle';
    label(ctx, `Cut through the wall at the ${where}`, X0, 22, fs, { size: 13, weight: 600, color: ink });
    // outer jacket
    ctx.fillStyle = css('--steel');
    ctx.fillRect(X0, 48, X1 - X0, 32);
    label(ctx, 'outer steel jacket', X0 + 10, 64, fs, { size: 11, color: '#fff', weight: 600 });
    // ribs + channels
    const ribTop = 80, ribBot = 168, faceBot = 210;
    const gradWall = ctx.createLinearGradient(0, ribTop, 0, faceBot);
    gradWall.addColorStop(0, tempColor(w.coolant + 40));
    gradWall.addColorStop(1, tempColor(w.hot));
    ctx.fillStyle = gradWall;
    ctx.fillRect(X0, ribTop, X1 - X0, faceBot - ribTop);
    const chW = 44, gap = 26;
    const count = Math.floor((X1 - X0 - gap) / (chW + gap));
    for (let i = 0; i < count; i++) {
      const x = X0 + gap + i * (chW + gap);
      ctx.fillStyle = panel;
      roundRect(ctx, x, ribTop + 8, chW, ribBot - ribTop - 8, 6);
      ctx.fill();
      ctx.fillStyle = tempColor(Math.min(w.coolant, 900), melt ? 0.35 : 0.85);
      roundRect(ctx, x, ribTop + 8, chW, ribBot - ribTop - 8, 6);
      ctx.fill();
      // coolant flowing toward the chamber (drawn as drifting dots)
      ctx.fillStyle = melt ? 'rgba(255,255,255,0.4)' : 'rgba(255,255,255,0.85)';
      for (let j = 0; j < 6; j++) {
        const ph = (t * (0.6 + state.shown) + j / 6 + i * 0.17) % 1;
        const px = x + 8 + ((j * 0.37 + i * 0.21) % 1) * (chW - 16);
        const py = ribTop + 14 + ph * (ribBot - ribTop - 20);
        ctx.globalAlpha = Math.sin(ph * Math.PI);
        ctx.beginPath(); ctx.arc(px, py, 2.4, 0, Math.PI * 2); ctx.fill();
      }
      ctx.globalAlpha = 1;
    }
    label(ctx, 'methane in cooling channels', X0 + 10, ribBot + 12, fs, { size: 11, color: ink, weight: 600 });
    label(ctx, `copper-alloy wall, hot face ${w.hot >= 3000 ? '> 3,000' : Math.round(w.hot)} °C`, X0 + 10, faceBot - 12, fs, { size: 11, color: ink, weight: 600 });
    // film cooling layer
    const nearThroat = Math.abs(state.s - S_THROAT) < 0.1;
    let gasTop = faceBot;
    if (state.film && nearThroat) {
      ctx.fillStyle = 'rgba(125,211,252,0.55)';
      ctx.fillRect(X0, faceBot, X1 - X0, 14);
      label(ctx, 'thin film of fuel sprayed along the wall', X1 - 8, faceBot + 7, fs, { size: 10, align: 'right', color: ink });
      gasTop += 14;
    }
    // hot gas
    const gg = ctx.createLinearGradient(0, gasTop, 0, 380);
    gg.addColorStop(0, `rgba(255,190,110,${0.55 * fl})`);
    gg.addColorStop(1, `rgba(255,120,40,${0.9 * fl})`);
    ctx.fillStyle = gg;
    ctx.fillRect(X0, gasTop, X1 - X0, 380 - gasTop);
    // heat arrows into the wall; thicker where the load is higher
    ctx.strokeStyle = 'rgba(160,40,10,0.55)';
    ctx.lineWidth = 1.5 + 3 * w.q;
    for (let i = 0; i < 7; i++) {
      const x = X0 + 30 + i * 52;
      const k = (t * 0.7 + i * 0.3) % 1;
      const y0 = 360 - k * 110;
      ctx.beginPath();
      for (let yy = 0; yy <= 40; yy += 4) ctx.lineTo(x + Math.sin((yy + t * 60) * 0.25) * 4, y0 - yy);
      ctx.stroke();
    }
    label(ctx, 'exhaust, over 3,000 °C', X0 + 10, 366, fs, { size: 12, color: '#7c2d12', weight: 600 });
    if (melt) {
      ctx.fillStyle = `rgba(255,250,240,${0.35 + 0.25 * Math.sin(t * 20)})`;
      ctx.fillRect(X0, ribBot, X1 - X0, faceBot - ribBot);
      label(ctx, 'MELTING', X1 - 10, faceBot - 12, fs, { size: 13, align: 'right', color: '#b91c1c', weight: 700 });
    }
    ctx.strokeStyle = muted;
    ctx.lineWidth = 1;
    ctx.strokeRect(X0 + 0.5, 48.5, X1 - X0 - 1, 380 - 48);
  });

  flowEl.addEventListener('input', update);
  filmEl.addEventListener('change', update);
  spots.forEach((b) => b.addEventListener('click', () => {
    state.s = +b.dataset.spot;
    spots.forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
    update();
  }));
  update();
}

// ------------------------------------------------------------------ pressurization

export function pressWidget(root) {
  const canvas = root.querySelector('canvas');
  const modes = [...root.querySelectorAll('[data-mode]')];
  const again = root.querySelector('[data-again]');
  const pOut = root.querySelector('[data-p]');
  const status = root.querySelector('[data-status]');
  const W = 680, H = 380;
  const S = { mode: 'auto', T: 0, level: 0.92, P: 1, off: false, cav: 0, helium: 1 };
  const reset = () => { S.T = 0; S.level = 0.92; S.P = 1; S.off = false; S.cav = 0; S.helium = 1; st.kick(); };

  const tank = { x: 50, y: 30, w: 150, h: 300 };
  const pump = { x: 420, y: 350 };

  const st = stage(canvas, W, H, (ctx, t, dt, fs) => {
    const ink = css('--ink'), panel = css('--fig-panel'), fuel = css('--fuel');
    // --- simulate
    if (!S.off && S.level > 0.08) S.level -= dt * 0.085;
    const V = 1 - S.level;
    if (S.mode === 'none') S.P = Math.min(1, 0.08 / V);
    else S.P = 1;
    if (S.mode === 'helium') S.helium = Math.max(0.12, 1 - ((V - 0.08) / 0.92) * 0.85);
    const inlet = 0.75 * S.P + 0.3 * S.level;
    const cavitating = !S.off && inlet < 0.45;
    S.cav = cavitating ? S.cav + dt : Math.max(0, S.cav - dt * 2);
    if (S.cav > 0.9) S.off = true;
    S.T += dt;
    if ((S.level <= 0.08 || S.off) && S.T > 0) { S.end = (S.end ?? 0) + dt; if (S.end > 3.5) { S.end = 0; reset(); } } else S.end = 0;
    const running = !S.off && S.level > 0.08;
    const thrust = running ? (cavitating ? 0.45 + 0.35 * Math.random() : 1) : 0;

    // readouts
    pOut.textContent = `${Math.round(S.P * 100)}%`;
    status.className = S.off ? 'bad' : cavitating ? 'warn' : 'ok';
    status.textContent = S.off ? `Engine shut down. ${Math.round(S.level * 100)}% of the propellant is stuck in the tank.`
      : cavitating ? 'Pump inlet pressure too low: the methane boils inside the pump.'
        : S.level <= 0.08 ? 'Tank empty, burn complete.' : 'Pump is fed properly.';

    // --- tank
    roundRect(ctx, tank.x, tank.y, tank.w, tank.h, 28);
    ctx.fillStyle = panel;
    ctx.fill();
    ctx.save();
    roundRect(ctx, tank.x, tank.y, tank.w, tank.h, 28);
    ctx.clip();
    const ly = tank.y + tank.h * (1 - S.level);
    ctx.fillStyle = 'rgba(217,119,6,0.22)';
    ctx.fillRect(tank.x, ly, tank.w, tank.h);
    ctx.strokeStyle = fuel;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    for (let x = tank.x; x <= tank.x + tank.w; x += 4) ctx.lineTo(x, ly + Math.sin(x * 0.1 + t * 2) * 1.5);
    ctx.stroke();
    // gas in the empty space: dot density follows pressure
    const nd = Math.round(8 + 60 * S.P * Math.min(1, V * 1.6));
    ctx.fillStyle = S.mode === 'auto' ? 'rgba(234,88,12,0.7)' : 'rgba(100,116,139,0.75)';
    for (let i = 0; i < nd; i++) {
      const hx = Math.abs(Math.sin(i * 12.9898) * 43758.5453) % 1;
      const hy = Math.abs(Math.sin(i * 78.233 + 1.7) * 24634.6345) % 1;
      const px = tank.x + 12 + hx * (tank.w - 24) + Math.sin(t * 3 + i) * 3;
      const py = tank.y + 10 + hy * Math.max(4, ly - tank.y - 16) + Math.cos(t * 2.6 + i * 1.3) * 3;
      ctx.beginPath(); ctx.arc(px, py, 2, 0, Math.PI * 2); ctx.fill();
    }
    ctx.restore();
    ctx.strokeStyle = ink;
    ctx.lineWidth = 1.5;
    roundRect(ctx, tank.x, tank.y, tank.w, tank.h, 28);
    ctx.stroke();
    label(ctx, 'Methane tank', tank.x + tank.w / 2, tank.y + tank.h - 18, fs, { size: 12, align: 'center', color: ink, weight: 600 });

    // gauge
    const gx = 250, gy = 70, gr = 30;
    ctx.lineWidth = 6;
    ctx.strokeStyle = 'rgba(220,38,38,0.35)';
    ctx.beginPath(); ctx.arc(gx, gy, gr, Math.PI, Math.PI * 1.35); ctx.stroke();
    ctx.strokeStyle = 'rgba(127,127,127,0.25)';
    ctx.beginPath(); ctx.arc(gx, gy, gr, Math.PI * 1.35, Math.PI * 2); ctx.stroke();
    const a = Math.PI + Math.PI * Math.min(1, S.P);
    ctx.strokeStyle = ink;
    ctx.lineWidth = 2.5;
    ctx.beginPath(); ctx.moveTo(gx, gy); ctx.lineTo(gx + Math.cos(a) * (gr - 4), gy + Math.sin(a) * (gr - 4)); ctx.stroke();
    label(ctx, 'tank pressure', gx, gy + 16, fs, { size: 10, align: 'center' });
    ctx.strokeStyle = 'rgba(127,127,127,0.6)';
    ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.moveTo(tank.x + tank.w, gy + 4); ctx.lineTo(gx - gr, gy + 4); ctx.stroke();

    // feed line + pump
    const line = [[tank.x + tank.w / 2, tank.y + tank.h], [tank.x + tank.w / 2, pump.y], [pump.x - 22, pump.y]];
    ctx.strokeStyle = 'rgba(217,119,6,0.3)';
    ctx.lineWidth = 6;
    ctx.beginPath(); line.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y))); ctx.stroke();
    const len = (pump.y - tank.y - tank.h) + (pump.x - 22 - tank.x - tank.w / 2);
    ctx.fillStyle = fuel;
    for (let s = (t * 70 * thrust) % 14; s < len; s += 14) {
      const d1 = pump.y - tank.y - tank.h;
      const [x, y] = s < d1 ? [line[0][0], line[0][1] + s] : [line[1][0] + (s - d1), pump.y];
      ctx.beginPath(); ctx.arc(x, y, 2, 0, Math.PI * 2); ctx.fill();
    }
    ctx.fillStyle = panel;
    ctx.strokeStyle = cavitating ? '#dc2626' : ink;
    ctx.lineWidth = cavitating ? 2.5 : 1.5;
    ctx.beginPath(); ctx.arc(pump.x, pump.y, 22, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    S.angle = (S.angle || 0) + dt * 10 * thrust;
    ctx.strokeStyle = ink;
    ctx.lineWidth = 1.5;
    for (let i = 0; i < 6; i++) {
      const b = S.angle + (i * Math.PI) / 3;
      ctx.beginPath(); ctx.moveTo(pump.x + Math.cos(b) * 4, pump.y + Math.sin(b) * 4); ctx.lineTo(pump.x + Math.cos(b + 0.7) * 18, pump.y + Math.sin(b + 0.7) * 18); ctx.stroke();
    }
    if (S.cav > 0.02 || cavitating) {
      for (let i = 0; i < 10; i++) {
        const k = (t * 1.6 + i / 10) % 1;
        ctx.strokeStyle = `rgba(255,255,255,${0.9 * (1 - k)})`;
        ctx.fillStyle = `rgba(147,197,253,${0.5 * (1 - k)})`;
        ctx.lineWidth = 1;
        const bx = pump.x - 40 + ((i * 0.37) % 1) * 60, by = pump.y - 8 + Math.sin(i * 2.3) * 10;
        ctx.beginPath(); ctx.arc(bx, by, 2 + 5 * k, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
      }
      label(ctx, 'bubbles: propellant boiling', pump.x, pump.y - 36, fs, { size: 11, align: 'center', color: '#b91c1c', weight: 600 });
    } else label(ctx, 'pump', pump.x, pump.y - 34, fs, { size: 11, align: 'center' });

    // engine box with a flame showing thrust
    const ex = 560, ey = 322;
    ctx.strokeStyle = 'rgba(217,119,6,0.3)';
    ctx.lineWidth = 6;
    ctx.beginPath(); ctx.moveTo(pump.x + 22, pump.y); ctx.lineTo(ex, pump.y); ctx.stroke();
    ctx.fillStyle = panel;
    ctx.strokeStyle = ink;
    ctx.lineWidth = 1.5;
    roundRect(ctx, ex, ey, 70, 56, 8);
    ctx.fill(); ctx.stroke();
    label(ctx, 'engine', ex + 35, ey + 28, fs, { size: 12, align: 'center', color: ink, weight: 600 });
    if (thrust > 0) {
      const L = 40 * thrust;
      const fg = ctx.createLinearGradient(ex + 70, 0, ex + 70 + L, 0);
      fg.addColorStop(0, 'rgba(255,240,200,0.95)');
      fg.addColorStop(1, 'rgba(255,120,40,0)');
      ctx.fillStyle = fg;
      ctx.beginPath(); ctx.moveTo(ex + 70, ey + 12); ctx.lineTo(ex + 70 + L, ey + 28); ctx.lineTo(ex + 70, ey + 44); ctx.closePath(); ctx.fill();
    }

    // pressurant sources
    if (S.mode === 'helium') {
      const bottles = [[330, 110], [390, 110], [450, 110]];
      bottles.forEach(([x, y]) => {
        ctx.fillStyle = panel;
        ctx.strokeStyle = ink;
        ctx.lineWidth = 1.5;
        ctx.beginPath(); ctx.arc(x, y, 24, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
        ctx.save();
        ctx.beginPath(); ctx.arc(x, y, 23, 0, Math.PI * 2); ctx.clip();
        ctx.fillStyle = 'rgba(100,116,139,0.55)';
        ctx.fillRect(x - 24, y + 24 - 48 * S.helium, 48, 48 * S.helium);
        ctx.restore();
      });
      label(ctx, 'helium bottles', 390, 150, fs, { size: 11, align: 'center', color: ink, weight: 600 });
      label(ctx, '(how Falcon 9 does it)', 390, 150 + 14 * fs, fs, { size: 10, align: 'center' });
      const hl = [[306, 110], [290, 110], [290, 16], [125, 16], [125, 30]];
      pipeDots(ctx, hl, 'rgba(100,116,139,0.35)', 'rgba(100,116,139,0.95)', t, running ? 40 : 0);
    } else if (S.mode === 'auto') {
      const al = [[ex + 35, ey], [ex + 35, 16], [125, 16], [125, 30]];
      pipeDots(ctx, al, 'rgba(234,88,12,0.25)', 'rgba(234,88,12,0.9)', t, running ? 50 : 0);
      // heat exchanger coil
      ctx.strokeStyle = 'rgba(234,88,12,0.9)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      for (let i = 0; i <= 40; i++) ctx.lineTo(ex + 35 + Math.sin(i * 0.8) * 10, 250 - i * 1.6);
      ctx.stroke();
      label(ctx, 'warmed by the engine,', ex + 26, 205, fs, { size: 11, align: 'right', color: ink, weight: 600 });
      label(ctx, 'piped back to the tank', ex + 26, 205 + 14 * fs, fs, { size: 11, align: 'right' });
    } else {
      label(ctx, 'nothing refills the empty space', 390, 110, fs, { size: 11, align: 'center', color: ink, weight: 600 });
    }
  });

  function pipeDots(ctx, pts, tubeCol, dotCol, t, speed) {
    ctx.strokeStyle = tubeCol;
    ctx.lineWidth = 4;
    ctx.beginPath(); pts.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y))); ctx.stroke();
    let L = 0;
    const seg = [];
    for (let i = 1; i < pts.length; i++) { const l = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]); seg.push(l); L += l; }
    ctx.fillStyle = dotCol;
    for (let s = (t * speed) % 16; s < L; s += 16) {
      let d = s, i = 0;
      while (i < seg.length - 1 && d > seg[i]) { d -= seg[i]; i++; }
      const k = seg[i] ? d / seg[i] : 0;
      const x = pts[i][0] + (pts[i + 1][0] - pts[i][0]) * k, y = pts[i][1] + (pts[i + 1][1] - pts[i][1]) * k;
      ctx.beginPath(); ctx.arc(x, y, 2.2, 0, Math.PI * 2); ctx.fill();
    }
  }

  modes.forEach((b) => b.addEventListener('click', () => {
    S.mode = b.dataset.mode;
    modes.forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
    reset();
  }));
  again.addEventListener('click', reset);
}
