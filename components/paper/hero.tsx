import Image from "next/image"
import { EmailLink, SOCIALS } from "./chrome"
import { Spark } from "./stickers"

export function Hero({ latestHref }: { latestHref: string }) {
  return (
    <section className="p-wrap p-intro" data-tint="sun">
      <div className="p-intro-text">
        <p className="p-eyebrow p-rise">frankfurt · new: a small web agency</p>
        <h1 className="p-display p-rise" style={{ ["--d" as string]: ".08s" }}>
          websites without the <em className="p-accent p-under is-auto">meeting marathon</em>.
        </h1>
        <p className="p-lead p-rise" style={{ ["--d" as string]: ".18s" }}>
          Hi <Spark className="p-inline-spark" /> I&apos;m Felix. Together with Benjamin and Krestoufer I just launched a web
          agency for small German businesses that don&apos;t have time for long alignment rounds. You send a link, we
          refresh the site in two weeks for a flat fee, hosting and care included.
        </p>
        <p className="p-body p-rise" style={{ ["--d" as string]: ".22s" }}>
          Day to day I&apos;m vibe coding and scaling an e-commerce company. Before that I was an associate at Heartcore
          Capital, focused on deep tech: dev tooling, infrastructure and robotics.
        </p>
        <div className="p-actions p-rise" style={{ ["--d" as string]: ".28s" }}>
          <a className="p-btn p-btn-solid" href="https://becker.im">see the agency <span aria-hidden="true">→</span></a>
          <a className="p-btn" href={latestHref}>read the latest</a>
          <a className="p-btn" href="#writing">all writing</a>
        </div>
        <p className="p-socials p-rise" style={{ ["--d" as string]: ".36s" }}>
          {SOCIALS.map((s) => (
            <a key={s.label} href={s.href} className="p-link" target={s.href.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer">{s.label}</a>
          ))}
          <EmailLink className="p-link" />
        </p>
      </div>

      <div className="p-photo">
        <div className="p-flip" style={{ ["--flip-tilt" as string]: "3deg" }}>
          <button type="button" className="p-flip-card" aria-pressed="false" aria-label="turn the photo over">
            <span className="p-flip-face p-flip-front">
              <span className="p-flip-tape" aria-hidden="true" />
              <Image
                src="/fun/ski.jpeg"
                alt="Felix, waist-deep in powder snow, holding up his skis"
                width={560}
                height={700}
                sizes="280px"
                priority
                style={{ objectFit: "cover", objectPosition: "38% 62%", aspectRatio: "4 / 5" }}
              />
              <span className="p-flip-hint">turn me over ↻</span>
            </span>
            <span className="p-flip-face p-flip-back" aria-hidden="true">
              <span className="p-flip-note">{"that's me, waist-deep\nin powder and very happy.\nskiing is still my\nfavourite hobby."}</span>
              <span className="p-flip-date">feb 2023 · somewhere off-piste</span>
              <span className="p-flip-stamp">hobby no. 1</span>
            </span>
          </button>
        </div>
      </div>
    </section>
  )
}
