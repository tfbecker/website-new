import type { Metadata } from "next"
import Link from "next/link"
import "../refresh.css"

export const metadata: Metadata = {
  title: "Impressum | Felix Becker",
  description: "Anbieterkennzeichnung und Kontakt für Felix Becker.",
}

export default function Impressum() {
  return (
    <div className="rf-site" lang="de">
      <main className="rf-wrap rf-section" style={{ maxWidth: 850, minHeight: "80vh" }}>
        <Link href="/" className="rf-text-link">← Zur Startseite</Link>
        <h1 style={{ fontSize: "clamp(40px, 7vw, 64px)", marginTop: 48 }}>Impressum</h1>
        <p>Angaben nach § 5 Digitale-Dienste-Gesetz</p>
        <p>Felix Becker<br />Webdesign und Entwicklung<br />c/o HolzLand Becker GmbH<br />Waldstraße 207<br />63071 Offenbach am Main<br />Deutschland</p>
        <h2>Kontakt</h2>
        <p>E-Mail: <a href="mailto:felix@becker.im">felix@becker.im</a><br />Telefon: <a href="tel:+491735161554">+49 173 5161554</a></p>
        <p>Dieses Webdesign-Angebot betreibe ich persönlich unter meinem eigenen Namen. Anbieter und Ansprechpartner ist Felix Becker. Die HolzLand Becker GmbH dient hier als Kontaktadresse.</p>
      </main>
    </div>
  )
}
