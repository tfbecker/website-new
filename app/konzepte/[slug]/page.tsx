import Link from "next/link"
import Image from "next/image"
import { notFound } from "next/navigation"
import type { Metadata } from "next"
import "./concept.css"

const MAIL = "mailto:felix@becker.im?subject=Website%20wie%20Ihr%20Designkonzept"
const concepts = {
  klarwerk: { name: "KLARWERK", label: "Gebäudereinigung", services: [
    ["01", "Büroreinigung", "Saubere Arbeitsplätze. Planbar im Alltag."],
    ["02", "Glasreinigung", "Fenster und Fassaden mit freiem Durchblick."],
    ["03", "Treppenhäuser", "Ein gepflegter Eingang auf jeder Etage."],
  ] },
  werkraum: { name: "WERKRAUM", label: "Handwerk & Hausservice", services: [
    ["01", "Reparieren", "Was kaputt ist, wird wieder brauchbar."],
    ["02", "Montieren", "Vom Regal bis zur neuen Leuchte."],
    ["03", "Instand halten", "Kleine Arbeiten rund um Haus und Räume."],
  ] },
}

type ConceptKey = keyof typeof concepts
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const concept = Object.prototype.hasOwnProperty.call(concepts, slug) ? concepts[slug as ConceptKey] : undefined
  return {
    title: concept ? `${concept.name}: freies Designkonzept` : "Designkonzept",
    description: concept ? `Eigenständiges Designkonzept für ${concept.label}. Fiktiver Betrieb, gestaltet von Felix Becker.` : undefined,
    robots: { index: false, follow: true },
  }
}
export function generateStaticParams() { return Object.keys(concepts).map(slug => ({ slug })) }

function WorkshopObject() {
  return <svg className="workshop-object" viewBox="0 0 600 600" role="img" aria-label="Geometrische Illustration eines Holzschemels mit Maßlinien">
    <defs><pattern id="workshop-grain" patternUnits="userSpaceOnUse" width="16" height="16" patternTransform="rotate(12)"><path d="M0 0v16M8 0v16" stroke="#704a33" strokeWidth=".7" opacity=".25" /></pattern></defs>
    <path d="M63 474 302 559 542 452" fill="none" stroke="#3e3025" strokeWidth="1" opacity=".22" />
    <ellipse cx="310" cy="470" rx="167" ry="37" fill="#503424" opacity=".13" />
    <path d="m181 244 40 13-15 225-37-12Z" fill="#85543b" />
    <path d="m221 257 20-13-15 221-20 17Z" fill="#603e2d" />
    <path d="m405 235 34-16 19 226-34 17Z" fill="#74472f" />
    <path d="m405 235 19 227-26-10-17-206Z" fill="#a56947" />
    <path d="m309 306 42-15 8 223-40 17Z" fill="#9d6545" />
    <path d="m309 306 10 225-27-14-7-225Z" fill="#72432c" />
    <path d="m184 379 128 47 1 27-131-48Z" fill="#c18b60" />
    <path d="m311 425 117-53 2 25-117 56Z" fill="#8e5739" />
    <path d="m135 216 162-82 167 62-163 88Z" fill="#d7ad78" />
    <path d="m135 216 166 68 2 40-167-70Z" fill="#b97f52" />
    <path d="m301 284 163-88-1 40-160 88Z" fill="#8b5437" />
    <path d="m135 216 162-82 167 62-163 88Z" fill="url(#workshop-grain)" />
    <path d="m150 216 147-73 152 55M150 242l139 57" fill="none" stroke="#edd1a7" strokeWidth="2" opacity=".6" />
    <g stroke="#523b2a" strokeWidth="1" fill="none" opacity=".6"><path d="M96 222v256m-9-256h18M87 478h18M143 112l160-79m-164 70 8 16m152-94 8 16M463 269l37 229m-46-229h18m20 229h18" /></g>
    <g fill="#523b2a" fontFamily="monospace" fontSize="12" letterSpacing="2"><text x="78" y="366" transform="rotate(-90 78 366)">HANDWERK</text><text x="181" y="62" transform="rotate(-26 181 62)">MIT SUBSTANZ</text><text x="467" y="531">WR / 01</text></g>
  </svg>
}

