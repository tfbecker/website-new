"use client";

import { useRef, useState, useMemo, useEffect } from "react";

// Torus parameters
const MAJOR_R = 0.42;
const MINOR_R = 0.14;
const TWO_PI = Math.PI * 2;
const CAMERA_DIST = 2.0;
const U_STEPS = 72;
const V_STEPS = 36;

// Lighting
// Frontal lighting for even edge boldness around the ring
const KL = normVec(0.1, -0.2, 1.0);
const FL = normVec(-0.1, 0.15, 0.8);

// Rotation
const AUTO_VX = 0.4, AUTO_VY = 0.3, BLEND = 0.02;

// Font weights for torus brightness
const TW = [100, 200, 350, 500, 650, 800, 900];
const SAMPLE_STEP = 3;

function normVec(x: number, y: number, z: number) {
  const l = Math.sqrt(x * x + y * y + z * z);
  return { x: x / l, y: y / l, z: z / l };
}

// Pre-compute torus geometry
const baseVerts: { x: number; y: number; z: number }[] = [];
const baseNorms: { x: number; y: number; z: number }[] = [];
for (let i = 0; i < U_STEPS; i++) {
  const u = (i / U_STEPS) * TWO_PI;
  const cu = Math.cos(u), su = Math.sin(u);
  for (let j = 0; j < V_STEPS; j++) {
    const v = (j / V_STEPS) * TWO_PI;
    const cv = Math.cos(v), sv = Math.sin(v);
    baseVerts.push({ x: (MAJOR_R + MINOR_R * cv) * cu, y: (MAJOR_R + MINOR_R * cv) * su, z: MINOR_R * sv });
    baseNorms.push({ x: cv * cu, y: cv * su, z: sv });
  }
}

type Cell = { char: string; x: number; w: number };

