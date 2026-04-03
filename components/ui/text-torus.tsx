"use client";

import { useRef, useEffect, useCallback } from "react";

interface TextTorusProps {
  /** Word rendered on the torus surface */
  torusWord?: string;
  /** Word repeated in the background */
  bgWord?: string;
  bgColor?: string;
  torusColor?: string;
  bgTextColor?: string;
  className?: string;
}

// Torus parameters
const MAJOR_R = 0.42;
const MINOR_R = 0.14;
const TWO_PI = Math.PI * 2;
const CAMERA_DIST = 1.8;

// Lighting
const KEY_LIGHT = normalize({ x: 0.4, y: -0.6, z: 1.0 });
const FILL_LIGHT = normalize({ x: -0.3, y: 0.4, z: 0.5 });

// Auto-rotation speeds (rad/s)
const AUTO_VEL_X = 0.4;
const AUTO_VEL_Y = 0.3;
const BLEND_RATE = 0.02;

// Torus font weights (brightness-mapped)
const TORUS_WEIGHTS = [200, 375, 550, 725, 900];

// Number of buffer samples around torus to exclude bg text
const GAP_SAMPLES = 2;

function normalize(v: { x: number; y: number; z: number }) {
  const l = Math.sqrt(v.x * v.x + v.y * v.y + v.z * v.z);
  return { x: v.x / l, y: v.y / l, z: v.z / l };
}

// Pre-compute base torus geometry
function buildTorusGeometry(uSteps: number, vSteps: number) {
  const verts: { x: number; y: number; z: number }[] = [];
  const normals: { x: number; y: number; z: number }[] = [];

  for (let i = 0; i < uSteps; i++) {
    const u = (i / uSteps) * TWO_PI;
    const cu = Math.cos(u), su = Math.sin(u);
    for (let j = 0; j < vSteps; j++) {
      const v = (j / vSteps) * TWO_PI;
      const cv = Math.cos(v), sv = Math.sin(v);
      verts.push({
        x: (MAJOR_R + MINOR_R * cv) * cu,
        y: (MAJOR_R + MINOR_R * cv) * su,
        z: MINOR_R * sv,
      });
      normals.push({
        x: cv * cu,
        y: cv * su,
        z: sv,
      });
    }
  }
  return { verts, normals };
}

// Grid cell type
interface GridCell {
  char: string;
  x: number;
  width: number;
}

// Build a text grid of repeating word for the full canvas width
// addSpaces: background text has spaces between words, torus text is continuous
function buildTextGrid(
  ctx: CanvasRenderingContext2D,
  pixW: number,
  pixH: number,
  word: string,
  fontSize: number,
  fontFamily: string,
  lineHeight: number,
  addSpaces: boolean
) {
  const rows: GridCell[][] = [];
  const numRows = Math.ceil(pixH / lineHeight) + 1;

  // Measure all char widths at base weight
  ctx.font = `400 ${fontSize}px ${fontFamily}`;
  const upperWord = word.toUpperCase();
  const lowerWord = word.toLowerCase();

  const upperWidths: number[] = [];
  const lowerWidths: number[] = [];
  for (let i = 0; i < word.length; i++) {
    upperWidths.push(ctx.measureText(upperWord[i]).width);
    lowerWidths.push(ctx.measureText(lowerWord[i]).width);
  }
  const spaceWidth = ctx.measureText(" ").width;

  for (let r = 0; r < numRows; r++) {
    const row: GridCell[] = [];
    let x = r % 2 === 1 ? -fontSize * 1.5 : 0; // stagger odd rows
    let useUpper = r % 3 !== 0; // vary case per row

    while (x < pixW + fontSize * 3) {
      const w = useUpper ? upperWord : lowerWord;
      const widths = useUpper ? upperWidths : lowerWidths;

      for (let ci = 0; ci < w.length; ci++) {
        row.push({ char: w[ci], x, width: widths[ci] });
        x += widths[ci];
      }

      if (addSpaces) {
        // Background text: "hi hi hi hi..." with spaces
        row.push({ char: " ", x, width: spaceWidth });
        x += spaceWidth;
      }

      // Toggle case occasionally for variety
      if (Math.sin(x * 0.01 + r * 7.3) > 0.2) useUpper = !useUpper;
    }
    rows.push(row);
  }
  return rows;
}

