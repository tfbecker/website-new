"use client";

import { useRef, useEffect } from "react";

// Torus parameters
const MAJOR_R = 0.42;
const MINOR_R = 0.14;
const TWO_PI = Math.PI * 2;
const CAMERA_DIST = 1.8;
const U_STEPS = 96;
const V_STEPS = 48;

// Lighting
const KEY_LIGHT = norm(0.4, -0.6, 1.0);
const FILL_LIGHT = norm(-0.3, 0.4, 0.5);

// Rotation
const AUTO_VX = 0.4;
const AUTO_VY = 0.3;
const BLEND = 0.02;

// Font weights for torus brightness - wider range for more dramatic 3D effect
const TORUS_WEIGHTS = [100, 200, 350, 500, 650, 800, 900];
// Note: same weights as header.tsx TW array
const GAP = 3; // buffer samples around torus to exclude bg

function norm(x: number, y: number, z: number) {
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
    baseVerts.push({
      x: (MAJOR_R + MINOR_R * cv) * cu,
      y: (MAJOR_R + MINOR_R * cv) * su,
      z: MINOR_R * sv,
    });
    baseNorms.push({ x: cv * cu, y: cv * su, z: sv });
  }
}

export default function TestTorusPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    let pixW = 0, pixH = 0;
    let fontSize = 12;
    let lineHeight = 16;
    let numRows = 0;

    // Grids
    type Cell = { char: string; x: number; w: number };
    let bgRows: Cell[][] = [];
    let torusRows: Cell[][] = [];

    // Brightness buffer
    let brightBuf: Float32Array;
    let bufW = 0;
    let sampleStep = 8;

    // Rotation state - start tilted like dearlarry
    let angleX = 0.8, angleY = 0.4;
    let velX = AUTO_VX, velY = AUTO_VY;
    let dragging = false, dragLX = 0, dragLY = 0;
    let lastT = 0;

    function buildGrid(word: string, addSpaces: boolean): Cell[][] {
      ctx!.font = `400 ${fontSize}px Arial, sans-serif`;
      const upper = word.toUpperCase();
      const lower = word.toLowerCase();
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
          if (addSpaces) {
            row.push({ char: " ", x, w: sw });
            x += sw;
          }
          if (Math.sin(x * 0.01 + r * 7.3) > 0.2) useUp = !useUp;
        }
        rows.push(row);
      }
      return rows;
    }

    function resize() {
      pixW = Math.round(window.innerWidth * dpr);
      pixH = Math.round(window.innerHeight * dpr);
      canvas!.width = pixW;
      canvas!.height = pixH;

      // Match dearlarry font size (~12-16px at 1x, larger on wider screens)
      fontSize = Math.max(11, Math.min(18, pixW / 85));
      lineHeight = Math.round(fontSize * 1.4);
      numRows = Math.ceil(pixH / lineHeight) + 1;

      bgRows = buildGrid("BECKER", true);
      torusRows = buildGrid("felix", false);

      sampleStep = Math.max(4, Math.round(fontSize * 0.6));
      bufW = Math.ceil(pixW / sampleStep);
      brightBuf = new Float32Array(bufW * numRows);
    }

    resize();
    window.addEventListener("resize", resize);

    function computeBrightBuf() {
      brightBuf.fill(0);
      const cax = Math.cos(angleX), sax = Math.sin(angleX);
      const cay = Math.cos(angleY), say = Math.sin(angleY);
      const viewScale = Math.min(pixW, pixH);

      for (let idx = 0; idx < baseVerts.length; idx++) {
        const v = baseVerts[idx];
        const n = baseNorms[idx];

        // Rotate Y then X
        const rx = v.x * cay + v.z * say;
        const ry1 = v.y;
        const rz1 = -v.x * say + v.z * cay;
        const ry = ry1 * cax - rz1 * sax;
        const rz = ry1 * sax + rz1 * cax;

        const nx = n.x * cay + n.z * say;
        const ny1 = n.y;
        const nz1 = -n.x * say + n.z * cay;
        const ny = ny1 * cax - nz1 * sax;
        const nz = ny1 * sax + nz1 * cax;

        if (nz < 0) continue;

        const scale = viewScale / (rz + CAMERA_DIST);
        const sx = pixW / 2 + rx * scale;
        const sy = pixH / 2 - ry * scale;

        // Lighting
        const diff = Math.max(0, nx * KEY_LIGHT.x + ny * KEY_LIGHT.y + nz * KEY_LIGHT.z);
        const fill = Math.max(0, nx * FILL_LIGHT.x + ny * FILL_LIGHT.y + nz * FILL_LIGHT.z) * 0.4;
        const dotNL = nx * KEY_LIGHT.x + ny * KEY_LIGHT.y + nz * KEY_LIGHT.z;
        const refZ = 2 * dotNL * nz - KEY_LIGHT.z;
        const spec = Math.pow(Math.max(0, refZ), 16) * 0.3;
        const brightness = Math.min(1, Math.pow(diff * 0.6 + fill + spec, 0.7));

        // Splat to a radius of cells to fill gaps between torus points
        const bx = Math.floor(sx / sampleStep);
        const by = Math.floor(sy / lineHeight);
        const SPLAT = 3;

        for (let dy = -SPLAT; dy <= SPLAT; dy++) {
          for (let dx = -SPLAT; dx <= SPLAT; dx++) {
            const cx = bx + dx;
            const cy = by + dy;
            if (cx >= 0 && cx < bufW && cy >= 0 && cy < numRows) {
              // Distance falloff
              const dist = Math.sqrt(dx * dx * sampleStep * sampleStep + dy * dy * lineHeight * lineHeight);
              const maxDist = SPLAT * sampleStep * 1.2;
              if (dist > maxDist) continue;
              const falloff = 1 - (dist / maxDist) * 0.3; // gentle falloff
              const val = brightness * falloff;
              const idx2 = cy * bufW + cx;
              if (val > brightBuf[idx2]) brightBuf[idx2] = val;
            }
          }
        }
      }
    }

    function render(now: number) {
      const t = now / 1000;
      const dt = Math.min(t - (lastT || t), 0.05);
      lastT = t;

      // Update rotation
      if (!dragging) {
        const sp = Math.sqrt(velX * velX + velY * velY);
        const asp = Math.sqrt(AUTO_VX * AUTO_VX + AUTO_VY * AUTO_VY);
        if (sp > 0.001) {
          const ns = sp + (asp - sp) * BLEND;
          velX = (velX / sp) * ns;
          velY = (velY / sp) * ns;
        } else {
          velX = AUTO_VX;
          velY = AUTO_VY;
        }
      }
      angleX += velX * dt;
      angleY += velY * dt;

      // Compute brightness buffer
      computeBrightBuf();

      // Clear
      ctx!.fillStyle = "#dcddd7";
      ctx!.fillRect(0, 0, pixW, pixH);

      // Render all text
      ctx!.textAlign = "left";
      ctx!.textBaseline = "alphabetic";

      // Background: draw where torus ISN'T
      // Vary style per row for typographic interest (like dearlarry)
      ctx!.fillStyle = "rgba(0,0,0,0.13)";
      for (let r = 0; r < bgRows.length && r < numRows; r++) {
        const row = bgRows[r];
        const y = r * lineHeight + fontSize;
        const italic = r % 4 === 0 ? "italic " : "";
        ctx!.font = `${italic}400 ${fontSize}px Arial, sans-serif`;
        for (let ci = 0; ci < row.length; ci++) {
          const c = row[ci];
          if (c.char === " ") continue;
          const sx = Math.floor((c.x + c.w * 0.5) / sampleStep);
          const cx = Math.max(0, Math.min(sx, bufW - 1));

          let near = false;
          for (let gx = -GAP; gx <= GAP; gx++) {
            const s = cx + gx;
            if (s >= 0 && s < bufW && brightBuf[r * bufW + s] > 0.02) {
              near = true; break;
            }
          }
          if (near) continue;
          ctx!.fillText(c.char, c.x, y);
        }
      }

      // Torus: draw where torus IS
      // Group by font for batching
      const batches: Map<string, { char: string; x: number; y: number }[]> = new Map();
      for (let r = 0; r < torusRows.length && r < numRows; r++) {
        const row = torusRows[r];
        const y = r * lineHeight + fontSize;
        for (let ci = 0; ci < row.length; ci++) {
          const c = row[ci];
          if (c.char === " ") continue;
          const sx = Math.floor((c.x + c.w * 0.5) / sampleStep);
          const cx = Math.max(0, Math.min(sx, bufW - 1));
          const tb = brightBuf[r * bufW + cx];
          if (tb < 0.02) continue;

          const mapped = Math.pow(1 - tb, 0.6);
          const wIdx = Math.min(TORUS_WEIGHTS.length - 1, Math.max(0,
            Math.round(mapped * (TORUS_WEIGHTS.length - 1))
          ));
          const italic = r % 3 === 0 ? "italic " : "";
          const font = `${italic}${TORUS_WEIGHTS[wIdx]} ${fontSize}px Arial, sans-serif`;
          let batch = batches.get(font);
          if (!batch) { batch = []; batches.set(font, batch); }
          batch.push({ char: c.char, x: c.x, y });
        }
      }

      ctx!.fillStyle = "#ff1900";
      for (const [font, chars] of batches) {
        ctx!.font = font;
        for (const p of chars) {
          ctx!.fillText(p.char, p.x, p.y);
        }
      }

      requestAnimationFrame(render);
    }

    requestAnimationFrame(render);

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
      window.removeEventListener("resize", resize);
      canvas.removeEventListener("mousedown", onMD);
      window.removeEventListener("mousemove", onMM);
      window.removeEventListener("mouseup", onMU);
      canvas.removeEventListener("touchstart", onTS);
      canvas.removeEventListener("touchmove", onTM);
      canvas.removeEventListener("touchend", onTE);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        cursor: "grab",
      }}
    />
  );
}
