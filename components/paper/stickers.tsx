// Hand-drawn stickers for the paper design. Every sticker shares one SVG filter (#p-wobble,
// rendered once by <WobbleDefs/> in the layout) that roughens the strokes a little, so the
// shapes look drawn with a pen instead of placed by a computer.

const INK = "#2a241d"

type StickerProps = { className?: string; label?: string }

// One shared filter: fractal noise displaces every stroke by a couple of pixels.
export function WobbleDefs() {
  return (
    <svg width="0" height="0" aria-hidden="true" style={{ position: "absolute" }}>
      <filter id="p-wobble">
        <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="2" seed="7" result="n" />
        <feDisplacementMap in="SourceGraphic" in2="n" scale="2.4" xChannelSelector="R" yChannelSelector="G" />
      </filter>
    </svg>
  )
}

// "the agent": the little robot that walks, peeks and waves around the site.
export function Robot({ className = "", label = "a small orange robot, waving" }: StickerProps) {
  return (
    <svg className={`p-sticker p-robot ${className}`} viewBox="0 0 140 160" role="img" aria-label={label}>
      <g stroke={INK} strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" fill="none" filter="url(#p-wobble)">
        <g className="antenna">
          <path d="M70 38V20" />
          <circle cx="70" cy="15" r="6" fill="#e8762b" />
        </g>
        <g className="body">
          <rect x="32" y="38" width="76" height="56" rx="20" fill="#f2a766" />
          <g className="eyes">
            <circle cx="56" cy="62" r="4" fill={INK} stroke="none" />
            <circle cx="84" cy="62" r="4" fill={INK} stroke="none" />
          </g>
          <path d="M60 76c6 6 14 6 20 0" />
          <circle cx="45" cy="74" r="6" fill="#e0603a" opacity=".35" stroke="none" />
          <circle cx="95" cy="74" r="6" fill="#e0603a" opacity=".35" stroke="none" />
          <path d="M70 94v4" />
          <rect x="44" y="98" width="52" height="40" rx="12" fill="#f6e6cf" />
          <rect x="53" y="105" width="34" height="19" rx="4" fill="#1f2a44" />
          <path d="M59 110l4 3.5-4 3.5" stroke="#f6e6cf" strokeWidth="2" />
          <path className="cursor" d="M67 118h9" stroke="#f2a766" strokeWidth="2.4" />
          <path d="M44 110c-10 3-15 10-15 18" />
          <path className="wave" d="M96 110c11-4 17-13 17-24" />
          <path d="M58 138v11M82 138v11M52 150h12M76 150h12" />
        </g>
      </g>
    </svg>
  )
}

export function Parcel({ className = "", label = "a cardboard parcel" }: StickerProps) {
  return (
    <svg className={`p-sticker ${className}`} viewBox="0 0 64 60" role="img" aria-label={label}>
      <g stroke={INK} strokeWidth="2.2" strokeLinejoin="round" strokeLinecap="round" filter="url(#p-wobble)">
        <path d="M8 24h38v30H8z" fill="#d9b483" />
        <path d="M8 24l9-12h38l-9 12z" fill="#e8cfa4" />
        <path d="M46 24l9-12v30l-9 12z" fill="#c49b66" />
        <path d="M24 24l9-12h7l-9 12z" fill="#f6e6cf" />
        <path d="M24 24h7v8h-7z" fill="#f6e6cf" />
        <circle cx="20" cy="40" r="1.8" fill={INK} stroke="none" />
        <circle cx="34" cy="40" r="1.8" fill={INK} stroke="none" />
        <path d="M24 45c2 2 5 2 7 0" fill="none" />
      </g>
    </svg>
  )
}

// The ✻ from the old becker.so hero, redrawn by hand.
export function Spark({ className = "" }: StickerProps) {
  return (
    <svg className={`p-spark ${className}`} viewBox="0 0 40 40" aria-hidden="true">
      <g stroke="currentColor" strokeWidth="5" strokeLinecap="round" filter="url(#p-wobble)">
        <path d="M20 5v30M5 20h30M9.4 9.4l21.2 21.2M30.6 9.4L9.4 30.6" />
      </g>
    </svg>
  )
}

export function Star({ className = "" }: StickerProps) {
  return (
    <svg className={`p-sticker ${className}`} viewBox="0 0 40 40" aria-hidden="true">
      <path filter="url(#p-wobble)" d="M20 4l4.6 10.4 11.4 1.2-8.6 7.6 2.5 11.2L20 28.6l-9.9 5.8 2.5-11.2L4 15.6l11.4-1.2z" fill="#f0c46a" stroke={INK} strokeWidth="2" strokeLinejoin="round" />
    </svg>
  )
}

export function Snowflake({ className = "" }: StickerProps) {
  return (
    <svg className={`p-sticker ${className}`} viewBox="0 0 40 40" aria-hidden="true">
      <g stroke={INK} strokeWidth="2.2" strokeLinecap="round" fill="none" filter="url(#p-wobble)">
        <path d="M20 4v32M6.2 12l27.6 16M6.2 28l27.6-16" stroke="#5a8ce6" />
        <path d="M16 7l4 4 4-4M16 33l4-4 4 4M7 17l5-1-1-5M33 23l-5 1 1 5M7 23l5 1-1 5M33 17l-5-1 1-5" />
      </g>
    </svg>
  )
}

export function Book({ className = "" }: StickerProps) {
  return (
    <svg className={`p-sticker ${className}`} viewBox="0 0 48 40" aria-hidden="true">
      <g stroke={INK} strokeWidth="2.2" strokeLinejoin="round" strokeLinecap="round" filter="url(#p-wobble)">
        <path d="M24 10c-6-4-13-5-20-4v26c7-1 14 0 20 4z" fill="#b9d3a6" />
        <path d="M24 10c6-4 13-5 20-4v26c-7-1-14 0-20 4z" fill="#f6e6cf" />
        <path d="M24 10v26" fill="none" />
        <path d="M29 14c3-1 7-1 10-1M29 19c3-1 7-1 10-1M29 24c3-1 7-1 10-1" fill="none" />
      </g>
    </svg>
  )
}

// The little squiggle a poem or post ends on.
export function EndMark({ className = "" }: StickerProps) {
  return (
    <svg className={`p-end ${className}`} viewBox="0 0 32 12" aria-hidden="true">
      <path d="M2 6c4-4 7 4 11 0s7 4 11 0 5-2 6-1" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  )
}
