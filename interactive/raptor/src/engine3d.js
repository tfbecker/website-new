// Simplified, procedurally built Raptor-style full-flow engine.
// Not a CAD model: the parts sit where the fan schematics put them, the shapes are stylized.
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';

const V = (x, y, z) => new THREE.Vector3(x, y, z);

// ------------------------------------------------------------------ profile

const RT = 0.14; // throat radius
const RE = 0.65; // exit radius
const Y_THROAT = 1.3;
const Y_CHAMBER = 1.48;
const Y_INJ = 1.86;
const RC = 0.25; // chamber radius

export function nozzleR(y) {
  if (y <= Y_THROAT) {
    const u = (Y_THROAT - y) / Y_THROAT;
    return RT + (RE - RT) * (1 - (1 - u) * (1 - u));
  }
  if (y <= Y_CHAMBER) {
    const k = (y - Y_THROAT) / (Y_CHAMBER - Y_THROAT);
    return RT + (RC - RT) * k * k * (3 - 2 * k);
  }
  return RC;
}

function rng(seed) {
  let a = seed >>> 0;
  return () => {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// ------------------------------------------------------------------ materials

function makeMaterials() {
  const std = (color, metalness, roughness, extra = {}) => new THREE.MeshStandardMaterial({ color, metalness, roughness, ...extra });
  return {
    steel: std(0xb7bcc3, 0.9, 0.32),
    housing: std(0x9aa0a8, 0.85, 0.4),
    printed: std(0xb4b7ba, 0.75, 0.5),
    dark: std(0x3b3e44, 0.55, 0.55),
    wire: std(0x1d1f23, 0.2, 0.75),
    tape: std(0xd9b44a, 0.3, 0.6),
    copper: std(0xb87a4b, 0.85, 0.38),
    sensor: std(0xe5e7eb, 0.3, 0.45),
    nozzleOut: std(0xffffff, 0.8, 0.46, { vertexColors: true, side: THREE.DoubleSide }),
    nozzleIn: std(0x24211f, 0.35, 0.85, { side: THREE.DoubleSide, emissive: 0x000000 }),
    shield: std(0xc9ced6, 0.9, 0.5, { transparent: true, opacity: 0.32, side: THREE.DoubleSide, depthWrite: false }),
  };
}

// ------------------------------------------------------------------ helpers

function curve(points) {
  return new THREE.CatmullRomCurve3(points.map((p) => (p.isVector3 ? p : V(...p))), false, 'catmullrom', 0.5);
}

function tube(points, r, mat, seg = 48, radial = 12) {
  const c = points instanceof THREE.Curve ? points : curve(points);
  const m = new THREE.Mesh(new THREE.TubeGeometry(c, seg, r, radial, false), mat);
  m.userData.curve = c;
  return m;
}

function cyl(rTop, rBot, h, mat, [x, y, z], seg = 48) {
  const m = new THREE.Mesh(new THREE.CylinderGeometry(rTop, rBot, h, seg), mat);
  m.position.set(x, y, z);
  return m;
}

function capsule(r, len, mat, [x, y, z]) {
  const m = new THREE.Mesh(new THREE.CapsuleGeometry(r, len, 8, 28), mat);
  m.position.set(x, y, z);
  return m;
}

function torus(R, r, mat, [x, y, z], arc = Math.PI * 2) {
  const m = new THREE.Mesh(new THREE.TorusGeometry(R, r, 18, 72, arc), mat);
  m.rotation.x = Math.PI / 2;
  m.position.set(x, y, z);
  return m;
}

function lathe(profile, mat, seg = 72) {
  return new THREE.Mesh(new THREE.LatheGeometry(profile.map(([r, y]) => new THREE.Vector2(r, y)), seg), mat);
}

function flange(R, y, center, mats, axis = 'y', bolts = 18) {
  const g = new THREE.Group();
  const ring = new THREE.Mesh(new THREE.CylinderGeometry(R + 0.035, R + 0.035, 0.045, 48, 1, true), mats.housing);
  const cap = new THREE.Mesh(new THREE.RingGeometry(R, R + 0.035, 48), mats.housing);
  cap.rotation.x = -Math.PI / 2; cap.position.y = 0.0225;
  const cap2 = cap.clone(); cap2.position.y = -0.0225; cap2.rotation.x = Math.PI / 2;
  g.add(ring, cap, cap2);
  const boltGeo = new THREE.CylinderGeometry(0.011, 0.011, 0.075, 8);
  const inst = new THREE.InstancedMesh(boltGeo, mats.dark, bolts);
  const m4 = new THREE.Matrix4();
  for (let i = 0; i < bolts; i++) {
    const a = (i / bolts) * Math.PI * 2;
    m4.makeTranslation(Math.cos(a) * (R + 0.018), 0, Math.sin(a) * (R + 0.018));
    inst.setMatrixAt(i, m4);
  }
  g.add(inst);
  if (axis === 'x') g.rotation.z = Math.PI / 2;
  g.position.set(center[0], y, center[2]);
  return g;
}

// ------------------------------------------------------------------ the engine

// Key locations (meters). Nozzle exit at y = 0, engine axis along y.
const P = {
  oxAxis: [0, 0, 0],
  oxTurbY: 2.17,
  oxPumpY: 2.45,
  loxTopY: 2.96,
  oxPB: [0.46, 2.2, 0.18],
  fuel: [-0.58, 0, 0.06],
  fuelPumpY: 2.4,
  fuelTurbY: 2.15,
  fuelTopY: 2.86,
  fuelPBY: 1.8,
  manifoldY: 0.55,
};

export const HOTSPOTS = [
  { id: 'loxInlet', name: 'Liquid oxygen inlet', at: [0, 2.9, 0], text: 'Liquid oxygen arrives from the ship\'s tank at low pressure, colder than −180 °C.' },
  { id: 'oxPump', name: 'Oxygen pump', at: [0.24, 2.47, 0.12], text: 'Squeezes the oxygen up to several hundred bar. It only ever touches oxygen.' },
  { id: 'oxPreburner', name: 'Oxygen-rich preburner', at: [0.46, 2.36, 0.2], text: 'Burns all of the oxygen with a little methane. The result is hot gas that is mostly oxygen, which attacks metal like a cutting torch. SpaceX developed its own alloy to survive it.' },
  { id: 'oxTurbine', name: 'Oxygen turbine', at: [0.27, 2.17, -0.05], text: 'Spun by the oxygen-rich gas, on the same shaft as the oxygen pump. Its exhaust goes straight down into the main chamber.' },
  { id: 'fuelInlet', name: 'Methane inlet', at: [-0.58, 2.8, 0.06], text: 'Liquid methane from the ship, at around −160 °C and low pressure.' },
  { id: 'fuelPump', name: 'Methane pump', at: [-0.76, 2.4, 0.1], text: 'Squeezes the methane up to several hundred bar. It only ever touches methane.' },
  { id: 'fuelTurbine', name: 'Methane turbine', at: [-0.76, 2.15, 0.06], text: 'Spun by the fuel-rich gas from the preburner right below it.' },
  { id: 'fuelPreburner', name: 'Fuel-rich preburner', at: [-0.7, 1.72, 0.08], text: 'Burns all of the methane with a little oxygen. Hot, mostly-methane gas comes out and drives the methane turbine.' },
  { id: 'hotGas', name: 'Hot-gas duct', at: [-0.38, 2.08, 0.16], text: 'Carries the fuel-rich gas from the methane turbine into the main injector, where it meets the oxygen-rich gas.' },
  { id: 'injector', name: 'Main injector and chamber', at: [0.27, 1.72, 0.1], text: 'Two hot gases meet and burn. Raptor 2 runs at around 300 bar here, roughly 300 times the air pressure you are sitting in.' },
  { id: 'regen', name: 'Regenerative cooling', at: [-0.66, 0.6, 0.26], text: 'The exhaust is over 3,000 °C. Before it goes to the preburner, the cold methane runs through channels inside the chamber and nozzle walls, cooling them and warming itself up.' },
  { id: 'nozzle', name: 'Nozzle', at: [0.5, 0.35, 0.3], text: 'Lets the hot gas expand and speed up. The bell shape turns pressure into speed, and speed is thrust.' },
];

function buildCore(M) {
  const parts = {};
  const part = (id, explode) => {
    const g = new THREE.Group();
    g.name = id;
    g.userData.explode = V(...explode);
    parts[id] = g;
    return g;
  };

  // --- nozzle + chamber
  const nozzle = part('nozzle', [0, -0.45, 0]);
  const profile = [];
  for (let i = 0; i <= 40; i++) { const y = (i / 40) * Y_THROAT; profile.push([nozzleR(y), y]); }
  for (let i = 1; i <= 10; i++) { const y = Y_THROAT + (i / 10) * (Y_CHAMBER - Y_THROAT); profile.push([nozzleR(y), y]); }
  const outer = lathe(profile, M.nozzleOut);
  const cols = [];
  const pos = outer.geometry.attributes.position;
  const top = new THREE.Color(0x8c9199), bottom = new THREE.Color(0x4f433c), c = new THREE.Color();
  for (let i = 0; i < pos.count; i++) { const k = Math.min(1, pos.getY(i) / Y_THROAT); c.copy(bottom).lerp(top, Math.pow(k, 0.7)); cols.push(c.r, c.g, c.b); }
  outer.geometry.setAttribute('color', new THREE.Float32BufferAttribute(cols, 3));
  const inner = lathe(profile.map(([r, y]) => [r - 0.012, y]), M.nozzleIn);
  inner.userData.inner = true;
  nozzle.add(outer, inner);
  nozzle.add(torus(nozzleR(0.02) + 0.01, 0.018, M.housing, [0, 0.02, 0]));
  for (const y of [0.3, 0.95]) nozzle.add(torus(nozzleR(y) + 0.008, 0.014, M.housing, [0, y, 0]));

  const inj = part('injector', [0, 0, 0]);
  inj.add(cyl(RC + 0.012, RC + 0.012, Y_INJ - Y_CHAMBER, M.housing, [0, (Y_INJ + Y_CHAMBER) / 2, 0]));
  inj.add(lathe([[RC + 0.012, Y_INJ - 0.001], [0.33, 1.9], [0.335, 1.98], [0.3, 2.04], [0.2, 2.07], [0.0, 2.075]], M.housing));

  // --- regen: downcomer + manifold + return
  const regen = part('regen', [-0.35, -0.2, 0.15]);
  const mR = nozzleR(P.manifoldY) + 0.05;
  regen.add(torus(mR, 0.045, M.housing, [0, P.manifoldY, 0]));
  const aDown = Math.atan2(0.25, -0.6);
  const downEnd = V(Math.cos(aDown) * mR, P.manifoldY + 0.04, Math.sin(aDown) * mR);
  const downcomer = curve([[-0.74, 2.38, 0.14], [-0.84, 2.18, 0.22], [-0.84, 1.55, 0.3], [-0.72, 0.95, 0.3], downEnd.clone().add(V(-0.05, 0.12, 0.02)), downEnd]);
  regen.add(tube(downcomer, 0.055, M.steel, 64, 14));
  const ret = curve([[-0.2, 1.74, 0.17], [-0.34, 1.6, 0.2], [-0.52, 1.55, 0.13], [-0.58, 1.6, 0.06]]);
  regen.add(tube(ret, 0.045, M.steel, 32, 12));

  // --- oxygen side, stacked on top
  const loxInlet = part('loxInlet', [0, 0.7, 0]);
  loxInlet.add(cyl(0.12, 0.13, 0.36, M.steel, [0, 2.76, 0]));
  loxInlet.add(cyl(0.19, 0.19, 0.035, M.housing, [0, P.loxTopY - 0.02, 0]));
  const oxPump = part('oxPump', [0, 0.5, 0]);
  oxPump.add(cyl(0.2, 0.22, 0.28, M.housing, [0, P.oxPumpY, 0]));
  const volO = torus(0.215, 0.075, M.housing, [0, P.oxPumpY, 0]);
  volO.userData.volute = true;
  oxPump.add(volO);
  const oxDis = curve([[0.2, P.oxPumpY, 0.16], [0.36, 2.5, 0.22], [0.46, 2.44, P.oxPB[2]], [0.46, 2.38, P.oxPB[2]]]);
  const oxDisMesh = tube(oxDis, 0.055, M.steel, 32, 12);
  oxDisMesh.userData.volute = true;
  oxPump.add(oxDisMesh);
  const oxTurb = part('oxTurbine', [0, 0.3, 0]);
  oxTurb.add(cyl(0.245, 0.275, 0.24, M.housing, [0, P.oxTurbY, 0]));
  const oxPB = part('oxPreburner', [0.5, 0.3, 0.2]);
  oxPB.add(capsule(0.09, 0.3, M.housing, P.oxPB));
  oxPB.add(tube([[0.42, 2.1, 0.16], [0.34, 2.14, 0.11], [0.22, 2.17, 0.07]], 0.06, M.housing, 16, 12));

  // --- fuel side
  const [fx, , fz] = P.fuel;
  const fuelInlet = part('fuelInlet', [-0.45, 0.6, 0]);
  fuelInlet.add(cyl(0.1, 0.105, 0.34, M.steel, [fx, 2.68, fz]));
  fuelInlet.add(cyl(0.16, 0.16, 0.035, M.housing, [fx, P.fuelTopY - 0.02, fz]));
  const fuelPump = part('fuelPump', [-0.55, 0.45, 0]);
  fuelPump.add(cyl(0.16, 0.17, 0.24, M.housing, [fx, P.fuelPumpY, fz]));
  const volF = torus(0.17, 0.062, M.housing, [fx, P.fuelPumpY, fz]);
  volF.userData.volute = true;
  fuelPump.add(volF);
  const fuelTurb = part('fuelTurbine', [-0.55, 0.25, 0]);
  fuelTurb.add(cyl(0.175, 0.19, 0.22, M.housing, [fx, P.fuelTurbY, fz]));
  const fuelPB = part('fuelPreburner', [-0.55, -0.05, 0]);
  fuelPB.add(capsule(0.1, 0.3, M.housing, [fx, P.fuelPBY, fz]));
  const hot = part('hotGas', [-0.25, 0.1, 0]);
  const hotCurve = curve([[-0.44, 2.13, 0.08], [-0.36, 2.1, 0.1], [-0.3, 2.0, 0.08], [-0.24, 1.95, 0.05]]);
  hot.add(tube(hotCurve, 0.1, M.housing, 24, 16));

  // --- cross-feeds: a little of the other propellant to each preburner
  const xfeed = part('xfeed', [0, 0, 0]);
  const xO = curve([[0, P.oxPumpY, -0.26], [-0.3, 2.32, -0.34], [-0.52, 2.0, -0.2], [-0.58, 1.9, -0.1]]);
  const xF = curve([[-0.5, P.fuelPumpY, 0.2], [-0.12, 2.56, 0.36], [0.3, 2.44, 0.34], [0.45, 2.34, 0.26]]);
  xfeed.add(tube(xO, 0.022, M.steel, 40, 8), tube(xF, 0.022, M.steel, 40, 8));

  return { parts, curves: { downcomer, ret, oxDis, hotCurve, xO, xF } };
}

// Version-specific hardware. v: 1, 2, 3
function buildClutter(M, v) {
  const g = new THREE.Group();
  const shield = new THREE.Group();
  const smooth = new THREE.Group();
  const rand = rng(1234 + v * 99);

  const envelope = (y, a) => {
    // rough outer surface of the powerhead at height y and angle a
    const base = y > 2.05 ? 0.3 : y > 1.86 ? 0.36 : RC + 0.03;
    const side = Math.max(0, Math.cos(a - Math.PI)) * (y > 1.6 && y < 2.9 ? 0.55 : 0);
    return base + side * 0.9;
  };
  const anchor = (yMin = 1.55, yMax = 2.9) => {
    const a = rand() * Math.PI * 2;
    const y = yMin + rand() * (yMax - yMin);
    const r = envelope(y, a) + 0.02;
    return V(Math.cos(a) * r, y, Math.sin(a) * r);
  };

  const counts = { 1: { pipes: 70, sensors: 34, boxes: 7, harness: 3 }, 2: { pipes: 22, sensors: 10, boxes: 0, harness: 1 }, 3: { pipes: 0, sensors: 0, boxes: 0, harness: 0 } }[v];

  // small secondary plumbing
  for (let i = 0; i < counts.pipes; i++) {
    const a = anchor(), b = anchor();
    if (a.distanceTo(b) < 0.25) { i--; continue; }
    const mid = a.clone().add(b).multiplyScalar(0.5);
    const out = V(mid.x, 0, mid.z).normalize().multiplyScalar(0.03 + rand() * 0.11);
    const pts = [a, a.clone().lerp(mid, 0.5).add(out.clone().multiplyScalar(0.7)), mid.clone().add(out), b.clone().lerp(mid, 0.5).add(out.clone().multiplyScalar(0.7)), b];
    const r = 0.008 + rand() * 0.014;
    const roll = rand();
    const mat = roll < 0.06 ? M.copper : roll < 0.1 ? M.tape : roll < 0.3 ? M.dark : M.steel;
    g.add(tube(pts, r, mat, 28, 6));
  }
  // sensors with wires
  const harnessPts = [];
  for (let h = 0; h < counts.harness; h++) {
    const y = 1.95 + h * 0.3;
    const pts = [];
    for (let i = 0; i <= 10; i++) {
      const a = (i / 10) * Math.PI * 1.6 + h;
      const r = envelope(y, a) + 0.07;
      pts.push(V(Math.cos(a) * r, y + Math.sin(i * 1.3) * 0.05, Math.sin(a) * r));
    }
    harnessPts.push(...pts);
    g.add(tube(pts, 0.03, M.wire, 60, 8));
  }
  for (let i = 0; i < counts.sensors; i++) {
    const p = anchor();
    const box = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.035, 0.05), rand() < 0.5 ? M.sensor : M.dark);
    box.position.copy(p);
    box.lookAt(0, p.y, 0);
    g.add(box);
    if (harnessPts.length) {
      const h = harnessPts[Math.floor(rand() * harnessPts.length)];
      g.add(tube([p, p.clone().lerp(h, 0.5).add(V(0, 0.06, 0)), h], 0.006, M.wire, 12, 5));
    }
  }
  for (let i = 0; i < counts.boxes; i++) {
    const p = anchor(1.7, 2.7);
    const box = new THREE.Mesh(new THREE.BoxGeometry(0.13, 0.09, 0.07), M.dark);
    box.position.copy(p).multiplyScalar(1.05);
    box.position.y = p.y;
    box.lookAt(0, p.y, 0);
    g.add(box);
  }
  if (v === 2) {
    // controllers consolidated into boxes
    for (const [x, y, z] of [[-0.2, 2.62, -0.36], [0.36, 1.98, -0.3]]) {
      const box = new THREE.Mesh(new THREE.BoxGeometry(0.26, 0.17, 0.11), M.dark);
      box.position.set(x, y, z);
      box.lookAt(0, y, 0);
      g.add(box);
    }
  }
  if (v < 3) {
    // bolted flanges at every joint
    g.add(flange(0.12, 2.9, [0, 0, 0], M));
    g.add(flange(0.215, 2.315, [0, 0, 0], M, 'y', 22));
    g.add(flange(0.27, 2.05, [0, 0, 0], M, 'y', 24));
    g.add(flange(RC + 0.012, 1.86, [0, 0, 0], M, 'y', 24));
    g.add(flange(0.1, 2.8, P.fuel, M));
    g.add(flange(0.17, 2.27, P.fuel, M, 'y', 18));
    g.add(flange(0.1, 1.98, P.fuel, M));
  }
  if (v === 1) {
    // main-chamber spark igniters (deleted in Raptor 2)
    for (const a of [0.6, 2.4]) {
      const ig = cyl(0.022, 0.022, 0.14, M.copper, [Math.cos(a) * (RC + 0.06), 1.7, Math.sin(a) * (RC + 0.06)]);
      ig.rotation.z = Math.PI / 2;
      ig.rotation.y = -a;
      g.add(ig);
    }
  }

  // vehicle-side heat shield (Raptor 1 and 2)
  if (v < 3) {
    const geo = new THREE.CylinderGeometry(1.02, 0.98, 1.55, 64, 12, true);
    const pa = geo.attributes.position;
    for (let i = 0; i < pa.count; i++) {
      const x = pa.getX(i), z = pa.getZ(i), y = pa.getY(i);
      const a = Math.atan2(z, x);
      const n = 1 + 0.018 * Math.sin(a * 23 + y * 7) + 0.012 * Math.sin(y * 31);
      pa.setX(i, x * n); pa.setZ(i, z * n);
    }
    geo.computeVertexNormals();
    const s = new THREE.Mesh(geo, M.shield);
    s.position.y = 2.2;
    const skirt = lathe([[0.98, 1.43], [0.7, 1.4], [0.42, 1.42], [0.3, 1.5]], M.shield, 64);
    shield.add(s, skirt);
  }

  // Raptor 3: smooth, printed shells that swallow the plumbing
  if (v === 3) {
    const shell = lathe([[0.0, 2.93], [0.14, 2.93], [0.15, 2.72], [0.26, 2.62], [0.3, 2.44], [0.3, 2.2], [0.33, 2.06], [0.3, 1.95], [RC + 0.02, 1.87]], M.printed);
    smooth.add(shell);
    const fShell = new THREE.Mesh(new THREE.CapsuleGeometry(0.21, 0.36, 8, 28), M.printed);
    fShell.position.set(P.fuel[0], 2.27, P.fuel[2]);
    smooth.add(fShell);
    const pb = new THREE.Mesh(new THREE.CapsuleGeometry(0.11, 0.34, 8, 28), M.printed);
    pb.position.set(...P.oxPB);
    smooth.add(pb);
    // one common umbilical instead of dozens of lines
    const umb = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.11, 0.14), M.dark);
    umb.position.set(-0.36, 2.62, -0.2);
    smooth.add(umb, tube([[-0.36, 2.66, -0.2], [-0.34, 2.8, -0.22], [-0.3, 3.0, -0.24]], 0.035, M.wire, 12, 8));
  }
  return { clutter: g, shield, smooth };
}