export default async function Concept({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  if (slug !== "klarwerk" && slug !== "werkraum") notFound()
  const key = slug as ConceptKey
  const concept = concepts[key]
  const clean = key === "klarwerk"
  return <div className={`concept-root concept-${key}`} lang="de">
    <div className="concept-notice"><span>Fiktiver Betrieb · Designkonzept von Felix Becker</span><Link href="/#beispiele">Zurück zu Felix ↗</Link></div>
    <header className="concept-nav">
      <a href="#start" className="concept-logo" aria-label={`${concept.name}, zum Seitenanfang`}>{clean ? <><span className="clean-logo-mark" aria-hidden="true"><i /><i /><i /></span>KLARWERK<span className="clean-logo-dot">.</span></> : <>werkraum<span className="craft-logo-cross" aria-hidden="true">✳</span></>}</a>
      <nav aria-label="Konzeptnavigation"><a href="#leistungen">Leistungen</a><a href="#idee">Designidee</a><a className="concept-nav-contact" href={MAIL}>Website anfragen ↗</a></nav>
    </header>
    <main id="start">
      {clean ? <>
        <section className="clean-hero">
          <Image src="/refresh/window-cleaning.jpg" alt="Glasreiniger an einer modernen Fassade; Stockfoto im Designkonzept" width={1400} height={900} priority sizes="100vw" />
          <div className="clean-hero-shade" />
          <div className="clean-hero-content"><p className="concept-kicker">GEBÄUDEREINIGUNG / KLARWERK</p><h1>SAUBER.<br />BIS INS<br /><span>DETAIL.</span></h1><p>Büros. Glas. Treppenhäuser.<br />Gepflegte Räume fangen hier an.</p><a href="#leistungen" className="concept-button">UNSERE LEISTUNGEN <span aria-hidden="true">↘</span></a></div>
          <div className="clean-hero-index" aria-hidden="true">KW / 01</div>
        </section>
        <div className="clean-service-strip"><span>01 / BÜRO</span><span>02 / GLAS</span><span>03 / TREPPENHAUS</span><span aria-hidden="true">↗</span></div>
      </> : <section className="craft-hero">
        <div className="craft-hero-copy"><p className="concept-kicker">HANDWERK & HAUSSERVICE</p><h1>Anpacken.<br /><span>Richtig<br />machen.</span></h1><p>Für die Dinge, die gemacht gehören.<br />Rund ums Haus. Mit Hand und Verstand.</p><a className="concept-button" href="#leistungen">Was wir machen <span aria-hidden="true">↗</span></a><span className="craft-hero-note">REPARATUR / MONTAGE / HAUSSERVICE</span></div>
        <div className="craft-hero-art"><span className="craft-art-label">WERKSTÜCK / N° 01</span><WorkshopObject /><span className="craft-art-note">Eine gute Verbindung hält.</span></div>
      </section>}
      <section id="leistungen" className="concept-services">
        <div className="concept-section-top"><p className="concept-kicker">{clean ? "WAS WIR SAUBER MACHEN" : "WAS ANSTEHT"}</p><h2>{clean ? <>EIN PLAN.<br />SAUBERE SACHE.</> : <>Kleine Arbeiten.<br />Ordentlich gemacht.</>}</h2></div>
        <div className="concept-service-grid">{concept.services.map(([number, title, description]) => <article key={number}><span className="concept-service-number">{number}</span><h3>{title}</h3><p>{description}</p><a href={MAIL} aria-label={`Website mit dem Leistungsbereich ${title} bei Felix anfragen`}>{clean ? "WEBSITE ANFRAGEN" : "So eine Website anfragen"}<span aria-hidden="true">↗</span></a></article>)}</div>
      </section>
      <section id="idee" className="concept-idea"><p className="concept-kicker">DAS DESIGNKONZEPT</p><h2>{clean ? <>KLAR IM AUFTRITT.<br />DIREKT ZUR ANFRAGE.</> : <>Ein eigener Auftritt.<br />Kein Baukasten-Gefühl.</>}</h2><div><p>{clean ? "Kontrast, große Schrift und ein klarer Kontaktweg. Eine eigenständige Gestaltung für einen Reinigungsbetrieb." : "Warme Materialien, kräftige Schrift und Platz fürs Handwerk. Eine Gestaltung mit Werkstattcharakter."}<br /><span>Frei entwickelt. Kein Kundenprojekt. Keine echte Dienstleistungsbuchung.</span></p><a href={MAIL} className="concept-button">Website mit Felix anfragen <span aria-hidden="true">↗</span></a></div></section>
    </main>
    <footer className="concept-footer"><span>Designkonzept / Felix Becker</span>{clean && <a href="https://unsplash.com/photos/window-cleaners-work-on-a-modern-glass-building-SBdgqsJfS7I" target="_blank" rel="noopener noreferrer">Foto: Unsplash ↗</a>}<Link href="/">becker.im ↗</Link></footer>
  </div>
}
