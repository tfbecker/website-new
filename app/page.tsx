import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { Comparison, RefreshEffects } from "@/components/refresh/interactive"
import "./refresh.css"

export const metadata: Metadata = {
  title: { absolute: "Website-Refresh für kleine Unternehmen | Felix Becker" },
  description: "Ihre Website. Nur frischer. Ich modernisiere Ihre bestehende Website mit Ihren Texten und Bildern. Mobil, schnell und persönlich betreut. 249 € einmalig, 49 € monatlich, jeweils netto.",
  alternates: { canonical: "https://becker.so" },
  openGraph: { title: "Ihre Website. Nur frischer. | Felix Becker", description: "Ein frischer Auftritt für Ihr Unternehmen. Mit Ihren Inhalten, einem klaren Preis und wenig Aufwand für Sie.", locale: "de_DE", url: "https://becker.so" },
  twitter: { title: "Ihre Website. Nur frischer. | Felix Becker", description: "Website-Refresh für kleine Unternehmen. Persönlich, schnell und unkompliziert." },
}

const MAIL = "mailto:felix@becker.so?subject=Website-Refresh%20anfragen&body=Hallo%20Felix%2C%0A%0Aich%20interessiere%20mich%20f%C3%BCr%20einen%20Website-Refresh.%0AMeine%20Website%3A%20%0A%0AViele%20Gr%C3%BC%C3%9Fe"
const Arrow = () => <span aria-hidden="true">↗</span>
const Check = () => <span className="rf-check" aria-hidden="true">✓</span>