const Header: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [showEmail, setShowEmail] = useState(false);
  const [copied, setCopied] = useState(false);

  const addr = useMemo(() => {
    const p = [102,101,108,105,120];
    const d = [98,101,99,107,101,114];
    const t = [115,111];
    return p.map(c=>String.fromCharCode(c)).join('') + String.fromCharCode(64) + d.map(c=>String.fromCharCode(c)).join('') + String.fromCharCode(46) + t.map(c=>String.fromCharCode(c)).join('');
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    let pixW = 0, pixH = 0;
    let fontSize = 14;
    let lineHeight = 18;
    let numRows = 0;
    let bgRows: Cell[][] = [];
    let torusRows: Cell[][] = [];
    let brightBuf: Float32Array;
    let zBuf: Float32Array;
    let bufW = 0;
    let sampleStep = SAMPLE_STEP;

    // Start face-on with slight tilt (donut visible)
    let angleX = 0, angleY = 0.4;
    let velX = AUTO_VX, velY = AUTO_VY;
    let dragging = false, dragLX = 0, dragLY = 0;
    let lastT = 0;
    let animId = 0;

    // Expose state for screenshot tooling (Puppeteer can set angles/freeze)
    const torusCtrl = { setAngle: (x: number, y: number) => { angleX = x; angleY = y; }, freeze: () => { velX = 0; velY = 0; } };
    (window as unknown as Record<string, unknown>).__torusCtrl = torusCtrl;

    // Detect Geist font from CSS variable set by next/font/google
    let fontFam = "Arial, Helvetica, sans-serif";
    try {
      const val = getComputedStyle(document.body).getPropertyValue("--font-geist-sans").trim();
      if (val) fontFam = val;
    } catch { /* fallback */ }

    // Projection arrays for quad rasterization
    const vertCount = U_STEPS * V_STEPS;
    const projX = new Float32Array(vertCount);
    const projY = new Float32Array(vertCount);
    const projZ = new Float32Array(vertCount);

    function pointInTriangle(px: number, py: number, ax: number, ay: number, bx: number, by: number, cx: number, cy: number) {
      const d1 = (px - bx) * (ay - by) - (ax - bx) * (py - by);
      const d2 = (px - cx) * (by - cy) - (bx - cx) * (py - cy);
      const d3 = (px - ax) * (cy - ay) - (cx - ax) * (py - ay);
      return !((d1 < 0 || d2 < 0 || d3 < 0) && (d1 > 0 || d2 > 0 || d3 > 0));
    }

    function pointInQuad(px: number, py: number, x0: number, y0: number, x1: number, y1: number, x2: number, y2: number, x3: number, y3: number) {
      return pointInTriangle(px, py, x0, y0, x1, y1, x2, y2) || pointInTriangle(px, py, x0, y0, x2, y2, x3, y3);
    }

    function buildGrid(word: string, addSpaces: boolean): Cell[][] {
      ctx!.font = `400 ${fontSize}px ${fontFam}`;
      const upper = word.toUpperCase(), lower = word.toLowerCase();
      const uw: number[] = [], lw: number[] = [];
      for (let i = 0; i < word.length; i++) {
        uw.push(ctx!.measureText(upper[i]).width);
        lw.push(ctx!.measureText(lower[i]).width);
      }
      const sw = ctx!.measureText(" ").width;
      const rows: Cell[][] = [];
      for (let r = 0; r < numRows; r++) {
        const row: Cell[] = [];
        let x = r % 2 === 1 ? -fontSize * 1.5 : 0;
        let useUp = r % 3 !== 0;
        while (x < pixW + fontSize * 3) {
          const w = useUp ? upper : lower;
          const ws = useUp ? uw : lw;
          for (let ci = 0; ci < w.length; ci++) {
            row.push({ char: w[ci], x, w: ws[ci] });
            x += ws[ci];
          }
          if (addSpaces) { row.push({ char: " ", x, w: sw }); x += sw; }
          if (Math.sin(x * 0.01 + r * 7.3) > 0.2) useUp = !useUp;
        }
        rows.push(row);
      }
      return rows;
    }

    function resize() {
      const rect = container!.getBoundingClientRect();
      pixW = Math.round(rect.width * dpr);
      pixH = Math.round(rect.height * dpr);
      canvas!.width = pixW;
      canvas!.height = pixH;

      fontSize = pixW / dpr < 768 ? 8 : 11;
      lineHeight = pixW / dpr < 768 ? 10 : 13;
      numRows = Math.ceil(pixH / lineHeight) + 1;

      bgRows = buildGrid("BECKER", true);
      torusRows = buildGrid("hiFelix", false);

      sampleStep = SAMPLE_STEP;
      bufW = Math.ceil(pixW / sampleStep);
      brightBuf = new Float32Array(bufW * numRows);
      zBuf = new Float32Array(bufW * numRows);
    }

    const ro = new ResizeObserver(resize);
    ro.observe(container);
    resize();

    function computeBuf() {
      brightBuf.fill(0);
      zBuf.fill(-Infinity);
      const cax = Math.cos(angleX), sax = Math.sin(angleX);
      const cay = Math.cos(angleY), say = Math.sin(angleY);
      const fov = Math.min(pixW, pixH) * 1.6;

      // Project all vertices
      for (let i = 0; i < U_STEPS; i++) {
        for (let j = 0; j < V_STEPS; j++) {
          const idx = i * V_STEPS + j;
          const v = baseVerts[idx];
          const rx = v.x * cay + v.z * say;
          const ry1 = v.y, rz1 = -v.x * say + v.z * cay;
          const ry = ry1 * cax - rz1 * sax, rz = ry1 * sax + rz1 * cax;
          projX[idx] = pixW / 2 + rx * fov / (CAMERA_DIST - rz);
          projY[idx] = pixH / 2 + ry * fov / (CAMERA_DIST - rz);
          projZ[idx] = rz;
        }
      }

      // Rasterize quads with Z-buffer
      for (let i = 0; i < U_STEPS; i++) {
        const ni = (i + 1) % U_STEPS;
        for (let j = 0; j < V_STEPS; j++) {
          const nj = (j + 1) % V_STEPS;
          const i0 = i * V_STEPS + j;
          const i1 = ni * V_STEPS + j;
          const i2 = i * V_STEPS + nj;
          const i3 = ni * V_STEPS + nj;

          // Average normal for lighting
          const n0 = baseNorms[i0], n1 = baseNorms[i1], n2 = baseNorms[i2], n3 = baseNorms[i3];
          const anx = (n0.x + n1.x + n2.x + n3.x) * 0.25;
          const avgNy = (n0.y + n1.y + n2.y + n3.y) * 0.25;
          const anz = (n0.z + n1.z + n2.z + n3.z) * 0.25;
          // Rotate normal
          const rnx = anx * cay + anz * say;
          const rny1 = avgNy, rnz1 = -anx * say + anz * cay;
          const rny = rny1 * cax - rnz1 * sax;
          const rnz = rny1 * sax + rnz1 * cax;

          // Lighting
          const diff = Math.max(0, rnx * KL.x + rny * KL.y + rnz * KL.z);
          const fill = Math.max(0, rnx * FL.x + rny * FL.y + rnz * FL.z) * 0.4;
          const facing = Math.max(0, rnz);
          const hx = KL.x, hy = KL.y, hz = KL.z + 1;
          const hl = Math.sqrt(hx * hx + hy * hy + hz * hz);
          const specDot = (rnx * hx + rny * hy + rnz * hz) / hl;
          const spec = Math.pow(Math.max(0, specDot), 16) * 0.3;
          const brightness = Math.min(1, Math.pow(diff * 0.5 + fill + facing * 0.2 + spec + 0.05, 0.7));

          const avgZ = (projZ[i0] + projZ[i1] + projZ[i2] + projZ[i3]) * 0.25;

          // Project quad corners to buffer coords
          const sx0 = projX[i0] / sampleStep, sy0 = projY[i0] / lineHeight;
          const sx1 = projX[i1] / sampleStep, sy1 = projY[i1] / lineHeight;
          const sx2 = projX[i2] / sampleStep, sy2 = projY[i2] / lineHeight;
          const sx3 = projX[i3] / sampleStep, sy3 = projY[i3] / lineHeight;

          const minC = Math.max(0, Math.floor(Math.min(sx0, sx1, sx2, sx3)));
          const maxC = Math.min(bufW - 1, Math.ceil(Math.max(sx0, sx1, sx2, sx3)));
          const minR = Math.max(0, Math.floor(Math.min(sy0, sy1, sy2, sy3)));
          const maxR = Math.min(numRows - 1, Math.ceil(Math.max(sy0, sy1, sy2, sy3)));

          for (let r = minR; r <= maxR; r++) {
            for (let c = minC; c <= maxC; c++) {
              const cellIdx = r * bufW + c;
              if (avgZ > zBuf[cellIdx]) {
                const px = c + 0.5, py = r + 0.5;
                if (pointInQuad(px, py, sx0, sy0, sx1, sy1, sx3, sy3, sx2, sy2)) {
                  zBuf[cellIdx] = avgZ;
                  brightBuf[cellIdx] = brightness;
                }
              }
            }
          }
        }
      }
    }

    function render(now: number) {
      const t = now / 1000;
      const dt = Math.min(t - (lastT || t), 0.05);
      lastT = t;

      if (pixW === 0 || pixH === 0) { animId = requestAnimationFrame(render); return; }

      if (!dragging) {
        const sp = Math.sqrt(velX * velX + velY * velY);
        const asp = Math.sqrt(AUTO_VX * AUTO_VX + AUTO_VY * AUTO_VY);
        if (sp > 0.001) {
          const ns = sp + (asp - sp) * BLEND;
          velX = (velX / sp) * ns; velY = (velY / sp) * ns;
        } else { velX = AUTO_VX; velY = AUTO_VY; }
      }
      angleX += velX * dt;
      angleY += velY * dt;

      computeBuf();

      ctx!.fillStyle = "#dcddd7";
      ctx!.fillRect(0, 0, pixW, pixH);
      ctx!.textAlign = "left";
      ctx!.textBaseline = "alphabetic";

      // Background text with large gap zone (horizontal + vertical)
      const GAP_SAMPLES = Math.ceil(fontSize * 2 / sampleStep);
      const rowsToCheck = Math.ceil(GAP_SAMPLES * sampleStep / lineHeight);
      ctx!.fillStyle = "rgba(0,0,0,0.13)";
      for (let r = 0; r < bgRows.length && r < numRows; r++) {
        const row = bgRows[r], y = r * lineHeight + fontSize;
        const italic = r % 4 === 0 ? "italic " : "";
        ctx!.font = `${italic}400 ${fontSize}px ${fontFam}`;
        for (let ci = 0; ci < row.length; ci++) {
          const c = row[ci];
          if (c.char === " ") continue;
          const sx = Math.floor((c.x + c.w * 0.5) / sampleStep);
          const cx = Math.max(0, Math.min(sx, bufW - 1));
          let near = false;
          // Horizontal gap check
          for (let gx = -GAP_SAMPLES; gx <= GAP_SAMPLES; gx++) {
            const s = cx + gx;
            if (s >= 0 && s < bufW && brightBuf[r * bufW + s] > 0.02) { near = true; break; }
          }
          // Vertical gap check
          if (!near) {
            for (let gy = -rowsToCheck; gy <= rowsToCheck; gy++) {
              const sr = r + gy;
              if (sr >= 0 && sr < numRows && brightBuf[sr * bufW + cx] > 0.02) { near = true; break; }
            }
          }
          if (near) continue;
          ctx!.fillText(c.char, c.x, y);
        }
      }

      // Torus text
      const batches: Map<string, { char: string; x: number; y: number }[]> = new Map();
      for (let r = 0; r < torusRows.length && r < numRows; r++) {
        const row = torusRows[r], y = r * lineHeight + fontSize;
        for (let ci = 0; ci < row.length; ci++) {
          const c = row[ci];
          if (c.char === " ") continue;
          const sx = Math.floor((c.x + c.w * 0.5) / sampleStep);
          const cx = Math.max(0, Math.min(sx, bufW - 1));
          const tb = brightBuf[r * bufW + cx];
          if (tb < 0.02) continue;
          // Linear mapping: bright surface = thin, grazing edge = bold
          const wIdx = Math.min(TW.length - 1, Math.max(0, Math.round((1 - tb) * (TW.length - 1))));
          const italic = r % 3 === 0 ? "italic " : "";
          const font = `${italic}${TW[wIdx]} ${fontSize}px ${fontFam}`;
          let batch = batches.get(font);
          if (!batch) { batch = []; batches.set(font, batch); }
          batch.push({ char: c.char, x: c.x, y });
        }
      }
      ctx!.fillStyle = "#ff1900";
      for (const [font, chars] of batches) {
        ctx!.font = font;
        for (const p of chars) ctx!.fillText(p.char, p.x, p.y);
      }

      animId = requestAnimationFrame(render);
    }

    animId = requestAnimationFrame(render);

    // Interaction
    const onMD = (e: MouseEvent) => { dragging = true; dragLX = e.clientX; dragLY = e.clientY; velX = 0; velY = 0; };
    const onMM = (e: MouseEvent) => { if (!dragging) return; const dx = e.clientX - dragLX; const dy = e.clientY - dragLY; angleX += dx * 0.005; angleY -= dy * 0.005; velX = dx * 0.3; velY = -dy * 0.3; dragLX = e.clientX; dragLY = e.clientY; };
    const onMU = () => { dragging = false; };
    const onTS = (e: TouchEvent) => { if (e.touches.length !== 1) return; dragging = true; dragLX = e.touches[0].clientX; dragLY = e.touches[0].clientY; velX = 0; velY = 0; };
    const onTM = (e: TouchEvent) => { if (!dragging || e.touches.length !== 1) return; e.preventDefault(); const dx = e.touches[0].clientX - dragLX; const dy = e.touches[0].clientY - dragLY; angleX += dx * 0.005; angleY -= dy * 0.005; velX = dx * 0.3; velY = -dy * 0.3; dragLX = e.touches[0].clientX; dragLY = e.touches[0].clientY; };
    const onTE = () => { dragging = false; };

    canvas.addEventListener("mousedown", onMD);
    window.addEventListener("mousemove", onMM);
    window.addEventListener("mouseup", onMU);
    canvas.addEventListener("touchstart", onTS, { passive: true });
    canvas.addEventListener("touchmove", onTM, { passive: false });
    canvas.addEventListener("touchend", onTE);

    return () => {
      cancelAnimationFrame(animId);
      ro.disconnect();
      canvas.removeEventListener("mousedown", onMD);
      window.removeEventListener("mousemove", onMM);
      window.removeEventListener("mouseup", onMU);
      canvas.removeEventListener("touchstart", onTS);
      canvas.removeEventListener("touchmove", onTM);
      canvas.removeEventListener("touchend", onTE);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-[85vh] md:h-[90vh] bg-[#dcddd7] text-black font-calendas"
    >
      <canvas
        ref={canvasRef}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          cursor: "grab",
        }}
      />

      {/* Top bar: name left, nav right */}
      <div className="absolute top-0 left-0 right-0 z-10 pointer-events-none flex justify-between items-start px-4 md:px-8 pt-4 md:pt-6">
        <div className="pointer-events-auto">
          <h1 className="text-2xl md:text-4xl font-bold tracking-tight leading-tight">
            Hi - I&apos;m Felix
          </h1>
          <p className="text-[10px] md:text-xs tracking-widest uppercase text-gray-600 mt-0.5">
            Professional scriptkiddie
          </p>
        </div>

        <nav className="hidden sm:flex gap-4 md:gap-6 text-xs md:text-sm tracking-wide uppercase pointer-events-auto pt-1">
          <a href="https://github.com/tfbecker" target="_blank" rel="noopener noreferrer" className="hover:opacity-60">GitHub</a>
          <a href="https://www.linkedin.com/in/felix-becker-2ba413140/" target="_blank" rel="noopener noreferrer" className="hover:opacity-60">LinkedIn</a>
          <a href="https://x.com/fffbecker" target="_blank" rel="noopener noreferrer" className="hover:opacity-60">Twitter</a>
          <a href="/feed.xml" target="_blank" rel="noopener noreferrer" className="hover:opacity-60">RSS</a>
          <a href="#" onClick={(e) => { e.preventDefault(); setShowEmail(true); setCopied(false); }} className="hover:opacity-60 cursor-pointer">Email</a>
        </nav>

        <nav className="sm:hidden flex flex-col items-end gap-1 text-xs pointer-events-auto pt-1">
          <a href="https://github.com/tfbecker" target="_blank" rel="noopener noreferrer">GitHub</a>
          <a href="https://www.linkedin.com/in/felix-becker-2ba413140/" target="_blank" rel="noopener noreferrer">LinkedIn</a>
          <a href="https://x.com/fffbecker" target="_blank" rel="noopener noreferrer">Twitter</a>
          <a href="#" onClick={(e) => { e.preventDefault(); setShowEmail(true); setCopied(false); }} className="cursor-pointer">Email</a>
        </nav>
      </div>

      {showEmail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" onClick={() => setShowEmail(false)}>
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
          <div className="relative bg-[#dcddd7] text-black px-8 py-6 shadow-lg max-w-sm w-full mx-4" onClick={e => e.stopPropagation()}>
            <button onClick={() => setShowEmail(false)} className="absolute top-3 right-4 text-xl leading-none hover:opacity-60">&times;</button>
            <p className="text-sm mb-3 font-calendas">Reach me at</p>
            <p className="text-lg md:text-xl font-calendas select-all break-all">{addr}</p>
            <button
              onClick={() => { navigator.clipboard.writeText(addr); setCopied(true); }}
              className="mt-4 text-sm underline underline-offset-2 hover:opacity-60 font-calendas"
            >
              {copied ? "Copied!" : "Copy to clipboard"}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export { Header }
