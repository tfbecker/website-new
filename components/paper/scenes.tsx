// Scroll-driven illustrations. Each card is plain SVG; effects.tsx feeds it the scroll position
// (--p / --q for CSS, stroke-dashoffset for drawn paths, a transform for the thing riding a path).

const ROUTE = "M70 92 C130 40 190 52 250 62 C330 76 410 70 430 136 C448 196 360 226 280 238 C190 252 110 262 92 322"

// Raptor: the schematic draws itself, then the engine throttles up as the card scrolls past.
export function RaptorScene() {
  return (
    <div className="r-card" data-scroll data-start="0.22" data-gain="2.1" role="img"
      aria-label="a line drawing of a rocket engine; as you scroll, its flame grows and shock diamonds appear">
      <svg viewBox="0 0 500 400" aria-hidden="true">
        <defs>
          <radialGradient id="r-glow" cx="50%" cy="40%" r="55%">
            <stop offset="0" stopColor="#3b5bb5" stopOpacity=".55" />
            <stop offset="1" stopColor="#101a33" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="r-flame" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#ffe3a6" />
            <stop offset=".35" stopColor="#f59a45" />
            <stop offset=".8" stopColor="#e8762b" stopOpacity=".35" />
            <stop offset="1" stopColor="#e8762b" stopOpacity="0" />
          </linearGradient>
          <pattern id="r-dots" width="20" height="20" patternUnits="userSpaceOnUse">
            <circle cx="1" cy="1" r="1" fill="#2c3d6b" />
          </pattern>
        </defs>
        <rect width="500" height="400" fill="url(#r-dots)" />
        <rect className="r-breathe" width="500" height="400" fill="url(#r-glow)" />

        <g transform="translate(0 -36)">
        <g className="r-plume">
          <path d="M174 322 C194 368 220 420 250 500 C280 420 306 368 326 322 Z" fill="url(#r-flame)" />
          <path d="M214 322 C230 352 240 384 250 430 C260 384 270 352 286 322 Z" fill="#fff4d6" opacity=".85" />
        </g>
        <g className="r-diamonds" fill="#fffaf0">
          <path d="M250 336l9 11-9 11-9-11z" />
          <path d="M250 366l7 9-7 9-7-9z" />
          <path d="M250 392l5 7-5 7-5-7z" />
        </g>

        <g data-draw fill="none" stroke="#a9bdf0" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <circle data-draw-line cx="150" cy="96" r="22" />
          <circle data-draw-line cx="350" cy="96" r="22" />
          <path d="M140 96h20M150 86v20M340 96h20M350 86v20" stroke="#6f86c4" />
          <path d="M172 96 C190 96 196 82 210 76" />
          <path d="M328 96 C310 96 304 82 290 76" />
          <path d="M210 76 C220 50 280 50 290 76" />
          <path d="M210 76 V150 C210 172 230 182 234 196" />
          <path d="M290 76 V150 C290 172 270 182 266 196" />
          <path d="M210 86 H290" stroke="#6f86c4" />
          <path d="M234 196 C238 222 205 268 172 320" />
          <path d="M266 196 C262 222 295 268 328 320" />
          <path d="M172 320 C210 332 290 332 328 320" />
          <path d="M242 214 C240 240 220 274 198 314M258 214 C260 240 280 274 302 314" stroke="#4d6299" strokeWidth="1.4" />
        </g>
        <text x="150" y="142" className="r-label" textAnchor="middle">CH₄</text>
        <text x="350" y="142" className="r-label" textAnchor="middle">LOX</text>
        </g>
      </svg>
      <div className="r-readout">
        <span>throttle</span>
        <b data-count data-max="100" data-suffix="%">0%</b>
      </div>
      <div className="r-caption">full-flow staged combustion</div>
    </div>
  )
}

// Autonomous e-commerce: a parcel rides the route from a PDF datasheet to someone's door.
const STATIONS = [
  { at: 0, x: 70, y: 92, label: "pdf datasheet", icon: "pdf" },
  { at: 0.23, x: 250, y: 62, label: "an agent reads it", icon: "agent" },
  { at: 0.48, x: 430, y: 136, label: "clean product data", icon: "data" },
  { at: 0.73, x: 280, y: 238, label: "shop, ads, pricing", icon: "shop" },
  { at: 0.99, x: 92, y: 322, label: "at the door", icon: "home" },
] as const