// ------------------------------------------------------------------ flow

const FLUID_COLORS = { ox: 0x5b93ff, fuel: 0xffb020, oxgas: 0xc084fc, fuelgas: 0xff5b3a, exhaust: 0xffe0a0 };

function flowPaths(curves) {
  const paths = [];
  const add = (c, fluid, density = 26, speed = 0.55) => paths.push({ pts: (c instanceof THREE.Curve ? c : curve(c)).getSpacedPoints(240), fluid, density, speed });
  // oxygen
  add([[0, 3.0, 0], [0, 2.75, 0], [0, 2.5, 0], [0.1, P.oxPumpY, 0.08]], 'ox');
  add(curves.oxDis, 'ox');
  add([[P.oxPB[0], 2.38, P.oxPB[2]], [P.oxPB[0], 2.2, P.oxPB[2]], [P.oxPB[0], 2.06, P.oxPB[2]]], 'ox', 30);
  add([[0.42, 2.08, 0.16], [0.3, 2.14, 0.1], [0.12, 2.17, 0.05], [0, 2.1, 0], [0, 1.95, 0], [0, 1.75, 0]], 'oxgas', 30, 0.7);
  // fuel
  add([[P.fuel[0], 2.9, P.fuel[2]], [P.fuel[0], 2.6, P.fuel[2]], [P.fuel[0], P.fuelPumpY, P.fuel[2]], [-0.7, 2.38, 0.12]], 'fuel');
  add(curves.downcomer, 'fuel', 22, 0.8);
  for (let k = 0; k < 8; k++) {
    const a0 = (k / 8) * Math.PI * 2;
    const pts = [];
    for (let i = 0; i <= 30; i++) {
      const y = P.manifoldY + (i / 30) * (Y_INJ - 0.06 - P.manifoldY);
      const a = a0 + i * 0.02;
      const r = nozzleR(y) + 0.008;
      pts.push(V(Math.cos(a) * r, y, Math.sin(a) * r));
    }
    add(pts, 'fuel', 16, 0.35);
  }
  add(curves.ret, 'fuel', 24);
  add([[P.fuel[0], 1.6, P.fuel[2]], [P.fuel[0], 1.8, P.fuel[2]], [P.fuel[0], 2.05, P.fuel[2]], [-0.5, 2.14, 0.08]], 'fuelgas', 30, 0.7);
  add(curves.hotCurve, 'fuelgas', 30, 0.7);
  add([[-0.24, 1.95, 0.05], [-0.1, 1.85, 0.02], [0, 1.75, 0]], 'fuelgas', 30, 0.7);
  // cross-feeds
  add(curves.xO, 'ox', 12, 0.4);
  add(curves.xF, 'fuel', 12, 0.4);
  // exhaust streamlines
  for (let k = 0; k < 7; k++) {
    const a = (k / 7) * Math.PI * 2;
    const f = 0.35 + 0.5 * ((k * 37) % 7) / 7;
    const pts = [];
    for (let i = 0; i <= 30; i++) {
      const y = 1.8 - (i / 30) * 2.6;
      const r = (y > 0 ? nozzleR(y) : RE + (-y) * 0.12) * f;
      pts.push(V(Math.cos(a) * r, y, Math.sin(a) * r));
    }
    add(pts, 'exhaust', 20, 1.4);
  }
  return paths;
}

