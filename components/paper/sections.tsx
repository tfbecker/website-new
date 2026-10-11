import Image from "next/image"
import Link from "next/link"
import type { Post } from "@/lib/posts"
import { CommerceScene, KiteScene, RaptorScene, SkiScene } from "./scenes"
import { Book, Parcel, Robot, Snowflake, Star } from "./stickers"
import { postHref } from "./writing"

export const plain = (html: string) =>
  html.replace(/<[^>]*>/g, "").replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&#x27;|&#39;/g, "'").replace(/\s+/g, " ").trim()
const cut = (s: string, n: number) => (s.length > n ? s.slice(0, s.lastIndexOf(" ", n)).replace(/[,.:;-]$/, "") + "…" : s)

// ── rougher thoughts: short posts as notes taped to the page ───────────────
const noteDate = (d: string) =>
  new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" }).toLowerCase()

export function RoughThoughts({ posts }: { posts: Post[] }) {
  if (!posts.length) return null
  return (
    <section className="p-wrap p-section" id="thoughts" data-tint="sun">
      <div className="p-section-head">
        <h2 className="p-h2 p-reveal">rougher thoughts</h2>
        <span className="p-mono-note">quick ones, left rough</span>
      </div>
      <div className="p-memos" data-stagger="80">
        {posts.map((p) => (
          <Link key={p.id} href={postHref(p)} className="p-memo p-reveal">
            <span className="p-memo-tape" aria-hidden="true" />
            <span className="p-memo-date">{noteDate(p.date)}</span>
            <span className="p-memo-title">{p.title.toLowerCase()}</span>
            <span className="p-memo-text">{cut(plain(p.content), 280)}</span>
            <span className="p-memo-more">read <span aria-hidden="true">→</span></span>
          </Link>
        ))}
      </div>
    </section>
  )
}

// ── features: one interactive explainer, one essay ─────────────────────────
export function Features() {
  return (
    <>
      <section className="p-wrap p-feature" data-tint="night" id="raptor">
        <div className="p-feature-text" data-stagger="80">
          <p className="p-eyebrow p-reveal">an interactive explainer</p>
          <h2 className="p-h-accent p-reveal">how spacex&apos;s raptor works</h2>
          <p className="p-body p-reveal">
            I couldn&apos;t read the Raptor schematics in Brian Potter&apos;s article, so I built the engine up myself:
            seven interactive steps from a tank of compressed gas to full-flow staged combustion, then a 3D model of
            Raptor 1, 2 and 3.
          </p>
          <p className="p-reveal"><a className="p-btn" href="/raptor">open the explainer <span aria-hidden="true">→</span></a></p>
        </div>
        <RaptorScene />
      </section>

      <section className="p-wrap p-feature is-flipped" data-tint="sage" id="commerce">
        <div className="p-feature-text" data-stagger="80">
          <p className="p-eyebrow p-reveal">an essay</p>
          <h2 className="p-h-accent p-reveal">autonomous e-commerce</h2>
          <div className="p-verse p-reveal">
            <p>openai tried to build checkout inside chatgpt.</p>
            <p>they killed it in march.</p>
            <p>but the merchant side? <em className="p-swash">that&apos;s where it gets interesting.</em></p>
          </div>
          <p className="p-reveal"><Link className="p-btn" href="/posts/autonomous-ecommerce">read the essay <span aria-hidden="true">→</span></Link></p>
        </div>
        <CommerceScene />
      </section>
    </>
  )
}

// ── things i built ──────────────────────────────────────────────────────────
const PROJECT_META: Record<string, { tag: string; logo?: string }> = {
  "european-company-registers": { tag: "scraping" },
  "vocab-app": { tag: "app", logo: "/logos/vocab.svg" },
  "bundesanzeiger_bot": { tag: "open source", logo: "/logos/ba-cropped.svg" },
  "memecoin-trader": { tag: "trading", logo: "/logos/pump.webp" },
  "ai-recruiting-bot": { tag: "agents", logo: "/logos/li.avif" },
  "polymarket-arbitrage-bot": { tag: "trading", logo: "/logos/polymarket.ico" },
  "windmill-dev": { tag: "tutorial", logo: "/logos/windmill-dev.svg" },
  "heartcore-capital": { tag: "vc tooling", logo: "/logos/heartcore-capital.png" },
  "flaschenpost": { tag: "pricing", logo: "/logos/flaschenpost.png" },
  "frankfurt-school": { tag: "thesis", logo: "/logos/frankfurt-school.png" },
  "globalfounderscapital": { tag: "vc tooling", logo: "/logos/globalfounderscapital.png" },
}
const FALLBACK_STICKERS = [Parcel, Book, Star]