function StationIcon({ icon }: { icon: (typeof STATIONS)[number]["icon"] }) {
  switch (icon) {
    case "pdf":
      return (
        <g>
          <path d="M-12 -16h16l8 8v24h-24z" fill="#fbf8f3" />
          <path d="M4 -16v8h8" />
          <path d="M-7 -2h14M-7 4h14M-7 10h9" strokeWidth="1.6" />
        </g>
      )
    case "agent":
      return (
        <g>
          <path d="M0 -14v-6" />
          <circle cx="0" cy="-22" r="3" fill="#e8762b" />
          <rect x="-15" y="-14" width="30" height="26" rx="9" fill="#f2a766" />
          <circle cx="-6" cy="-2" r="2.4" fill="#2a241d" stroke="none" />
          <circle cx="6" cy="-2" r="2.4" fill="#2a241d" stroke="none" />
          <path d="M-5 5c3 3 7 3 10 0" strokeWidth="1.8" />
        </g>
      )
    case "data":
      return (
        <g>
          <rect x="-16" y="-13" width="32" height="26" rx="3" fill="#fbf8f3" />
          <path d="M-16 -4h32M-16 5h32M-5 -13v26" strokeWidth="1.6" />
          <path d="M-16 -13h32v9h-32z" fill="#b9d3a6" />
        </g>
      )
    case "shop":
      return (
        <g>
          <path d="M-15 -4v18h30v-18" fill="#fbf8f3" />
          <path d="M-18 -4l3 -12h30l3 12z" fill="#f2a766" />
          <path d="M-6 -16l-1.5 12M6 -16l1.5 12" strokeWidth="1.6" />
          <path d="M-5 14v-9h10v9" />
        </g>
      )
    case "home":
      return (
        <g>
          <path d="M-16 -1l16 -14 16 14v17h-32z" fill="#fbf8f3" />
          <path d="M-5 16v-10h10v10" fill="#f2a766" />
        </g>
      )
  }
}