function circleSprite() {
  const c = document.createElement('canvas');
  c.width = c.height = 64;
  const x = c.getContext('2d');
  const g = x.createRadialGradient(32, 32, 0, 32, 32, 32);
  g.addColorStop(0, 'rgba(255,255,255,1)');
  g.addColorStop(0.4, 'rgba(255,255,255,0.85)');
  g.addColorStop(1, 'rgba(255,255,255,0)');
  x.fillStyle = g;
  x.fillRect(0, 0, 64, 64);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

class Flow {
  constructor(curves) {
    this.paths = flowPaths(curves);
    let n = 0;
    for (const p of this.paths) {
      let L = 0;
      for (let i = 1; i < p.pts.length; i++) L += p.pts[i].distanceTo(p.pts[i - 1]);
      p.length = L;
      p.count = Math.max(3, Math.round(L * p.density));
      n += p.count;
    }
    const geo = new THREE.BufferGeometry();
    this.pos = new Float32Array(n * 3);
    const col = new Float32Array(n * 3);
    const c = new THREE.Color();
    let j = 0;
    for (const p of this.paths) {
      c.setHex(FLUID_COLORS[p.fluid]);
      for (let i = 0; i < p.count; i++) { col[j * 3] = c.r; col[j * 3 + 1] = c.g; col[j * 3 + 2] = c.b; j++; }
    }
    geo.setAttribute('position', new THREE.BufferAttribute(this.pos, 3));
    geo.setAttribute('color', new THREE.BufferAttribute(col, 3));
    this.points = new THREE.Points(geo, new THREE.PointsMaterial({ size: 0.075, map: circleSprite(), vertexColors: true, transparent: true, depthTest: false, depthWrite: false, blending: THREE.AdditiveBlending, opacity: 0 }));
    this.points.renderOrder = 10;
    this.points.frustumCulled = false;
  }

  update(t) {
    let j = 0;
    for (const p of this.paths) {
      const N = p.pts.length - 1;
      for (let i = 0; i < p.count; i++) {
        const u = (((i / p.count) + (t * p.speed) / p.length) % 1) * N;
        const k = Math.floor(u), f = u - k;
        const a = p.pts[k], b = p.pts[Math.min(N, k + 1)];
        this.pos[j * 3] = a.x + (b.x - a.x) * f;
        this.pos[j * 3 + 1] = a.y + (b.y - a.y) * f;
        this.pos[j * 3 + 2] = a.z + (b.z - a.z) * f;
        j++;
      }
    }
    this.points.geometry.attributes.position.needsUpdate = true;
  }
}

// ------------------------------------------------------------------ plume

function makePlume() {
  const g = new THREE.Group();
  const mat = (inner) => new THREE.ShaderMaterial({
    transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, side: THREE.DoubleSide,
    uniforms: { uTime: { value: 0 }, uAmp: { value: 0 } },
    vertexShader: 'varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }',
    fragmentShader: `varying vec2 vUv; uniform float uTime; uniform float uAmp;
      void main(){
        float y = vUv.y; // 1 at nozzle, 0 at tip
        float flick = 0.85 + 0.15*sin(uTime*38.0 + y*20.0);
        vec3 hot = ${inner ? 'vec3(1.0,0.97,0.88)' : 'vec3(1.0,0.72,0.35)'};
        vec3 cool = vec3(1.0,0.35,0.1);
        vec3 col = mix(cool, hot, pow(y, 1.5));
        float a = pow(y, ${inner ? '2.2' : '1.3'}) * uAmp * flick * ${inner ? '0.9' : '0.55'};
        gl_FragColor = vec4(col * a, a);
      }`,
  });
  const outer = new THREE.Mesh(new THREE.CylinderGeometry(RE * 0.95, 0.12, 2.8, 48, 1, true), mat(false));
  outer.position.y = -1.4;
  const inner = new THREE.Mesh(new THREE.CylinderGeometry(RE * 0.6, 0.05, 2.1, 48, 1, true), mat(true));
  inner.position.y = -1.05;
  g.add(outer, inner);
  const diamonds = [];
  for (let i = 0; i < 4; i++) {
    const d = new THREE.Mesh(new THREE.OctahedronGeometry(0.12 - i * 0.018, 0), new THREE.MeshBasicMaterial({ color: 0xfff6dc, transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false }));
    d.scale.set(1, 1.9, 1);
    d.position.y = -0.45 - i * 0.48;
    g.add(d);
    diamonds.push(d);
  }
  g.userData = { mats: [outer.material, inner.material], diamonds };
  return g;
}

// ------------------------------------------------------------------ one engine instance

class Engine {
  constructor(version, { withShield = false } = {}) {
    this.M = makeMaterials();
    this.root = new THREE.Group();
    const { parts, curves } = buildCore(this.M);
    this.parts = parts;
    this.curves = curves;
    // each part gets its own material copies so it can glow when selected
    for (const id in parts) {
      parts[id].traverse((o) => { if (o.isMesh && !o.userData.inner) o.material = o.material.clone(); });
      parts[id].userData.base = parts[id].position.clone();
      this.root.add(parts[id]);
    }
    this.flow = new Flow(curves);
    this.root.add(this.flow.points);
    this.plume = makePlume();
    this.root.add(this.plume);
    this.fire = 0; this.fireTarget = 0;
    this.xray = 0; this.xrayTarget = 0;
    this.explode = 0;
    this.showShield = withShield;
    this.setVersion(version);
  }

  setVersion(v) {
    this.version = v;
    for (const k of ['clutter', 'shield', 'smooth']) {
      if (this[k]) { this.root.remove(this[k]); this[k].traverse((o) => { if (o.geometry) o.geometry.dispose(); }); }
    }
    const b = buildClutter(this.M, v);
    this.clutter = b.clutter; this.shield = b.shield; this.smooth = b.smooth;
    this.root.add(this.clutter, this.shield, this.smooth);
    // Raptor 3 hides the external volutes inside its printed shells
    for (const id of ['oxPump', 'fuelPump']) this.parts[id].traverse((o) => { if (o.userData.volute) o.visible = v < 3; });
    this.shield.visible = this.showShield;
    this.applyXray(true);
  }

  setShield(on) { this.showShield = on; this.shield.visible = on; }

  allMeshes() {
    const out = [];
    this.root.traverse((o) => { if ((o.isMesh || o.isInstancedMesh) && o !== this.flow.points && !this.plume.children.includes(o)) out.push(o); });
    return out;
  }

  applyXray(force) {
    const x = this.xray;
    if (!force && Math.abs(x - (this._lastX ?? -1)) < 0.004) return;
    this._lastX = x;
    for (const o of this.allMeshes()) {
      const m = o.material;
      if (!m || m === this.M.shield) continue;
      if (m.userData.baseOpacity === undefined) m.userData.baseOpacity = m.opacity;
      const on = x > 0.01;
      m.transparent = on;
      m.depthWrite = !on;
      m.opacity = m.userData.baseOpacity * (1 - 0.84 * x);
      m.needsUpdate = true;
    }
    this.flow.points.material.opacity = x;
  }

  highlight(id) {
    for (const pid in this.parts) {
      this.parts[pid].traverse((o) => {
        if (o.isMesh && o.material && o.material.emissive && !o.userData.inner) o.material.emissive.setHex(pid === id ? 0x2a5bd7 : 0x000000);
      });
    }
    this.selected = id;
  }

  tick(t, dt) {
    const e = 1 - Math.exp(-dt * 5);
    this.fire += (this.fireTarget - this.fire) * e;
    this.xray += (this.xrayTarget - this.xray) * e;
    if (Math.abs(this.xrayTarget - this.xray) < 0.004) this.xray = this.xrayTarget;
    if (Math.abs(this.fireTarget - this.fire) < 0.004) this.fire = this.fireTarget;
    if (this.xray > 0.01) this.flow.update(t);
    this.flow.points.visible = this.xray > 0.01 && this.explode < 0.05;
    this.applyXray();
    const amp = this.fire;
    this.plume.visible = amp > 0.01;
    for (const m of this.plume.userData.mats) { m.uniforms.uTime.value = t; m.uniforms.uAmp.value = amp; }
    this.plume.userData.diamonds.forEach((d, i) => { d.material.opacity = amp * (0.55 - i * 0.1) * (0.85 + 0.15 * Math.sin(t * 30 + i)); });
    const inner = this.parts.nozzle.children.find((o) => o.userData.inner);
    if (inner) inner.material.emissive.setRGB(0.9 * amp, 0.38 * amp, 0.1 * amp);
    for (const id in this.parts) {
      const p = this.parts[id];
      p.position.copy(p.userData.base).addScaledVector(p.userData.explode, this.explode);
    }
    const hideExtras = this.explode > 0.03;
    this.clutter.visible = !hideExtras;
    this.smooth.visible = !hideExtras;
    this.shield.visible = this.showShield && !hideExtras;
    this.plume.visible = this.plume.visible && !hideExtras;
    if (this.selected) {
      const k = 0.55 + 0.45 * Math.sin(t * 4);
      this.parts[this.selected].traverse((o) => { if (o.isMesh && o.material.emissive && !o.userData.inner) o.material.emissive.setRGB(0.16 * k, 0.36 * k, 0.84 * k); });
    }
  }
}

// ------------------------------------------------------------------ viewers

function makeRenderer(container) {
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  container.appendChild(renderer.domElement);
  return renderer;
}

function makeScene(renderer) {
  const scene = new THREE.Scene();
  const pmrem = new THREE.PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  scene.environmentIntensity = 0.55;
  const key = new THREE.DirectionalLight(0xffffff, 1.6);
  key.position.set(3, 5, 4);
  const rim = new THREE.DirectionalLight(0x9ec5ff, 1.2);
  rim.position.set(-4, 2, -3);
  const warm = new THREE.PointLight(0xffa060, 0, 5);
  warm.position.set(0, -1.4, 0.4);
  scene.add(key, rim, new THREE.AmbientLight(0xffffff, 0.15));
  return { scene, warm };
}

function animate(viewer) {
  let last = performance.now();
  let running = false;
  const loop = (now) => {
    if (!viewer.visible || document.hidden) { running = false; return; }
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    viewer.t += dt;
    viewer.frame(dt);
    requestAnimationFrame(loop);
  };
  const kick = () => { if (!running) { running = true; last = performance.now(); requestAnimationFrame(loop); } };
  new IntersectionObserver((es) => { viewer.visible = es[0].isIntersecting; if (viewer.visible) kick(); }, { rootMargin: '150px' }).observe(viewer.container);
  document.addEventListener('visibilitychange', () => { if (!document.hidden) kick(); });
  viewer.kick = kick;
}

export class HeroViewer {
  constructor(container) {
    this.container = container;
    this.t = 0;
    this.renderer = makeRenderer(container);
    const { scene } = makeScene(this.renderer);
    this.scene = scene;
    this.camera = new THREE.PerspectiveCamera(30, 1, 0.1, 100);
    this.spacing = 2.35;
    this.engines = [1, 2, 3].map((v, i) => {
      const e = new Engine(v);
      e.root.position.x = (i - 1) * this.spacing;
      e.root.rotation.y = -0.5;
      scene.add(e.root);
      return e;
    });
    this.reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
    this.labels = [...container.querySelectorAll('[data-hero-label]')];
    new ResizeObserver(() => this.resize()).observe(container);
    this.resize();
    animate(this);
  }

  resize() {
    const w = this.container.clientWidth, h = this.container.clientHeight;
    this.renderer.setSize(w, h, false);
    this.camera.aspect = w / h;
    // fit ~7.4 m of width and ~3.4 m of height
    const vfov = THREE.MathUtils.degToRad(this.camera.fov);
    const hfov = 2 * Math.atan(Math.tan(vfov / 2) * this.camera.aspect);
    this.spacing = this.camera.aspect < 1.2 ? 1.72 : 2.35;
    this.engines.forEach((e, i) => { e.root.position.x = (i - 1) * this.spacing; });
    const width = this.spacing * 2 + 2.9;
    const dist = Math.max(3.9 / (2 * Math.tan(vfov / 2)), width / (2 * Math.tan(hfov / 2)));
    this.camera.position.set(0, 2.0, dist);
    this.camera.lookAt(0, 1.38, 0);
    this.camera.updateProjectionMatrix();
    if (this.kick) this.kick();
  }

  frame(dt) {
    const spin = this.reduced ? 0 : dt * 0.28;
    for (const e of this.engines) { e.root.rotation.y += spin; e.tick(this.t, dt); }
    this.renderer.render(this.scene, this.camera);
    // pin labels under each engine
    const v = new THREE.Vector3();
    this.labels.forEach((el, i) => {
      v.set((i - 1) * this.spacing, -0.12, 0).project(this.camera);
      el.style.top = `${(-v.y * 0.5 + 0.5) * 100}%`;
      el.style.left = `${(v.x * 0.5 + 0.5) * 100}%`;
    });
  }
}

export class ExplorerViewer {
  constructor(container, { hotspotLayer, onSelect }) {
    this.container = container;
    this.t = 0;
    this.renderer = makeRenderer(container);
    const { scene, warm } = makeScene(this.renderer);
    this.scene = scene;
    this.warm = warm;
    this.camera = new THREE.PerspectiveCamera(34, 1, 0.05, 100);
    this.camera.position.set(4.0, 2.3, 5.7);
    this.engine = new Engine(3, { withShield: true });
    scene.add(this.engine.root);
    const controls = new OrbitControls(this.camera, this.renderer.domElement);
    controls.target.set(-0.08, 1.25, 0);
    controls.enableDamping = true;
    controls.enablePan = false;
    controls.minDistance = 2.2;
    controls.maxDistance = 9;
    controls.update();
    this.controls = controls;
    // let the page scroll: wheel zooms only with ctrl/cmd (and trackpad pinch), vertical touch scrolls
    this.renderer.domElement.style.touchAction = 'pan-y';
    container.addEventListener('wheel', (e) => { if (!e.ctrlKey && !e.metaKey) e.stopPropagation(); }, { capture: true });
    controls.addEventListener('change', () => this.kick && this.kick());

    this.onSelect = onSelect;
    this.hotspots = HOTSPOTS.map((h, i) => {
      const b = document.createElement('button');
      b.className = 'hotspot';
      b.type = 'button';
      b.textContent = String(i + 1);
      b.setAttribute('aria-label', h.name);
      b.addEventListener('click', () => this.select(h.id));
      hotspotLayer.appendChild(b);
      return { ...h, el: b, v: V(...h.at) };
    });
    this.hotspotLayer = hotspotLayer;
    new ResizeObserver(() => this.resize()).observe(container);
    this.resize();
    animate(this);
  }

  resize() {
    const w = this.container.clientWidth, h = this.container.clientHeight;
    this.renderer.setSize(w, h, false);
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
    if (this.kick) this.kick();
  }

  select(id) {
    this.engine.highlight(id);
    this.hotspots.forEach((h) => h.el.classList.toggle('on', h.id === id));
    const h = this.hotspots.find((x) => x.id === id);
    if (h && this.onSelect) this.onSelect(h);
    this.kick();
  }

  setVersion(v) { this.engine.setVersion(v); this.kick(); }
  setFlow(on) { this.engine.xrayTarget = on ? 1 : 0; this.kick(); }
  setFire(on) { this.engine.fireTarget = on ? 1 : 0; this.kick(); }
  setShield(on) { this.engine.setShield(on); this.kick(); }
  setLabels(on) { this.hotspotLayer.hidden = !on; this.kick(); }
  setExplode(x) { this.engine.explode = x; this.kick(); }

  frame(dt) {
    this.controls.update();
    this.engine.tick(this.t, dt);
    this.warm.intensity = this.engine.fire * 1.2;
    const ty = 1.25 - 0.45 * this.engine.fire;
    if (Math.abs(this.controls.target.y - ty) > 0.001) { this.controls.target.y = ty; }
    this.renderer.render(this.scene, this.camera);
    const v = new THREE.Vector3();
    const camDir = new THREE.Vector3();
    this.camera.getWorldDirection(camDir);
    for (const h of this.hotspots) {
      const part = this.engine.parts[h.id];
      v.copy(h.v);
      if (part) v.addScaledVector(part.userData.explode, this.engine.explode);
      const toP = v.clone().sub(this.camera.position).normalize();
      const behind = toP.dot(camDir) < 0;
      v.project(this.camera);
      h.el.style.transform = `translate(${(v.x * 0.5 + 0.5) * this.container.clientWidth}px, ${(-v.y * 0.5 + 0.5) * this.container.clientHeight}px) translate(-50%, -50%)`;
      h.el.style.visibility = behind ? 'hidden' : 'visible';
    }
  }
}