export function Projects({ projects }: { projects: Post[] }) {
  const cards = projects.slice(0, 6)
  const older = projects.slice(6)
  return (
    <section className="p-wrap p-section" id="projects" data-tint="lilac">
      <div className="p-section-head">
        <h2 className="p-h2 p-reveal">things i built</h2>
        <span className="p-mono-note p-reveal">mostly to avoid doing something by hand</span>
      </div>
      <div className="p-cards" data-stagger="70">
        {cards.map((p, i) => {
          const meta = PROJECT_META[p.id] ?? { tag: "project" }
          const Fallback = FALLBACK_STICKERS[i % FALLBACK_STICKERS.length]
          return (
            <Link key={p.id} href={postHref(p)} className="p-card p-reveal">
              <span className="p-eyebrow">project · {p.date.slice(0, 4)}</span>
              <span className="p-card-title">{p.title.toLowerCase()}</span>
              <span className="p-card-text">{cut(plain(p.summary), 130)}</span>
              <span className="p-card-foot">
                <span className="p-tag">{meta.tag}</span>
                <span className="p-card-art">
                  {meta.logo ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={meta.logo} alt="" width={34} height={34} loading="lazy" />
                  ) : (
                    <Fallback />
                  )}
                </span>
              </span>
            </Link>
          )
        })}
      </div>
      {older.length > 0 && (
        <div className="p-older p-reveal">
          <span className="p-eyebrow">older</span>
          <ul>
            {older.map((p) => (
              <li key={p.id}>
                <Link href={postHref(p)} className="p-link-quiet">
                  <span className="p-row-year">{p.date.slice(0, 4)}</span> {p.title.toLowerCase()}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  )
}

// ── photos: prints on a table that drift with the scroll ────────────────────
const PRINTS = [
  { src: "/portfolio/5Q7A3475.JPG", w: 2303, h: 1536, alt: "A blue classic Porsche 911 in front of an old petrol station", tilt: -3, drift: 60, spin: 4 },
  { src: "/portfolio/5Q7A7925.JPG", w: 1536, h: 2303, alt: "Cherry blossoms over an empty basketball court", tilt: 2.5, drift: -40, spin: -3 },
  { src: "/portfolio/_W4A7071.JPG", w: 2305, h: 1537, alt: "A lion walking through dry savanna scrub", tilt: 1.5, drift: 90, spin: 2 },
  { src: "/portfolio/5Q7A7389.JPG", w: 1536, h: 2303, alt: "Looking through a red wooden palace gate", tilt: -2, drift: 30, spin: -4 },
  { src: "/portfolio/5Q7A9269.JPG", w: 2303, h: 1536, alt: "Sea cliffs in morning mist", tilt: 3, drift: -70, spin: 3 },
  { src: "/portfolio/_W4A0409.JPG", w: 1537, h: 2305, alt: "Dead trees on a white clay pan in front of a red dune", tilt: -1.5, drift: 50, spin: -2 },
  { src: "/portfolio/5Q7A6697.JPG", w: 1536, h: 2303, alt: "A city crossing seen from above in black and white", tilt: -2.5, drift: 70, spin: -3 },
  { src: "/portfolio/_W4A9678-Bearbeitet.JPG", w: 2305, h: 1537, alt: "Red mountains above a still lake", tilt: 1, drift: -50, spin: 2 },
]

export function Photos() {
  return (
    <section className="p-wrap p-section" id="photos" data-tint="blue">
      <div className="p-section-head">
        <h2 className="p-h2 p-reveal">through the lens</h2>
        <span className="p-mono-note p-reveal">tap a print to see it big</span>
      </div>
      <div className="p-prints">
        {PRINTS.map((p, i) => (
          <a
            key={p.src}
            href={p.src}
            data-lightbox="image"
            data-full={`/_next/image?url=${encodeURIComponent(p.src)}&w=1920&q=80`}
            aria-label={p.alt}
            className={`p-print ${p.h > p.w ? "is-tall" : "is-wide"}`}
            data-drift={p.drift}
            data-spin={p.spin}
            style={{ ["--tilt" as string]: `${p.tilt}deg`, ["--i" as string]: i }}
          >
            <Image src={p.src} alt={p.alt} width={p.w} height={p.h} sizes="(min-width: 900px) 30vw, 46vw" />
          </a>
        ))}
      </div>
    </section>
  )
}

// ── reading: covers on a shelf, the note card follows your pointer ─────────
type BookT = { title: string; cover: string; rating: number; review: string }

function Stars({ n }: { n: number }) {
  return (
    <span className="p-stars" aria-label={`${n} of 5`}>
      {[0, 1, 2, 3, 4].map((i) => <span key={i} className={i < n ? "is-on" : ""}><Star /></span>)}
    </span>
  )
}

export function Shelf({ books }: { books: BookT[] }) {
  const first = Math.max(0, books.findIndex((b) => b.rating === 5))
  return (
    <section className="p-wrap p-section" id="reading" data-tint="peach">
      <div className="p-section-head">
        <h2 className="p-h2 p-reveal">on the shelf</h2>
        <span className="p-mono-note p-reveal">point at a book</span>
      </div>
      <div className="p-shelf-wrap p-reveal" data-shelf>
        <div className="p-shelf" role="group" aria-label="books">
          {books.map((b, i) => (
            <button
              key={b.title}
              type="button"
              className="p-book"
              data-book={i}
              aria-pressed={i === first}
              aria-label={`${b.title}, ${b.rating} of 5`}
              style={{ ["--lean" as string]: `${((i * 37) % 7) - 3}deg` }}
            >
              <Image src={b.cover} alt="" width={120} height={180} sizes="80px" />
            </button>
          ))}
        </div>
        <div className="p-shelf-board" aria-hidden="true" />
        <div className="p-notes" data-notes>
          {books.map((b, i) => (
            <div key={b.title} className="p-note" data-note={i} hidden={i !== first}>
              <span className="p-note-title">{b.title.toLowerCase()}</span>
              <Stars n={b.rating} />
              {b.review && <p>{b.review}</p>}
            </div>
          ))}
          <span className="p-note-pin" aria-hidden="true"><Book /></span>
        </div>
      </div>
      <a className="p-repeat p-reveal" href="https://www.youtube.com/watch?v=6fQHLK1aIBs" target="_blank" rel="noopener noreferrer">
        <span className="p-eyebrow">on repeat</span>
        <span className="p-repeat-title">keith rabois, how to operate <span aria-hidden="true">▶</span></span>
        <span className="p-repeat-text">This one is timeless and I don&apos;t know how many times I need to watch it to apply it myself.</span>
      </a>
    </section>
  )
}

// ── off the clock ───────────────────────────────────────────────────────────
export function Fun() {
  return (
    <section className="p-wrap p-section" id="fun" data-tint="sky">
      <div className="p-section-head">
        <h2 className="p-h2 p-reveal">off the clock</h2>
      </div>
      <div className="p-feature p-feature-tight">
        <div className="p-feature-text" data-stagger="80">
          <p className="p-eyebrow p-reveal">hobby no. 1 <Snowflake className="p-inline-sticker is-spin" /></p>
          <h3 className="p-h-accent p-reveal">skiing</h3>
          <p className="p-body p-reveal">I learned skiing quite young and to this day it&apos;s my favourite hobby.</p>
          <p className="p-reveal"><a className="p-btn" href="/fun/ski.jpeg" data-lightbox="image" data-full="/_next/image?url=%2Ffun%2Fski.jpeg&w=1920&q=80" aria-label="Felix in deep powder snow">see the powder <span aria-hidden="true">→</span></a></p>
        </div>
        <SkiScene />
      </div>
      <div className="p-feature p-feature-tight is-flipped">
        <div className="p-feature-text" data-stagger="80">
          <p className="p-eyebrow p-reveal">hobby no. 2</p>
          <h3 className="p-h-accent p-reveal">kite-surfing</h3>
          <p className="p-body p-reveal">
            My friends don&apos;t believe me that I can surf, because I always leave for a vacation to go surfing and
            then have no pictures to show for it (pretty hard to hold a bar, balance on a board and take a video).
            My 2024 goal was to surf independently and do turns. I also convinced a friendly guy on the beach to take a
            video of me. Yay!
          </p>
          <p className="p-reveal">
            <a className="p-btn" href="/fun/surf.mp4" data-lightbox="video" data-poster="/fun/surf-poster.webp">
              watch the proof <span aria-hidden="true">▶</span>
            </a>
          </p>
        </div>
        <KiteScene />
      </div>
      <div className="p-cast p-reveal" aria-hidden="true">
        <Robot className="is-bob" label="" />
        <Parcel className="is-sway" />
        <Snowflake className="is-spin" />
      </div>
    </section>
  )
}