export function CommerceScene() {
  return (
    <div className="c-card" data-ride role="img"
      aria-label="a parcel travels a route from a pdf datasheet, through an agent, product data and a shop, to someone's door">
      <svg viewBox="0 0 500 400" aria-hidden="true">
        <path d={ROUTE} className="c-plan" fill="none" />
        <path d={ROUTE} className="ride-path" fill="none" stroke="none" />
        <path d={ROUTE} className="ride-trace c-trace" fill="none" />
        <g stroke="#2a241d" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" fill="none" filter="url(#p-wobble)">
          {STATIONS.map((s) => (
            <g key={s.icon} className="c-st" data-at={s.at} transform={`translate(${s.x} ${s.y})`}>
              <circle className="c-halo" r="27" stroke="none" />
              <g className="c-icon"><StationIcon icon={s.icon} /></g>
            </g>
          ))}
        </g>
        <g className="ride-tip" transform="translate(70 92)">
          <g className="c-parcel" stroke="#2a241d" strokeWidth="2" strokeLinejoin="round">
            <path d="M-11 -6h18v14h-18z" fill="#d9b483" />
            <path d="M-11 -6l5 -6h18l-5 6z" fill="#e8cfa4" />
            <path d="M7 -6l5 -6v14l-5 6z" fill="#c49b66" />
            <path d="M-4 -6l5 -6h4l-5 6z" fill="#f6e6cf" />
          </g>
        </g>
      </svg>
      {STATIONS.map((s) => (
        <span key={s.icon} className="c-label" data-at={s.at} style={{
            left: `${(s.x / 500) * 100}%`,
            top: `${((s.y + 34) / 400) * 100}%`,
            transform: `translateX(${s.x < 120 ? -22 : s.x > 380 ? -78 : -50}%)`,
          }}>
          {s.label}
        </span>
      ))}
    </div>
  )
}

// Skiing: the tracks are drawn down the slope as you scroll, the skier rides their tip.
const TRACK = "M118 120 C210 138 92 186 186 212 C280 238 176 282 276 304 C352 320 334 352 414 372"

export function SkiScene() {
  return (
    <div className="s-card" data-ride role="img" aria-label="ski tracks being drawn down a snowy slope as you scroll">
      <svg viewBox="0 0 500 400" aria-hidden="true">
        <defs>
          <linearGradient id="s-sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#bcd3ee" />
            <stop offset="1" stopColor="#eef3f8" />
          </linearGradient>
        </defs>
        <rect width="500" height="400" fill="url(#s-sky)" />
        <circle cx="404" cy="70" r="26" fill="#f0c46a" opacity=".9" />
        <path d="M-10 190 L90 70 L160 140 L250 40 L360 150 L430 100 L520 190 Z" fill="#dfe8f2" />
        <path d="M250 40 L282 72 L264 70 L250 84 L236 68 L222 72 Z" fill="#fbfdff" />
        <path d="M90 70 L112 96 L98 94 L90 104 L80 94 Z" fill="#fbfdff" />
        <path d="M-10 160 C120 110 260 150 520 120 L520 420 L-10 420 Z" fill="#fbfdff" />
        <path d="M-10 300 C150 260 320 330 520 280 L520 420 L-10 420 Z" fill="#e8eff7" opacity=".7" />
        <g stroke="#2a241d" strokeWidth="2" strokeLinejoin="round" filter="url(#p-wobble)">
          <path d="M44 210 l14 -34 14 34z M48 198 l10 -24 10 24z" fill="#7fa36b" />
          <path d="M58 210v8" />
          <path d="M440 238 l16 -40 16 40z M444 222 l12 -30 12 30z" fill="#6b9459" />
          <path d="M456 238v9" />
          <path d="M70 330 l12 -30 12 30z" fill="#7fa36b" />
          <path d="M82 330v7" />
        </g>
        <path d={TRACK} className="ride-path" fill="none" stroke="none" />
        <g fill="none" stroke="#9ab3cf" strokeWidth="2.2" strokeLinecap="round">
          <path d={TRACK} className="ride-trace" />
          <path d={TRACK} className="ride-trace" transform="translate(7 3)" />
        </g>
        <g className="ride-tip" transform="translate(118 120)">
          <g className="s-skier" transform="scale(1.55)" stroke="#2a241d" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M-12 9 L14 3" stroke="#e04a2a" strokeWidth="3" />
            <path d="M-3 7 L2 -6 L-1 -14" fill="none" />
            <path d="M-5 -10 l11 -2 2 9 -9 3z" fill="#1f2a44" />
            <circle cx="1" cy="-18" r="5" fill="#1f2a44" />
            <path d="M-1 -19h6" stroke="#fbf8f3" strokeWidth="2.2" />
          </g>
        </g>
      </svg>
      <div className="s-snow" aria-hidden="true" />
    </div>
  )
}

// Kite-surfing: the waves roll, the kite sweeps across the wind window with the scroll.
export function KiteScene() {
  return (
    <div className="k-card" data-scroll data-start="0.15" data-gain="1.6" role="img"
      aria-label="a kite-surfer on the sea; the kite sweeps across the sky as you scroll">
      <svg viewBox="0 0 500 400" aria-hidden="true">
        <defs>
          <linearGradient id="k-sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#f6d9b8" />
            <stop offset="1" stopColor="#f3e9dc" />
          </linearGradient>
          <linearGradient id="k-sea" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#7fb0cf" />
            <stop offset="1" stopColor="#3f6f96" />
          </linearGradient>
        </defs>
        <rect width="500" height="400" fill="url(#k-sky)" />
        <circle cx="96" cy="86" r="30" fill="#f0a35f" opacity=".85" />
        <rect y="262" width="500" height="140" fill="url(#k-sea)" />
        <g className="k-kite">
          <path d="M207 286 L170 112 M213 286 L250 112" stroke="#2a241d" strokeWidth="1" opacity=".7" />
          <path d="M126 122 C150 76 270 76 294 122 C268 104 152 104 126 122 Z" fill="#e8762b" stroke="#2a241d" strokeWidth="2.2" strokeLinejoin="round" filter="url(#p-wobble)" />
          <path d="M168 92 C190 86 230 86 252 92" stroke="#2a241d" strokeWidth="1.4" fill="none" opacity=".5" />
        </g>
        <g transform="translate(210 306) scale(1.35) translate(-210 -306)">
        <g className="k-rider" stroke="#2a241d" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" filter="url(#p-wobble)">
          <path d="M186 306 C200 312 228 312 240 304" stroke="#f6e6cf" strokeWidth="4" />
          <path d="M204 304 L210 288 L218 304" fill="none" />
          <path d="M210 288 L210 270" />
          <path d="M210 278 L207 286 M210 278 L214 286" />
          <circle cx="210" cy="263" r="6" fill="#f2a766" />
        </g>
        </g>
        <g className="k-waves" fill="none" stroke="#e8f1f7" strokeWidth="2" strokeLinecap="round" opacity=".8">
          <path d="M-100 300 q25 -8 50 0 t50 0 t50 0 t50 0 t50 0 t50 0 t50 0 t50 0 t50 0 t50 0 t50 0 t50 0 t50 0 t50 0" />
          <path d="M-100 336 q25 -8 50 0 t50 0 t50 0 t50 0 t50 0 t50 0 t50 0 t50 0 t50 0 t50 0 t50 0 t50 0 t50 0 t50 0" opacity=".6" />
          <path d="M-100 370 q25 -8 50 0 t50 0 t50 0 t50 0 t50 0 t50 0 t50 0 t50 0 t50 0 t50 0 t50 0 t50 0 t50 0 t50 0" opacity=".45" />
        </g>
      </svg>
    </div>
  )
}
