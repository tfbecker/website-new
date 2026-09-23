// Toy thermal model shared by the cooling widget and the 3D heat map.
// s runs along the wall from the nozzle exit (0) to the top of the chamber (1); the coolant flows the same way.

export const S_THROAT = 0.62;

// Relative heat load on the wall. The throat is where the gas is densest and fastest, so it peaks there.
export function heatFlux(s) {
  if (s < S_THROAT) return 0.06 + 0.94 * Math.pow(s / S_THROAT, 3);
  return 0.5 + 0.5 * Math.exp(-Math.pow((s - S_THROAT) / 0.06, 2));
}

const N = 200;
const cumulative = (() => {
  const c = [0];
  for (let i = 1; i <= N; i++) c.push(c[i - 1] + heatFlux(i / N) / N);
  return c;
})();

export const COPPER_MELT_C = 1085;

// flow: 1 = design coolant flow. film: film cooling at the throat on/off.
export function wallState(s, flow, film = false) {
  const f = Math.max(0.03, flow);
  const q = heatFlux(s);
  const picked = cumulative[Math.round(Math.min(1, Math.max(0, s)) * N)] / cumulative[N];
  const coolant = Math.min(1500, -160 + (330 * picked) / f);
  const filmK = film ? 1 - 0.35 * Math.exp(-Math.pow((s - S_THROAT) / 0.08, 2)) : 1;
  const hot = Math.min(3300, coolant + (600 * q * filmK) / Math.pow(f, 0.8));
  return { q, coolant, hot };
}

// Temperature (C) to a color: cold blue, warm yellow, hot red, melting white.
const STOPS = [
  [-180, [59, 130, 246]],
  [0, [125, 211, 252]],
  [300, [253, 230, 138]],
  [650, [251, 146, 60]],
  [1000, [220, 38, 38]],
  [1600, [255, 245, 235]],
];
export function tempColor(T, a = 1) {
  let i = 0;
  while (i < STOPS.length - 2 && T > STOPS[i + 1][0]) i++;
  const [t0, c0] = STOPS[i], [t1, c1] = STOPS[i + 1];
  const k = Math.max(0, Math.min(1, (T - t0) / (t1 - t0)));
  const c = c0.map((v, j) => Math.round(v + (c1[j] - v) * k));
  return `rgba(${c[0]},${c[1]},${c[2]},${a})`;
}

export function tempRGB(T) {
  const m = tempColor(T).match(/\d+/g).map(Number);
  return [m[0] / 255, m[1] / 255, m[2] / 255];
}