export default function Page() {
  return (
    <div className="rf-site" lang="de" data-refresh-home>
      <RefreshEffects />
      <a className="rf-skip" href="#inhalt">Zum Inhalt</a>
      <header className="rf-header">
        <Link href="/" className="rf-brand" aria-label="Felix Becker, Startseite"><span className="rf-monogram">fb<span>↗</span></span><span>Felix Becker<small>Webdesign & Entwicklung</small></span></Link>
        <nav aria-label="Hauptnavigation"><a href="#beispiele">Beispiele</a><a href="#ablauf">Ablauf</a><a href="#preis">Preis</a></nav>
        <a href={MAIL} className="rf-nav-cta">Schreiben wir uns <Arrow /></a>
      </header>
      <main id="inhalt">
        <section className="rf-hero rf-wrap">
          <div className="rf-hero-copy rf-enter">
            <p className="rf-eyebrow"><span className="rf-status" /> Für kleine Unternehmen mit großen Aufgaben</p>
            <h1>Ihre Website.<br /><em>Nur frischer.</em></h1>
            <p className="rf-lead">Sie machen gute Arbeit.<br />Ihre Website darf das auch zeigen.</p>
            <p className="rf-hero-detail">Ich frische Ihren bestehenden Auftritt auf: mit Ihren Texten, Ihren Bildern und einem Design, das heute passt. Klarer, schneller und auf dem Handy gut bedienbar.</p>
            <div className="rf-actions"><a className="rf-button" href={MAIL}>Unverbindliche Vorschau anfragen <Arrow /></a><a href="#beispiele" className="rf-text-link">Erst mal ansehen <span aria-hidden="true">↓</span></a></div>
            <p className="rf-micro">Persönlich mit Felix · Alles per E-Mail möglich · Kein Verkaufsgespräch nötig</p>
          </div>
          <div className="rf-hero-visual rf-enter" style={{ animationDelay: ".12s" }}>
            <div className="rf-hero-browser">
              <div className="rf-browser-top"><span className="rf-dots"><i /><i /><i /></span><span>Ihre vertraute Website. Neu gedacht.</span><span>↗</span></div>
              <div className="rf-clean-site">
                <div className="rf-clean-nav"><b>klarwerk<span>✳</span></b><span>Räume. In guten Händen.</span><i>↗</i></div>
                <div className="rf-clean-copy"><span className="rf-mini-label">GEBÄUDEREINIGUNG · DESIGNKONZEPT</span><h2>Ein guter Tag<br />beginnt <em>sauber.</em></h2><p>Für Räume, in denen man gerne arbeitet.<br />Und einen ersten Eindruck, der bleibt.</p><span className="rf-mini-button">Lernen wir uns kennen ↗</span></div>
                <div className="rf-clean-photo"><Image src="/refresh/window-cleaning.jpg" alt="Glasreinigung an einer modernen Gebäudefassade, Stockfoto im Designkonzept" width={1400} height={900} sizes="(max-width: 760px) 90vw, 42vw" priority /><span>Klare Sicht.<br />Klare Sache.</span></div>
                <div className="rf-clean-bottom"><span>01 / Büroreinigung</span><span>02 / Glasreinigung</span><span>03 / Treppenhäuser</span></div>
              </div>
            </div>
            <div className="rf-floating-note"><span aria-hidden="true">✳</span><div>Gleicher Betrieb.<br /><b>Ein ganz anderer Eindruck.</b></div></div>
            <p className="rf-concept-caption">Freies Designkonzept für einen fiktiven Betrieb. Keine Kundenreferenz.</p>
          </div>
        </section>
        <div className="rf-promise-line"><div className="rf-wrap"><span><Check /> Ihre Inhalte bleiben</span><span><Check /> Auf dem Handy durchdacht</span><span><Check /> Technisch aufgeräumt</span><span><Check /> Eine feste Ansprechperson</span></div></div>
        <section className="rf-section rf-wrap" id="beispiele">
          <div className="rf-section-heading rf-reveal"><div><p className="rf-eyebrow">01 / So kann ein Refresh aussehen</p><h2>Wiedererkennbar.<br /><em>Nur besser gemacht.</em></h2></div><p>Sie müssen nicht alles neu erfinden.<br />Manchmal reicht es, das Gute besser zu zeigen.</p></div>
          <Comparison />
          <div className="rf-comparison-caption"><p><b>Gleiche Leistungen. Gleiche Inhalte. Klarer präsentiert.</b><br />Ziehen Sie den Regler, um beide Gestaltungsideen zu vergleichen.</p><span>Illustrativer Vorher-/Nachher-Vergleich.<br />Beide Ansichten sind freie Konzepte.</span></div>
          <div className="rf-concept-grid">
            <Link href="/konzepte/klarwerk" className="rf-concept-card rf-reveal"><div className="rf-concept-art rf-art-clean"><span>KLARWERK✳</span><strong>Saubere Räume.<br /><em>Gutes Gefühl.</em></strong><span className="rf-art-link">Das Reinigungskonzept ansehen ↗</span></div><div><h3>Gebäudereinigung</h3><p>Leistungen erklären. Vertrauen schaffen. Kontakt einfach machen.</p><span className="rf-chip">Freies Designkonzept</span></div></Link>
            <Link href="/konzepte/werkraum" className="rf-concept-card rf-reveal"><div className="rf-concept-art rf-art-craft"><span>WERKRAUM / HANDWERK</span><strong>Gut gemacht.<br /><em>Für lange.</em></strong><span className="rf-art-link">Das Handwerkskonzept ansehen ↗</span><i aria-hidden="true" /></div><div><h3>Handwerk & Hausservice</h3><p>Handwerkliche Qualität auch online sichtbar machen.</p><span className="rf-chip">Freies Designkonzept</span></div></Link>
          </div>
        </section>
        <section className="rf-benefits"><div className="rf-wrap rf-section"><div className="rf-benefit-intro rf-reveal"><p className="rf-eyebrow">02 / Das bleibt. Das wird besser.</p><h2>Ihr Geschäft bleibt.<br /><em>Der Auftritt wächst mit.</em></h2><p>Ein Refresh ist kein neuer Berg Arbeit für Sie. Wir nehmen, was schon da ist, und machen einen stimmigen Auftritt daraus.</p></div><div className="rf-benefit-list">
          {[ ["01", "Ihre Inhalte. Besser auf den Punkt.", "Vorhandene Texte, Bilder, Logo und Leistungen bilden die Grundlage. Wir ordnen, kürzen nach Absprache und machen Wichtiges leichter auffindbar."], ["02", "Auf dem Handy genauso gut.", "Lesbare Texte, klare Navigation und Kontaktmöglichkeiten, die man auch mit dem Daumen trifft. Von Anfang an für kleine Bildschirme gestaltet."], ["03", "Weniger Ballast. Mehr Tempo.", "Optimierte Bilder, schlanker Code und dezente Animationen. Wir arbeiten gezielt an Ladezeit und Core Web Vitals und vergleichen die Messwerte vor und nach dem Refresh."], ["04", "Eine saubere Grundlage für Google.", "Verständliche Seitenstruktur, passende Seitentitel und wichtige bestehende URLs im Blick. Falls sich Adressen ändern, planen wir die Weiterleitungen ein."] ].map(([n,title,text]) => <article key={n} className="rf-benefit rf-reveal"><span>{n}</span><div><h3>{title}</h3><p>{text}</p></div></article>)}
        </div><p className="rf-ranking-note">Eine gute technische Grundlage unterstützt die Auffindbarkeit. Bestimmte Google-Platzierungen oder Messergebnisse lassen sich vorab nicht versprechen.</p></div></section>
        <section className="rf-section rf-wrap" id="ablauf"><div className="rf-section-heading rf-reveal"><div><p className="rf-eyebrow">03 / Wenig Aufwand für Sie</p><h2>Eine kurze Mail.<br /><em>Ein frischer Anfang.</em></h2></div><p>Kein langes Briefing. Keine neue Fotosammlung.<br />Und kein Terminmarathon.</p></div><div className="rf-steps">{[["01", "Sie schicken den Link.", "Eine E-Mail mit Ihrer bisherigen Website reicht für den Start. Wir klären kurz, was bleiben soll und was Sie stört."],["02", "Ich zeige eine Vorschau.", "Wenn der Umfang passt, bekommen Sie einen unverbindlichen Gestaltungsvorschlag. Erst anschauen, dann entscheiden."],["03", "Wir machen es rund.", "Nach Ihrer Beauftragung setzen wir den Refresh um. Eine gemeinsame Korrekturrunde ist enthalten."],["04", "Ihre Website geht live.", "Wir stimmen den Wechsel ab. Anschließend übernehme ich Hosting und technische Betreuung."]].map(([n,title,text]) => <article className="rf-step rf-reveal" key={n}><span>{n}</span><h3>{title}</h3><p>{text}</p></article>)}</div></section>
        <section className="rf-wrap rf-price-section" id="preis"><div className="rf-price-panel rf-reveal"><div><p className="rf-eyebrow">04 / Ein überschaubares Paket</p><h2>Ein klarer Preis.<br /><em>Keine große Sache.</em></h2><p>Für kleine Unternehmenswebsites mit vorhandenen Inhalten und bis zu fünf Seiten.</p><a className="rf-button rf-button-light" href={MAIL}>Passt das zu meiner Website? <Arrow /></a></div><div className="rf-price-details"><div className="rf-price"><span>Der Refresh</span><strong>249 <small>€</small></strong><span>einmalig, netto</span></div><div className="rf-price rf-price-month"><span>Hosting & technische Betreuung</span><strong>49 <small>€ / Monat</small></strong><span>netto, zzgl. gesetzlicher Umsatzsteuer</span></div><ul>{["Bis zu fünf Seiten mit Ihren vorhandenen Inhalten", "Modernes Design für Handy, Tablet und Desktop", "Eine Korrekturrunde vor dem Livegang", "Hosting, SSL, Backups und technische Pflege"].map(x=><li key={x}><Check /> {x}</li>)}</ul><p className="rf-price-small">Zusätzliche Seiten, Funktionen und spätere Inhaltsänderungen erhalten vorab einen eigenen Festpreis. Vertragslaufzeit und Wechselbedingungen vereinbaren wir im schriftlichen Angebot.</p></div></div></section>
        <section className="rf-section rf-wrap rf-about" id="felix"><div className="rf-about-photo rf-reveal"><Image src="/fun/ski.jpeg" width={560} height={700} sizes="(max-width: 760px) 80vw, 300px" alt="Felix beim Skifahren im Tiefschnee" /><span>Felix, abseits des Bildschirms.</span></div><div className="rf-about-copy rf-reveal"><p className="rf-eyebrow">05 / Der Mensch hinter der Website</p><h2>Hi, ich bin Felix.<br /><em>Ich mache das einfach.</em></h2><p>Ich entwickle Websites und Software und beschäftige mich viel mit Automatisierung und E-Commerce. Was mich daran interessiert: gute Ideen so umzusetzen, dass sie im Alltag funktionieren.</p><p>Bei Ihrem Refresh sprechen Sie direkt mit mir. Ich nutze moderne Werkzeuge, um zügig zu arbeiten, und achte selbst darauf, dass Gestaltung, Inhalte und Technik zusammenpassen.</p><div className="rf-about-links"><a href={MAIL} className="rf-text-link">felix@becker.so <Arrow /></a><Link href="/blog" className="rf-text-link">Was ich sonst baue und schreibe <Arrow /></Link></div></div></section>
        <section className="rf-section rf-wrap rf-faq"><div className="rf-reveal"><p className="rf-eyebrow">06 / Noch kurz geklärt</p><h2>Gute Fragen.<br /><em>Klare Antworten.</em></h2></div><div className="rf-faq-list">{[["Muss ich neue Texte und Bilder liefern?", "In der Regel nicht. Wir verwenden Ihre vorhandenen Inhalte, soweit Sie die nötigen Nutzungsrechte haben. Falls etwas fehlt oder veraltet ist, klären wir das kurz per E-Mail."],["Bleiben meine Domain und E-Mail-Adressen?", "Ihre Domain kann bleiben. Bestehende E-Mail-Postfächer ziehen wir nicht automatisch um. Vor der Veröffentlichung klären wir genau, was technisch geändert werden muss und was bestehen bleibt."],["Was passiert mit meinen bestehenden Google-Links?", "Wir erfassen wichtige Seitenadressen und erhalten sie, wo es sinnvoll möglich ist. Wenn sich eine URL ändert, planen wir eine passende Weiterleitung. Eine bestimmte Rankingentwicklung kann niemand seriös garantieren."],["Wie lange dauert der Refresh?", "Das hängt vom Umfang und Ihren Rückmeldungen ab. Nach dem ersten Blick auf Ihre Website nenne ich einen realistischen Zeitplan. Es gibt keine pauschale Lieferzusage, bevor der Umfang klar ist."],["Kann ich später etwas ändern lassen?", "Ja. Kleine Text- oder Bildänderungen und größere Erweiterungen bekommen vorab einen klaren Festpreis. Die monatliche Betreuung umfasst den technischen Betrieb, keine unbegrenzten Inhaltsänderungen."],["Ist ein Telefonat nötig?", "Nein. Anfrage, Abstimmung und Freigabe können komplett per E-Mail laufen. Wenn Sie lieber sprechen möchten, finden wir natürlich auch dafür einen Weg."],["Sind die gezeigten Websites echte Kundenprojekte?", "Die hier gezeigten Reinigungs- und Handwerksseiten sind freie Designkonzepte für fiktive Betriebe. Sie zeigen meine Gestaltungsrichtung und sind ausdrücklich keine Kundenreferenzen."],["Ist meine Website für das Paket geeignet?", "Das Paket passt zu überschaubaren Unternehmenswebsites mit bis zu fünf Seiten und vorhandenen Inhalten. Shops, komplexe Buchungssysteme und größere individuelle Funktionen benötigen ein eigenes Angebot."]].map(([q,a])=><details key={q} className="rf-reveal"><summary>{q}<span aria-hidden="true">+</span></summary><p>{a}</p></details>)}</div></section>
        <section className="rf-final"><div className="rf-wrap rf-reveal"><p className="rf-eyebrow">Ihre Website kann das auch.</p><h2>Zeigen wir, was<br /><em>in Ihrem Betrieb steckt.</em></h2><p>Schicken Sie mir einfach den Link zu Ihrer Website.<br />Ich schaue sie mir an und melde mich mit einem Vorschlag.</p><a className="rf-button" href={MAIL}>Unverbindliche Vorschau anfragen <Arrow /></a><span className="rf-final-mail">Oder direkt: <a href="mailto:felix@becker.so">felix@becker.so</a></span></div></section>
      </main>
      <footer className="rf-footer rf-wrap"><Link href="/" className="rf-footer-brand">Felix Becker<span>Websites mit einem frischen Blick.</span></Link><div><Link href="/blog">Persönlicher Blog</Link><a href="mailto:felix@becker.so">Kontakt</a><a href="https://github.com/tfbecker" target="_blank" rel="noopener noreferrer">GitHub ↗</a><span>© {new Date().getFullYear()} Felix Becker</span></div><p>Konzeptfoto: <a href="https://unsplash.com/photos/window-cleaners-work-on-a-modern-glass-building-SBdgqsJfS7I" target="_blank" rel="noopener noreferrer">Unsplash</a>. Gezeigte Branchenbeispiele sind freie Designkonzepte.</p></footer>
    </div>
  )
}
