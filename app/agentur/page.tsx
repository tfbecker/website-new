import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { Comparison, RefreshEffects, SpeedComparison } from "@/components/refresh/interactive"
import { ManagedFlow } from "@/components/refresh/managed-flow"
import "../refresh.css"

export const metadata: Metadata = {
  title: { absolute: "Website überarbeiten lassen | Felix Becker" },
  description: "Persönliches Webdesign von Felix Becker. Nach sechs Jahren Startup-Szene wieder Websites gestalten, als kreativer Ausgleich neben dem Familienunternehmen. Kostenlose Vorschau vorab.",
  alternates: { canonical: "https://becker.im" },
  openGraph: { title: "Website überarbeiten lassen | Felix Becker", description: "Ich überarbeite Ihre Website und übernehme Ihre vorhandenen Inhalte. Sie sehen den Entwurf, bevor Sie sich entscheiden.", locale: "de_DE", url: "https://becker.im" },
  twitter: { title: "Website überarbeiten lassen | Felix Becker", description: "Bestehende Website überarbeiten lassen. Design, Ladezeit und Handyansicht aus einer Hand." },
}

const MAIL = "mailto:felix@becker.im?subject=Website-Refresh%20anfragen&body=Hallo%20Felix%2C%0A%0Aich%20interessiere%20mich%20f%C3%BCr%20einen%20Website-Refresh.%0AMeine%20Website%3A%20%0A%0AViele%20Gr%C3%BC%C3%9Fe"
const Arrow = () => <span aria-hidden="true">↗</span>
const Check = () => <span className="rf-check" aria-hidden="true">✓</span>

