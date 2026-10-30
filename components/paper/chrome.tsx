import Link from "next/link"
import { Robot, Spark } from "./stickers"

export const SOCIALS = [
  { label: "github", href: "https://github.com/tfbecker" },
  { label: "linkedin", href: "https://www.linkedin.com/in/felix-becker-2ba413140/" },
  { label: "x", href: "https://x.com/fffbecker" },
  { label: "rss", href: "/feed.xml" },
]

export function Nav() {
  return (
    <header className="p-nav">
      <div className="p-wrap p-nav-in">
        <Link href="/" className="p-brand" aria-label="felix becker, home">
          <span>felix becker</span>
          <Spark className="p-brand-spark" />
        </Link>
        <nav aria-label="sections">
          <ul>
            <li><Link href="/#writing">writing</Link></li>
            <li><Link href="/#projects">projects</Link></li>
            <li className="p-nav-wide"><Link href="/#photos">photos</Link></li>
            <li className="p-nav-wide"><Link href="/#reading">reading</Link></li>
          </ul>
        </nav>
        <button type="button" className="p-theme" data-theme-toggle aria-label="switch light and dark">
          <svg className="sun" viewBox="0 0 16 16" aria-hidden="true">
            <circle cx="8" cy="8" r="3.4" fill="currentColor" />
            <path d="M8 .8v2M8 13.2v2M.8 8h2M13.2 8h2M2.9 2.9l1.4 1.4M11.7 11.7l1.4 1.4M2.9 13.1l1.4-1.4M11.7 4.3l1.4-1.4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
          </svg>
          <svg className="moon" viewBox="0 0 16 16" aria-hidden="true">
            <path d="M10.8 1.6a6.4 6.4 0 1 0 3.6 10.4A5 5 0 1 1 10.8 1.6z" fill="currentColor" />
          </svg>
        </button>
      </div>
    </header>
  )
}

export function EmailLink({ className = "", children = "email" }: { className?: string; children?: React.ReactNode }) {
  // The address is put together in the browser (see effects.tsx), so it is not in the HTML.
  return (
    <a href="#contact" data-email data-user="felix" className={className}>
      {children}
    </a>
  )
}

export function Footer() {
  return (
    <footer className="p-footer" data-tint="dusk" id="contact">
      <div className="p-wrap">
        <div className="p-footer-top">
          <p className="p-footer-line p-reveal">
            thanks for reading. write to me if something here made you think, or if you want to build something together.
          </p>
          <div className="p-footer-links p-reveal">
            <EmailLink className="p-link">felix at becker.so</EmailLink>
            <span className="p-footer-socials">
              {SOCIALS.map((s) => (
                <a key={s.label} href={s.href} className="p-link" target={s.href.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer">{s.label}</a>
              ))}
            </span>
            <span className="p-hello" data-hello>
              <span className="sun" aria-hidden="true" />
              <span className="t">hallo · frankfurt</span>
            </span>
          </div>
        </div>
        <div className="p-footer-bottom">
          <span>© {new Date().getFullYear()} felix becker</span>
          <span>
            <Link href="/beliefs">beliefs</Link>
            {" · "}
            <a href="https://github.com/tfbecker/website-new" target="_blank" rel="noopener noreferrer">code</a>
            {" · "}
            motion lovingly borrowed from <a href="https://holamari.us" target="_blank" rel="noopener noreferrer">holamari.us</a>
          </span>
        </div>
      </div>
      <div className="p-peek" data-peek aria-hidden="true">
        <span className="p-peek-bubble" data-peek-line>you made it to the end.</span>
        <Robot className="is-bob" label="" />
      </div>
    </footer>
  )
}
