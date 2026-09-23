// Toy model for "why full flow runs cooler": turbine power ~ gas flow x energy each kg gives up.
// Hold the pump power fixed and change how much of the propellant goes through the turbine.

export function turbineWidget(canvas, slider, outShare, outHeat) {
  const ctx = canvas.getContext('2d');
  const W = 560, H = 190;
  let share = slider.value / 100;
  let shown = share;
  let t = 0;
  let running = false;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

  const resize = () => {
    const r = canvas.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(r.width * dpr);
    canvas.height = Math.round(r.width * (H / W) * dpr);
    canvas.style.height = `${r.width * (H / W)}px`;
  };
  new ResizeObserver(resize).observe(canvas);
  resize();

  const color = (heat) => {
    // heat 1 = full flow baseline, larger = hotter
    const k = Math.min(1, (heat - 1) / 7);
    const r = 255, g = Math.round(150 + 100 * k), b = Math.round(60 + 190 * k * k);
    return [r, g, b];
  };

  const draw = () => {
    const s = canvas.width / W;
    ctx.setTransform(s, 0, 0, s, 0, 0);
    ctx.clearRect(0, 0, W, H);
    const heat = 1 / shown;
    const [r, g, b] = color(heat);
    const cy = 92;
    const band = 6 + 70 * shown;
    // stream
    const grad = ctx.createLinearGradient(20, 0, 360, 0);
    grad.addColorStop(0, `rgba(${r},${g},${b},0.15)`);
    grad.addColorStop(1, `rgba(${r},${g},${b},0.9)`);
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.moveTo(20, cy - band / 2);
    ctx.lineTo(380, cy - band / 2);
    ctx.lineTo(380, cy + band / 2);
    ctx.lineTo(20, cy + band / 2);
    ctx.closePath();
    ctx.fill();
    // particles moving into the turbine
    ctx.fillStyle = `rgba(${r},${g},${b},1)`;
    const n = Math.round(10 + 50 * shown);
    for (let i = 0; i < n; i++) {
      const x = 20 + (((i * 0.6180339) % 1) * 360 + t * 160) % 360;
      const y = cy + (((i * 0.3819) % 1) - 0.5) * band * 0.8;
      ctx.beginPath(); ctx.arc(x, y, 2.4, 0, Math.PI * 2); ctx.fill();
    }
    // turbine wheel
    const cx = 440;
    ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--fig-panel').trim() || '#f6f7f8';
    ctx.strokeStyle = getComputedStyle(document.documentElement).getPropertyValue('--ink').trim() || '#111';
    ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.arc(cx, cy, 52, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    ctx.fillStyle = `rgba(${r},${g},${b},${0.2 + 0.5 * Math.min(1, (heat - 1) / 6)})`;
    ctx.beginPath(); ctx.arc(cx, cy, 52, 0, Math.PI * 2); ctx.fill();
    for (let i = 0; i < 16; i++) {
      const a = -t * 5 + (i * Math.PI) / 8;
      ctx.beginPath();
      ctx.moveTo(cx + Math.cos(a) * 10, cy + Math.sin(a) * 10);
      ctx.lineTo(cx + Math.cos(a + 0.3) * 48, cy + Math.sin(a + 0.3) * 48);
      ctx.stroke();
    }
    // thermometer-ish bar
    const bx = 20, by = 162, bw = 360;
    ctx.fillStyle = 'rgba(127,127,127,0.18)';
    ctx.fillRect(bx, by, bw, 10);
    const fill = Math.min(1, Math.log(heat) / Math.log(20));
    ctx.fillStyle = `rgb(${r},${g},${b})`;
    ctx.fillRect(bx, by, Math.max(4, bw * fill), 10);
    ctx.font = '500 15px Geist, ui-sans-serif, system-ui, sans-serif';
    ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--muted').trim() || '#666';
    ctx.textBaseline = 'bottom';
    ctx.fillText('energy each kilogram of gas has to deliver', bx, by - 4);
  };

  const loop = () => {
    shown += (share - shown) * 0.15;
    t += reduced ? 0.004 : 0.016;
    draw();
    if (Math.abs(share - shown) > 0.001 || visible) requestAnimationFrame(loop); else running = false;
  };
  let visible = false;
  new IntersectionObserver((es) => { visible = es[0].isIntersecting; if (visible && !running) { running = true; requestAnimationFrame(loop); } }).observe(canvas);

  const update = () => {
    share = slider.value / 100;
    outShare.textContent = `${Math.round(share * 100)}%`;
    const x = 1 / share;
    outHeat.textContent = x < 1.05 ? 'the least possible' : `${x < 10 ? x.toFixed(1) : Math.round(x)}× the full-flow amount`;
    if (!running) { running = true; requestAnimationFrame(loop); }
  };
  slider.addEventListener('input', update);
  update();
}