export default function Page() {
  return (
    <div className="rf-site" lang="de" data-refresh-home>
      <RefreshEffects />
      <a className="rf-skip" href="#inhalt">Zum Inhalt</a>
      <header className="rf-header">
        <Link href="/" className="rf-brand" aria-label="Felix Becker, Startseite"><span className="rf-monogram">fb<span>↗</span></span><span>Felix Becker<small>Webdesign & Entwicklung</small></span></Link>
        <nav aria-label="Hauptnavigation"><a href="#beispiele">Beispiele</a><a href="#ueber-mich">Über mich</a><a href="#preis">Preis</a></nav>
        <a href={MAIL} className="rf-nav-cta">E-Mail schreiben <Arrow /></a>
      </header>
      <main id="inhalt">
        <section className="rf-hero rf-wrap">
          <div className="rf-hero-copy rf-enter">
            <p className="rf-eyebrow"><span className="rf-status" /> Felix Becker · Webdesign neben dem Hauptberuf</p>
            <h1>Wieder Websites.<br /><em>Weil ich’s gern mache.</em></h1>
            <p className="rf-lead">Kreativer Ausgleich. Für Sie eine frische Website.</p>
            <p className="rf-hero-detail">Nach sechs Jahren in der Startup-Szene arbeite ich heute im Familienunternehmen. Nebenbei gestalte ich wieder Websites für kleine Betriebe. Persönlich, mit klaren Preisen und einer kostenlosen Vorschau vorab.</p>
            <div className="rf-actions"><a className="rf-button" href={MAIL}>Website zeigen <Arrow /></a><a href="#beispiele" className="rf-text-link">Beispiele ansehen <span aria-hidden="true">↓</span></a></div>
            <p className="rf-micro">Zwei Wochen ab Zusage und vollständigen Zugängen. Für Websites im Paketumfang.</p>
          </div>
          <div className="rf-hero-visual rf-enter" style={{ animationDelay: ".12s" }}>
            <div className="rf-hero-browser">
              <div className="rf-browser-top"><span className="rf-dots"><i /><i /><i /></span><span>Beispiel: Website einer Gebäudereinigung</span><span>↗</span></div>
              <div className="rf-clean-site">
                <div className="rf-clean-nav"><b>KLARWERK<span>▰</span></b><span>Gebäudereinigung.</span><i>↗</i></div>
                <div className="rf-clean-copy"><span className="rf-mini-label">GEBÄUDEREINIGUNG · DESIGNKONZEPT</span><h2>SAUBER.<br /><em>BIS INS DETAIL.</em></h2><p>Büro. Glas. Fassade.<br />Wir halten Ihren Betrieb sauber.</p><span className="rf-mini-button">Reinigung anfragen ↗</span></div>
                <div className="rf-clean-photo"><Image src="/refresh/window-cleaning.jpg" alt="Glasreinigung an einer modernen Gebäudefassade, Stockfoto im Designkonzept" width={1400} height={900} sizes="(max-width: 760px) 90vw, 42vw" priority /><span>KLARER AUFTRAG.<br />SAUBERE ARBEIT.</span></div>
                <div className="rf-clean-bottom"><span>01 / Büroreinigung</span><span>02 / Glasreinigung</span><span>03 / Treppenhäuser</span></div>
              </div>
            </div>
            <div className="rf-floating-note"><span aria-hidden="true">✳</span><div>Texte und Bilder bleiben.<br /><b>Die Website wird überarbeitet.</b></div></div>
            <p className="rf-concept-caption">Freies Designkonzept für einen fiktiven Betrieb. Keine Kundenreferenz.</p>
          </div>
        </section>
        <div className="rf-promise-line"><div className="rf-wrap"><span><Check /> Ihre Inhalte bleiben</span><span><Check /> Fürs Handy angepasst</span><span><Check /> Ladezeit optimieren</span><span><Check /> Direkt mit Felix</span></div></div>
        <section className="rf-section rf-wrap rf-speed-section" id="ladezeit" aria-labelledby="rf-speed-heading">
          <div className="rf-section-heading rf-reveal"><div><p className="rf-eyebrow">Jede Sekunde zählt</p><h2 id="rf-speed-heading">Ladezeit kann<br /><em>Anfragen kosten.</em></h2></div><p>Wer warten muss, kann abspringen.<br />Ich mache den Weg zur Anfrage kürzer.</p></div>
          <SpeedComparison />
          <div className="rf-speed-footnote"><span>Weniger Ladezeit. Weniger Hürden.</span><a className="rf-text-link" href={MAIL}>Meine Website prüfen lassen <Arrow /></a></div>
        </section>
        <section className="rf-section rf-wrap" id="beispiele">
          <div className="rf-section-heading rf-reveal"><div><p className="rf-eyebrow">01 / Gestaltungsbeispiele</p><h2>Vorher.<br /><em>Nachher.</em></h2></div><p>Zwei Betriebe. Zwei eigene Gestaltungsrichtungen.</p></div>
          <Comparison />
          <div className="rf-comparison-caption"><p><b>Ein Beispiel für die Überarbeitung einer bestehenden Website.</b><br />Ziehen Sie den Regler, um beide Gestaltungsideen zu vergleichen.</p><span>Illustrativer Vorher-/Nachher-Vergleich.<br />Beide Ansichten sind freie Konzepte.</span></div>
          <div className="rf-concept-grid">
            <Link href="/konzepte/klarwerk" className="rf-concept-card rf-reveal"><div className="rf-concept-art rf-art-clean"><span>KLARWERK ▰</span><strong>SAUBER.<br /><em>BIS INS DETAIL.</em></strong><span className="rf-art-link">Das Reinigungskonzept ansehen ↗</span></div><div><h3>Gebäudereinigung</h3><p>Büro-, Glas- und Treppenhausreinigung mit direkter Kontaktmöglichkeit.</p><span className="rf-chip">Freies Designkonzept</span></div></Link>
            <Link href="/konzepte/werkraum" className="rf-concept-card rf-reveal"><div className="rf-concept-art rf-art-craft"><span>WERKRAUM / HANDWERK</span><strong>Anpacken.<br /><em>Richtig machen.</em></strong><span className="rf-art-link">Das Handwerkskonzept ansehen ↗</span><i aria-hidden="true" /></div><div><h3>Handwerk & Hausservice</h3><p>Eine Website für einen Betrieb aus dem Handwerk.</p><span className="rf-chip">Freies Designkonzept</span></div></Link>
          </div>
        </section>
        <section className="rf-managed" id="betreuung" aria-labelledby="rf-managed-heading"><div className="rf-wrap rf-section">
          <div className="rf-managed-intro rf-reveal"><div><p className="rf-eyebrow">Fully managed · 39 € / Monat netto</p><h2 id="rf-managed-heading">Eine Website.<br /><em>Alles betreut.</em></h2></div><p>Hosting, Sicherheitsupdates, Backups und Monitoring laufen bei mir zusammen. Für Fragen und Änderungen haben Sie mich als direkten Ansprechpartner.</p></div>
          <ManagedFlow />
          <div className="rf-care-grid">
            <article className="rf-care-card rf-reveal"><div className="rf-care-icon" aria-hidden="true"><svg viewBox="0 0 48 48" fill="none"><path d="M24 5 39 11v12c0 10-15 19-15 19S9 33 9 23V11L24 5Z" stroke="currentColor" strokeWidth="1.5"/><path d="m17 24 5 5 10-11" stroke="currentColor" strokeWidth="2"/></svg></div><span className="rf-care-risk">Sicherheit</span><h3>Sicherheitsupdates<br />inklusive.</h3><p>Sicherheitsupdates, SSL und Backups gehören dazu. Kritische Änderungen prüfe ich.</p><span className="rf-care-tag"><i /> Updates & Backups</span></article>
            <article className="rf-care-card rf-reveal"><div className="rf-care-icon" aria-hidden="true"><svg viewBox="0 0 48 48" fill="none"><rect x="6" y="11" width="36" height="26" rx="4" stroke="currentColor" strokeWidth="1.5"/><path d="m7 13 17 13 17-13M15 36l7-7m11 7-7-7" stroke="currentColor" strokeWidth="1.5"/></svg></div><span className="rf-care-risk">Kontaktformular</span><h3>Formular & Mail<br />im Blick.</h3><p>Testanfragen prüfen den Weg bis zum Posteingang.</p><span className="rf-care-tag"><i /> Formular → Mail → Eingang</span></article>
            <article className="rf-care-card rf-reveal"><div className="rf-care-icon" aria-hidden="true"><svg viewBox="0 0 48 48" fill="none"><rect x="5" y="9" width="38" height="27" rx="4" stroke="currentColor" strokeWidth="1.5"/><path d="M10 25h7l4-9 6 16 4-9h7M18 42h12m-6-6v6" stroke="currentColor" strokeWidth="1.5"/></svg></div><span className="rf-care-risk">Erreichbarkeit</span><h3>Ausfälle<br />früh erkennen.</h3><p>Automatische Checks melden Ausfälle. Ich kümmere mich.</p><span className="rf-care-tag"><i /> Monitoring & Betreuung</span></article>
            <article className="rf-care-card rf-reveal"><div className="rf-care-icon" aria-hidden="true"><svg viewBox="0 0 48 48" fill="none"><path d="m10 33-2 8 8-2L38 17l-6-6L10 33Z" stroke="currentColor" strokeWidth="1.5"/><path d="m28 15 6 6M10 33l6 6M30 41h11" stroke="currentColor" strokeWidth="1.5"/></svg></div><span className="rf-care-risk">Änderungen</span><h3>Änderungen<br />per E-Mail.</h3><p>Text oder Bild ändern? Eine kurze Mail an mich reicht. Ich kümmere mich zügig um die Umsetzung.</p><span className="rf-care-tag"><i /> Änderungen zum Festpreis</span></article>
          </div>
          <div className="rf-managed-bottom"><p>Noch eine alte WordPress- oder PHP-Version?<br /><span>Veraltete Software kann Sicherheitslücken offenlassen.</span></p><a className="rf-button rf-button-light" href={MAIL}>Website prüfen lassen <Arrow /></a></div>
        </div></section>
        <section className="rf-section rf-wrap rf-custom" id="individuelle-funktionen" aria-labelledby="rf-custom-heading">
          <div className="rf-section-heading rf-reveal"><div><p className="rf-eyebrow">Wenn Ihre Website mehr können soll</p><h2 id="rf-custom-heading">Eine gute Idee?<br /><em>Baue ich Ihnen.</em></h2></div><p>Manchmal reicht eine schöne Website. Manchmal spart eine passende Funktion jeden Tag Arbeit. Dafür entwickle ich individuelle Erweiterungen.</p></div>
          <div className="rf-custom-grid">
            <article className="rf-care-card rf-reveal"><span className="rf-custom-number">01 / Kalkulieren</span><h3>Angebote vorbereiten.</h3><p>Ein Rechner fragt die wichtigsten Angaben ab und bereitet eine Anfrage vor, etwa mit Fläche, Material und Fotos. Sie bekommen die Informationen, die Sie für ein Angebot brauchen.</p></article>
            <article className="rf-care-card rf-reveal"><span className="rf-custom-number">02 / Organisieren</span><h3>Anfragen im Blick behalten.</h3><p>Ein kleiner Arbeitsbereich bündelt neue Anfragen, Zuständigkeiten und den Bearbeitungsstand. Auf Wunsch auch mit angebundenem WhatsApp Business oder einem Ticketsystem.</p></article>
            <article className="rf-care-card rf-reveal"><span className="rf-custom-number">03 / Verbinden</span><h3>Weniger doppelt eingeben.</h3><p>Website, Terminbuchung und vorhandene Werkzeuge miteinander verbinden. Wir schauen gemeinsam, welcher Ablauf in Ihrem Betrieb einfacher werden kann.</p></article>
          </div><div className="rf-about-links"><p>Individuelle Entwicklung nach Absprache und mit eigenem Festpreisangebot.</p><a href={MAIL} className="rf-text-link">Ihre Idee mit mir besprechen <Arrow /></a></div>
        </section>
        <section className="rf-section rf-wrap" id="ablauf"><div className="rf-section-heading rf-reveal"><div><p className="rf-eyebrow">03 / Zusammenarbeit</p><h2>Kein Workshop.<br /><em>Kein Meeting-Wahnsinn.</em></h2></div><p>Vorschlag ansehen. Freigeben. Domain verbinden. Fertig.</p></div><div className="rf-steps">{[["01", "Link schicken.", "Ihre bestehende Website reicht als Grundlage."],["02", "Vorschau ansehen.", "Ich präsentiere meinen Vorschlag. Sie sehen, was Sie bekommen."],["03", "Freigeben.", "Ihre Änderungen kommen in eine Korrekturrunde. Dann setze ich um."],["04", "Domain verbinden.", "Sie ändern die Domain-Einträge nach meiner Anleitung. Ich schalte live."]].map(([n,title,text]) => <article className="rf-step rf-reveal" key={n}><span>{n}</span><h3>{title}</h3><p>{text}</p></article>)}</div></section>
        <section className="rf-wrap rf-price-section" id="preis"><div className="rf-price-panel rf-reveal"><div><p className="rf-eyebrow">04 / Kosten</p><h2>Einmal auffrischen.<br /><em>Dauerhaft betreut.</em></h2><p>Für kleine Unternehmenswebsites mit vorhandenen Inhalten und bis zu fünf Seiten.</p><a className="rf-button rf-button-light" href={MAIL}>Passt das zu meiner Website? <Arrow /></a></div><div className="rf-price-details"><div className="rf-price"><span>Website überarbeiten</span><strong>249 <small>€</small></strong><span>einmalig, netto</span></div><div className="rf-price rf-price-month"><span>Hosting & Managed Service</span><strong>39 <small>€ / Monat</small></strong><span>netto, zzgl. gesetzlicher Umsatzsteuer</span></div><ul>{["Bis zu fünf Seiten mit Ihren vorhandenen Inhalten", "Modernes Design für Handy, Tablet und Desktop", "Eine Korrekturrunde vor dem Livegang", "Hosting, SSL, Backups & Sicherheitsupdates"].map(x=><li key={x}><Check /> {x}</li>)}</ul><p className="rf-price-small">Inklusive Erreichbarkeits- und Formularchecks. Extras zum Festpreis. Laufzeit und Leistungsumfang im Angebot.</p></div></div></section>
        <section className="rf-section rf-wrap rf-team" id="ueber-mich" aria-labelledby="rf-about-heading">
          <div className="rf-section-heading rf-reveal"><div><p className="rf-eyebrow">05 / Über mich</p><h2 id="rf-about-heading">Zurück zu dem,<br /><em>was mir Spaß macht.</em></h2></div><p>Ich bin Felix. Websites habe ich schon lange vor meiner Zeit in der Startup-Szene gebaut. Jetzt nehme ich mir dafür wieder Zeit.</p></div>
          <div className="rf-personal-story rf-reveal">
            <Image src="/team/felix.jpg" width={560} height={560} sizes="(max-width: 760px) 80vw, 360px" alt="Felix Becker" />
            <div><p>Sechs Jahre lang ging es für mich um Startups, Technologie und neue Ideen, unter anderem bei Heartcore Capital. Heute bin ich in der Geschäftsführung unseres Familienunternehmens Holzland Becker und arbeite an E-Commerce und Digitalisierung.</p><p>Webdesign ist mein kreativer Ausgleich dazu: etwas gestalten, an den Details feilen und am Ende eine Website sehen, die zu dem Menschen und dem Betrieb dahinter passt.</p><p>Ich mache das nebenberuflich und unter meinem eigenen Namen. Wenn Sie mir schreiben, sprechen Sie direkt mit mir, von der ersten Idee bis zur Betreuung Ihrer Website.</p><a href="https://becker.so" className="rf-text-link">Mehr über mich, meine Projekte und Gedanken auf becker.so <Arrow /></a></div>
          </div>
          <div className="rf-about-links"><a href={MAIL} className="rf-text-link">Direkt an Felix: felix@becker.im <Arrow /></a></div>
        </section>
        <section className="rf-section rf-wrap rf-references" id="referenzen" aria-labelledby="rf-references-heading">
          <div className="rf-section-heading rf-reveal"><div><p className="rf-eyebrow">Frühere Webprojekte</p><h2 id="rf-references-heading">Schon vor<br /><em>der Startup-Zeit.</em></h2></div><p>Von Event-Websites bis zum lokalen Betrieb: eine Auswahl meiner früheren Webdesign-Arbeit.</p></div>
          <div className="rf-reference-strip" role="region" aria-label="Frühere Webprojekte, horizontal scrollbar" tabIndex={0}>
            <span>WORLD CLUB DOME<small>Event-Website</small></span><span>Aquaba Events<small>Event-Website</small></span><span>toolifeout.de<small>Event-Website</small></span><span>Emmanuel Austin<small>Künstler-Website</small></span><span>EK Entrümpelung<small>Unternehmenswebsite · 2016</small></span>
          </div><p className="rf-reference-note">Historische Projekte. Die damaligen Websites sind teilweise nicht mehr online; heutige Seitenstände zeigen nicht zwangsläufig meine Arbeit.</p>
        </section>
        <section className="rf-section rf-wrap rf-faq"><div className="rf-reveal"><p className="rf-eyebrow">06 / Häufige Fragen</p><h2>Kurz gefragt.</h2></div><div className="rf-faq-list">{[["Brauche ich neue Texte und Bilder?", "Meist nicht. Ich verwende Ihre vorhandenen Inhalte mit Ihren Nutzungsrechten."],["Bleiben Domain und E-Mail?", "Ja. Änderungen stimmen wir vorher ab. Postfächer ziehe ich nicht automatisch um."],["Was passiert mit bestehenden Google-Links?", "Bestehende Seitenadressen bleiben. Nötige Änderungen erhalten Weiterleitungen."],["Was gehört zur Betreuung?", "Hosting, SSL, Backups, Sicherheitsupdates und Erreichbarkeitschecks. Bei betreuten Formularen prüfe ich regelmäßig den Weg bis zur Test-Mail."],["Kann ich später Inhalte ändern lassen?", "Ja, zum vorher vereinbarten Festpreis."],["Brauchen wir ein Telefonat?", "Nein. Alles geht per E-Mail."],["Sind die Beispiele Kundenprojekte?", "Die Vorher-/Nachher-Beispiele sind eigene Designkonzepte für fiktive Betriebe. Unter frühere Webprojekte stehen separat Arbeiten aus meiner früheren Webdesign-Zeit."],["Wer ist mein Ansprechpartner?", "Ich, Felix Becker. Ich gestalte Websites nebenberuflich unter meinem eigenen Namen. Sie stimmen sich direkt mit mir ab."],["Passt das Paket zu meiner Website?", "Für bis zu fünf Seiten mit vorhandenen Inhalten. Shops und komplexe Funktionen erhalten ein eigenes Angebot."]].map(([q,a])=><details key={q} className="rf-reveal"><summary>{q}<span aria-hidden="true">+</span></summary><p>{a}</p></details>)}</div></section>
        <section className="rf-final"><div className="rf-wrap rf-reveal"><p className="rf-eyebrow">Ihre Website überarbeiten lassen</p><h2>Zeit für<br /><em>Ihre Website.</em></h2><p>Ein Link genügt. Ich melde mich mit einem Vorschlag.</p><a className="rf-button" href={MAIL}>Website zeigen <Arrow /></a><span className="rf-final-mail">Oder direkt: <a href="mailto:felix@becker.im">felix@becker.im</a></span></div></section>
      </main>
      <footer className="rf-footer rf-wrap"><Link href="/" className="rf-footer-brand">Felix Becker<span>Webdesign & Entwicklung.</span></Link><div><a href="https://becker.so">Persönlicher Blog</a><a href="mailto:felix@becker.im">Kontakt</a><a href="https://github.com/tfbecker" target="_blank" rel="noopener noreferrer">GitHub ↗</a><span>© {new Date().getFullYear()} Felix Becker</span></div><p>Konzeptfoto: <a href="https://unsplash.com/photos/window-cleaners-work-on-a-modern-glass-building-SBdgqsJfS7I" target="_blank" rel="noopener noreferrer">Unsplash</a>. Gezeigte Branchenbeispiele sind freie Designkonzepte.</p></footer>
    </div>
  )
}