const TextTorus: React.FC<TextTorusProps> = ({
  torusWord = "felix",
  bgWord = "hi",
  bgColor = "#dcddd7",
  torusColor = "#ff1900",
  bgTextColor = "rgba(0,0,0,0.13)",
  className,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const stateRef = useRef({
    angleX: 0,
    angleY: 0,
    velX: AUTO_VEL_X,
    velY: AUTO_VEL_Y,
    dragging: false,
    dragLastX: 0,
    dragLastY: 0,
    lastTime: 0,
    animId: 0,
    pixW: 0,
    pixH: 0,
  });

  const getSegments = useCallback((width: number): [number, number] => {
    return width < 600 ? [48, 24] : [72, 36];
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const state = stateRef.current;
    let geometry = buildTorusGeometry(72, 36);
    let currentSegments: [number, number] = [72, 36];

    // Text grid state
    let bgGrid: GridCell[][] = [];
    let torusGrid: GridCell[][] = [];
    let fontSize = 12;
    let lineHeight = 16;
    let numRows = 0;

    // Brightness buffer (screen-space, sampled by text grids)
    let brightBuf: Float32Array = new Float32Array(0);
    let bufW = 0;
    let bufH = 0;
    let sampleStep = 8;

    // Font: resolve the CSS variable --font-geist-sans to the actual font family
    let fontFamily = "Arial, Helvetica, sans-serif";
    try {
      const probe = document.createElement("span");
      probe.style.fontFamily = "var(--font-geist-sans)";
      probe.style.position = "absolute";
      probe.style.visibility = "hidden";
      document.body.appendChild(probe);
      const computed = getComputedStyle(probe).fontFamily;
      document.body.removeChild(probe);
      if (computed && computed !== "var(--font-geist-sans)") {
        fontFamily = computed;
      }
    } catch {
      // fallback already set
    }

    function resize() {
      const dpr = window.devicePixelRatio || 1;
      const rect = container!.getBoundingClientRect();
      // Fallback to parent dimensions if container reports 0
      const rw = rect.width || container!.parentElement?.clientWidth || window.innerWidth;
      const rh = rect.height || container!.parentElement?.clientHeight || window.innerHeight;
      const w = Math.round(rw * dpr);
      const h = Math.round(rh * dpr);
      if (w !== state.pixW || h !== state.pixH) {
        canvas!.width = w;
        canvas!.height = h;
        state.pixW = w;
        state.pixH = h;

        const segs = getSegments(rw);
        if (segs[0] !== currentSegments[0] || segs[1] !== currentSegments[1]) {
          currentSegments = segs;
          geometry = buildTorusGeometry(segs[0], segs[1]);
        }

        // Recompute text grids
        fontSize = Math.max(9, Math.min(14, w / 110));
        lineHeight = Math.round(fontSize * 1.4);
        numRows = Math.ceil(h / lineHeight) + 1;

        bgGrid = buildTextGrid(ctx!, w, h, bgWord, fontSize, fontFamily, lineHeight, true);
        torusGrid = buildTextGrid(ctx!, w, h, torusWord, fontSize, fontFamily, lineHeight, false);

        // Resize brightness buffer
        sampleStep = Math.max(4, Math.round(fontSize * 0.6));
        bufW = Math.ceil(w / sampleStep);
        bufH = numRows;
        brightBuf = new Float32Array(bufW * bufH);
      }
    }

    const ro = new ResizeObserver(resize);
    ro.observe(container);
    resize();

    // --- Compute torus brightness buffer ---
    function computeTorusBuf() {
      const { pixW, pixH } = state;
      // Clear buffer
      brightBuf.fill(0);

      const cax = Math.cos(state.angleX), sax = Math.sin(state.angleX);
      const cay = Math.cos(state.angleY), say = Math.sin(state.angleY);
      const { verts, normals } = geometry;
      const viewScale = Math.min(pixW, pixH);

      for (let idx = 0; idx < verts.length; idx++) {
        const vert = verts[idx];
        const norm = normals[idx];

        // Rotate Y then X
        const rx = vert.x * cay + vert.z * say;
        let ry = vert.y;
        let rz = -vert.x * say + vert.z * cay;
        const ry2 = ry * cax - rz * sax;
        const rz2 = ry * sax + rz * cax;
        ry = ry2;
        rz = rz2;

        // Rotate normal
        const nx = norm.x * cay + norm.z * say;
        let ny = norm.y;
        let nz = -norm.x * say + norm.z * cay;
        const ny2 = ny * cax - nz * sax;
        const nz2 = ny * sax + nz * cax;
        ny = ny2;
        nz = nz2;

        // Back-face culling
        if (nz < 0.0) continue;

        // Perspective projection
        const scale = viewScale / (rz + CAMERA_DIST);
        const sx = pixW / 2 + rx * scale;
        const sy = pixH / 2 - ry * scale;

        // Lighting
        const diffuse = Math.max(0, nx * KEY_LIGHT.x + ny * KEY_LIGHT.y + nz * KEY_LIGHT.z);
        const fill = Math.max(0, nx * FILL_LIGHT.x + ny * FILL_LIGHT.y + nz * FILL_LIGHT.z) * 0.4;
        const dotNL = nx * KEY_LIGHT.x + ny * KEY_LIGHT.y + nz * KEY_LIGHT.z;
        const refZ = 2 * dotNL * nz - KEY_LIGHT.z;
        const spec = Math.pow(Math.max(0, refZ), 16) * 0.3;
        const brightness = Math.min(1, Math.pow(diffuse * 0.6 + fill + spec, 0.7));

        // Map to buffer position
        const bx = Math.floor(sx / sampleStep);
        const by = Math.floor(sy / lineHeight);

        if (bx >= 0 && bx < bufW && by >= 0 && by < bufH) {
          const bufIdx = by * bufW + bx;
          // Keep max brightness (closest/brightest point wins)
          if (brightness > brightBuf[bufIdx]) {
            brightBuf[bufIdx] = brightness;
          }
        }
      }
    }

    // --- Render loop ---
    function render(now: number) {
      const t = now / 1000;
      const dt = Math.min(t - (state.lastTime || t), 0.05);
      state.lastTime = t;

      const { pixW, pixH } = state;
      if (pixW === 0 || pixH === 0) {
        state.animId = requestAnimationFrame(render);
        return;
      }

      // Update rotation
      if (!state.dragging) {
        const speed = Math.sqrt(state.velX * state.velX + state.velY * state.velY);
        const autoSpeed = Math.sqrt(AUTO_VEL_X * AUTO_VEL_X + AUTO_VEL_Y * AUTO_VEL_Y);
        if (speed > 0.001) {
          const dirX = state.velX / speed;
          const dirY = state.velY / speed;
          const newSpeed = speed + (autoSpeed - speed) * BLEND_RATE;
          state.velX = dirX * newSpeed;
          state.velY = dirY * newSpeed;
        } else {
          state.velX = AUTO_VEL_X;
          state.velY = AUTO_VEL_Y;
        }
      }
      state.angleX += state.velX * dt;
      state.angleY += state.velY * dt;

      // Compute torus brightness buffer
      computeTorusBuf();

      // Clear canvas
      ctx!.fillStyle = bgColor;
      ctx!.fillRect(0, 0, pixW, pixH);

      // Collect all draw calls, grouped by font string for batching
      const draws: { font: string; color: string; char: string; x: number; y: number }[] = [];

      // --- Background text: visible where torus ISN'T ---
      for (let r = 0; r < bgGrid.length && r < numRows; r++) {
        const row = bgGrid[r];
        const y = r * lineHeight + fontSize;

        for (let ci = 0; ci < row.length; ci++) {
          const cell = row[ci];
          if (cell.char === " ") continue;

          // Sample brightness buffer at cell center
          const sampleX = Math.floor((cell.x + cell.width * 0.5) / sampleStep);
          const clampedX = Math.max(0, Math.min(sampleX, bufW - 1));

          // Check if near torus (with gap zone)
          let nearTorus = false;
          for (let gx = -GAP_SAMPLES; gx <= GAP_SAMPLES; gx++) {
            const sx = clampedX + gx;
            if (sx >= 0 && sx < bufW && brightBuf[r * bufW + sx] > 0.02) {
              nearTorus = true;
              break;
            }
          }
          if (nearTorus) continue;

          // Background styling - slight weight variation
          const weight = 400;
          const font = `${weight} ${fontSize}px ${fontFamily}`;
          draws.push({ font, color: bgTextColor, char: cell.char, x: cell.x, y });
        }
      }

      // --- Torus text: visible where torus IS ---
      for (let r = 0; r < torusGrid.length && r < numRows; r++) {
        const row = torusGrid[r];
        const y = r * lineHeight + fontSize;

        for (let ci = 0; ci < row.length; ci++) {
          const cell = row[ci];
          if (cell.char === " ") continue;

          // Sample brightness buffer
          const sampleX = Math.floor((cell.x + cell.width * 0.5) / sampleStep);
          const clampedX = Math.max(0, Math.min(sampleX, bufW - 1));
          const tb = brightBuf[r * bufW + clampedX];

          if (tb < 0.02) continue; // only draw on torus

          // Map brightness to weight (inverted: bright = thin, dark = bold)
          const mappedVal = 1 - tb;
          const twIdx = Math.min(
            TORUS_WEIGHTS.length - 1,
            Math.max(0, Math.round(mappedVal * (TORUS_WEIGHTS.length - 1)))
          );
          const weight = TORUS_WEIGHTS[twIdx];
          const font = `${weight} ${fontSize}px ${fontFamily}`;
          draws.push({ font, color: torusColor, char: cell.char, x: cell.x, y });
        }
      }

      // Sort by font string for batch rendering (minimize ctx.font changes)
      draws.sort((a, b) => {
        if (a.font < b.font) return -1;
        if (a.font > b.font) return 1;
        if (a.color < b.color) return -1;
        if (a.color > b.color) return 1;
        return 0;
      });

      // Render all characters
      ctx!.textAlign = "left";
      ctx!.textBaseline = "alphabetic";
      let lastFont = "";
      let lastColor = "";

      for (const d of draws) {
        if (d.font !== lastFont) {
          ctx!.font = d.font;
          lastFont = d.font;
        }
        if (d.color !== lastColor) {
          ctx!.fillStyle = d.color;
          lastColor = d.color;
        }
        ctx!.fillText(d.char, d.x, d.y);
      }

      state.animId = requestAnimationFrame(render);
    }

    // Start render loop immediately; fonts may still be loading but
    // canvas will re-render every frame anyway
    state.animId = requestAnimationFrame(render);

    // --- Interaction handlers ---
    function onMouseDown(e: MouseEvent) {
      state.dragging = true;
      state.dragLastX = e.clientX;
      state.dragLastY = e.clientY;
      state.velX = 0;
      state.velY = 0;
    }

    function onMouseMove(e: MouseEvent) {
      if (!state.dragging) return;
      const dx = e.clientX - state.dragLastX;
      const dy = e.clientY - state.dragLastY;
      state.angleX += dx * 0.005;
      state.angleY -= dy * 0.005;
      state.velX = dx * 0.3;
      state.velY = -dy * 0.3;
      state.dragLastX = e.clientX;
      state.dragLastY = e.clientY;
    }

    function onMouseUp() {
      state.dragging = false;
    }

    function onTouchStart(e: TouchEvent) {
      if (e.touches.length !== 1) return;
      state.dragging = true;
      state.dragLastX = e.touches[0].clientX;
      state.dragLastY = e.touches[0].clientY;
      state.velX = 0;
      state.velY = 0;
    }

    function onTouchMove(e: TouchEvent) {
      if (!state.dragging || e.touches.length !== 1) return;
      e.preventDefault();
      const dx = e.touches[0].clientX - state.dragLastX;
      const dy = e.touches[0].clientY - state.dragLastY;
      state.angleX += dx * 0.005;
      state.angleY -= dy * 0.005;
      state.velX = dx * 0.3;
      state.velY = -dy * 0.3;
      state.dragLastX = e.touches[0].clientX;
      state.dragLastY = e.touches[0].clientY;
    }

    function onTouchEnd() {
      state.dragging = false;
    }

    canvas.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    canvas.addEventListener("touchstart", onTouchStart, { passive: true });
    canvas.addEventListener("touchmove", onTouchMove, { passive: false });
    canvas.addEventListener("touchend", onTouchEnd);

    return () => {
      cancelAnimationFrame(state.animId);
      ro.disconnect();
      canvas.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
      canvas.removeEventListener("touchstart", onTouchStart);
      canvas.removeEventListener("touchmove", onTouchMove);
      canvas.removeEventListener("touchend", onTouchEnd);
    };
  }, [torusWord, bgWord, bgColor, torusColor, bgTextColor, getSegments]);

  return (
    <div ref={containerRef} className={className} style={{ position: "absolute", inset: 0 }}>
      <canvas
        ref={canvasRef}
        style={{
          display: "block",
          width: "100%",
          height: "100%",
          cursor: "grab",
        }}
      />
    </div>
  );
};

export { TextTorus };
