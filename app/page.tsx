import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { Comparison, RefreshEffects } from "@/components/refresh/interactive"
import "./refresh.css"

export const metadata: Metadata = {
  title: { absolute: "Website überarbeiten lassen | Felix Becker" },
  description: "Ich überarbeite Ihre bestehende Website: neues Design, kürzere Ladezeiten und eine gute Handyansicht. 249 € einmalig, 49 € monatlich, jeweils netto.",
  alternates: { canonical: "https://becker.so" },
  openGraph: { title: "Website überarbeiten lassen | Felix Becker", description: "Ich überarbeite Ihre Website und übernehme Ihre vorhandenen Inhalte. Sie sehen den Entwurf, bevor Sie sich entscheiden.", locale: "de_DE", url: "https://becker.so" },
  twitter: { title: "Website überarbeiten lassen | Felix Becker", description: "Bestehende Website überarbeiten lassen. Design, Ladezeit und Handyansicht aus einer Hand." },
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
        <a href={MAIL} className="rf-nav-cta">E-Mail schreiben <Arrow /></a>
      </header>
      <main id="inhalt">
        <section className="rf-hero rf-wrap">
          <div className="rf-hero-copy rf-enter">
            <p className="rf-eyebrow"><span className="rf-status" /> Webdesign für kleine Unternehmen</p>
            <h1>Ich überarbeite<br /><em>Ihre Website.</em></h1>
            <p className="rf-lead">Neues Design für Ihren bestehenden Auftritt.</p>
            <p className="rf-hero-detail">Ihre Website ist in die Jahre gekommen? Ich kümmere mich um das Design und die Technik. Ihre Texte, Fotos und Ihr Logo verwende ich weiter. Sie müssen dafür keine neuen Inhalte vorbereiten.</p>
            <div className="rf-actions"><a className="rf-button" href={MAIL}>Website zeigen <Arrow /></a><a href="#beispiele" className="rf-text-link">Beispiele ansehen <span aria-hidden="true">↓</span></a></div>
            <p className="rf-micro">Abstimmung direkt mit mir. Auf Wunsch komplett per E-Mail.</p>
          </div>
          <div className="rf-hero-visual rf-enter" style={{ animationDelay: ".12s" }}>
            <div className="rf-hero-browser">
              <div className="rf-browser-top"><span className="rf-dots"><i /><i /><i /></span><span>Beispiel: Website einer Gebäudereinigung</span><span>↗</span></div>
              <div className="rf-clean-site">
                <div className="rf-clean-nav"><b>klarwerk<span>✳</span></b><span>Räume. In guten Händen.</span><i>↗</i></div>
                <div className="rf-clean-copy"><span className="rf-mini-label">GEBÄUDEREINIGUNG · DESIGNKONZEPT</span><h2>Ein guter Tag<br />beginnt <em>sauber.</em></h2><p>Für Räume, in denen man gerne arbeitet.<br />Und einen ersten Eindruck, der bleibt.</p><span className="rf-mini-button">Lernen wir uns kennen ↗</span></div>
                <div className="rf-clean-photo"><Image src="/refresh/window-cleaning.jpg" alt="Glasreinigung an einer modernen Gebäudefassade, Stockfoto im Designkonzept" width={1400} height={900} sizes="(max-width: 760px) 90vw, 42vw" priority /><span>Klare Sicht.<br />Klare Sache.</span></div>
                <div className="rf-clean-bottom"><span>01 / Büroreinigung</span><span>02 / Glasreinigung</span><span>03 / Treppenhäuser</span></div>
              </div>
            </div>
            <div className="rf-floating-note"><span aria-hidden="true">✳</span><div>Texte und Bilder bleiben.<br /><b>Die Website wird überarbeitet.</b></div></div>
            <p className="rf-concept-caption">Freies Designkonzept für einen fiktiven Betrieb. Keine Kundenreferenz.</p>
          </div>
        </section>
        <div className="rf-promise-line"><div className="rf-wrap"><span><Check /> Ihre Inhalte bleiben</span><span><Check /> Fürs Handy angepasst</span><span><Check /> Ladezeit optimieren</span><span><Check /> Direkt mit Felix</span></div></div>
        <section className="rf-section rf-wrap" id="beispiele">
          <div className="rf-section-heading rf-reveal"><div><p className="rf-eyebrow">01 / Gestaltungsbeispiele</p><h2>So könnte Ihre<br /><em>Website aussehen.</em></h2></div><p>Zwei Entwürfe für kleine Betriebe.<br />Zum Vergleichen und Ausprobieren.</p></div>
          <Comparison />
          <div className="rf-comparison-caption"><p><b>Ein Beispiel für die Überarbeitung einer bestehenden Website.</b><br />Ziehen Sie den Regler, um beide Gestaltungsideen zu vergleichen.</p><span>Illustrativer Vorher-/Nachher-Vergleich.<br />Beide Ansichten sind freie Konzepte.</span></div>
          <div className="rf-concept-grid">
            <Link href="/konzepte/klarwerk" className="rf-concept-card rf-reveal"><div className="rf-concept-art rf-art-clean"><span>KLARWERK✳</span><strong>Saubere Räume.<br /><em>Gutes Gefühl.</em></strong><span className="rf-art-link">Das Reinigungskonzept ansehen ↗</span></div><div><h3>Gebäudereinigung</h3><p>Büro-, Glas- und Treppenhausreinigung mit direkter Kontaktmöglichkeit.</p><span className="rf-chip">Freies Designkonzept</span></div></Link>
            <Link href="/konzepte/werkraum" className="rf-concept-card rf-reveal"><div className="rf-concept-art rf-art-craft"><span>WERKRAUM / HANDWERK</span><strong>Gut gemacht.<br /><em>Für lange.</em></strong><span className="rf-art-link">Das Handwerkskonzept ansehen ↗</span><i aria-hidden="true" /></div><div><h3>Handwerk & Hausservice</h3><p>Eine Website für einen Betrieb aus dem Handwerk.</p><span className="rf-chip">Freies Designkonzept</span></div></Link>
          </div>
        </section>
        <section className="rf-benefits"><div className="rf-wrap rf-section"><div className="rf-benefit-intro rf-reveal"><p className="rf-eyebrow">02 / Was ich überarbeite</p><h2>Was bringt Ihnen<br /><em>die Überarbeitung?</em></h2><p>Besucher sollen schnell verstehen, was Sie anbieten, und Sie ohne Umwege erreichen. Dafür überarbeite ich den Aufbau Ihrer Website und die Technik dahinter.</p></div><div className="rf-benefit-list">
          {[ ["01", "Ihre Leistungen sind leichter zu finden", "Ich ordne Ihre vorhandenen Inhalte und mache Ihre Leistungen und Kontaktdaten direkt erreichbar. Änderungen an Texten stimmen wir vorher ab."], ["02", "Lesbar und bedienbar auf dem Handy", "Besucher können Texte ohne Zoomen lesen und direkt anrufen oder eine E-Mail schreiben. Ich prüfe die Seiten auf kleinen und großen Bildschirmen."], ["03", "Die Seite lädt schneller", "Große Bilder und unnötige Skripte bremsen viele ältere Websites aus. Ich optimiere beides und vergleiche die Ladezeit vor und nach der Überarbeitung unter denselben Testbedingungen."], ["04", "Bestehende Seiten bleiben auffindbar", "Ich übernehme bestehende Seitenadressen und prüfe Seitentitel, interne Links und die Sitemap. Wenn eine Adresse geändert werden muss, richte ich eine passende Weiterleitung ein."] ].map(([n,title,text]) => <article key={n} className="rf-benefit rf-reveal"><span>{n}</span><div><h3>{title}</h3><p>{text}</p></div></article>)}
        </div><p className="rf-ranking-note">Gute Core Web Vitals unterstützen die Nutzererfahrung und können zur Sichtbarkeit bei Google beitragen. Welche Verbesserung bei Ihrer Website möglich ist, kläre ich nach der ersten Messung.</p></div></section>
        <section className="rf-section rf-wrap rf-impact" id="ladezeit" aria-labelledby="rf-impact-title">
          <div className="rf-section-heading rf-reveal"><div><p className="rf-eyebrow">Ladezeit & Bedienung</p><h2 id="rf-impact-title">Was eine schnelle<br /><em>Website ausmacht.</em></h2></div><p>Ich messe vor und nach der Überarbeitung.<br />Diese Google-Richtwerte dienen dabei als Orientierung.</p></div>
          <div className="rf-vitals-grid">
            <article className="rf-vital rf-reveal"><span>Ladezeit · LCP</span><strong>≤ 2,5 <small>Sekunden</small></strong><h3>Der wichtigste Inhalt ist sichtbar.</h3><p>Besucher sehen das große Bild oder die Überschrift, während die übrige Seite nachlädt. Dafür optimiere ich Bilder, Schriften und die Auslieferung.</p></article>
            <article className="rf-vital rf-reveal"><span>Reaktion · INP</span><strong>≤ 200 <small>Millisekunden</small></strong><h3>Die Seite reagiert auf Eingaben.</h3><p>Ein Klick auf das Menü oder eine Schaltfläche soll ohne merkliche Verzögerung funktionieren. Weniger JavaScript lässt dem Browser mehr Zeit dafür.</p></article>
            <article className="rf-vital rf-reveal"><span>Stabilität · CLS</span><strong>≤ 0,1 <small>Messwert</small></strong><h3>Beim Laden verrutscht nichts.</h3><p>Platz für Bilder und Schriften wird von Anfang an reserviert. So springt der Kontaktbutton nicht weg, während jemand darauf tippen möchte.</p></article>
          </div>
          <p className="rf-vitals-note">Das sind Zielwerte, keine bereits erzielten Kundenergebnisse. Die tatsächlichen Core Web Vitals ergeben sich aus echten Besuchen. Vorher-/Nachher-Tests zeigen zusätzlich, was sich unter vergleichbaren Bedingungen verbessert hat. <a href="https://developers.google.com/search/docs/appearance/core-web-vitals?hl=de" target="_blank" rel="noopener noreferrer">Richtwerte von Google ↗</a></p>
        </section>
        <section className="rf-section rf-wrap" id="ablauf"><div className="rf-section-heading rf-reveal"><div><p className="rf-eyebrow">03 / Zusammenarbeit</p><h2>So läuft<br /><em>das ab.</em></h2></div><p>Für den Anfang brauche ich nur den Link zu Ihrer Website.<br />Alles Weitere klären wir per E-Mail.</p></div><div className="rf-steps">{[["01", "Sie schicken den Link.", "Eine E-Mail mit Ihrer bisherigen Website reicht für den Start. Wir klären kurz, was bleiben soll und was Sie stört."],["02", "Ich zeige eine Vorschau.", "Wenn der Umfang passt, bekommen Sie einen unverbindlichen Gestaltungsvorschlag. Erst anschauen, dann entscheiden."],["03", "Ich setze die Website um.", "Nach Ihrer Beauftragung setzen wir den Refresh um. Eine gemeinsame Korrekturrunde ist enthalten."],["04", "Ihre Website geht live.", "Wir stimmen den Wechsel ab. Anschließend übernehme ich Hosting und technische Betreuung."]].map(([n,title,text]) => <article className="rf-step rf-reveal" key={n}><span>{n}</span><h3>{title}</h3><p>{text}</p></article>)}</div></section>
        <section className="rf-wrap rf-price-section" id="preis"><div className="rf-price-panel rf-reveal"><div><p className="rf-eyebrow">04 / Kosten</p><h2>Was kostet<br /><em>die Überarbeitung?</em></h2><p>Für kleine Unternehmenswebsites mit vorhandenen Inhalten und bis zu fünf Seiten.</p><a className="rf-button rf-button-light" href={MAIL}>Passt das zu meiner Website? <Arrow /></a></div><div className="rf-price-details"><div className="rf-price"><span>Website überarbeiten</span><strong>249 <small>€</small></strong><span>einmalig, netto</span></div><div className="rf-price rf-price-month"><span>Hosting & technische Betreuung</span><strong>49 <small>€ / Monat</small></strong><span>netto, zzgl. gesetzlicher Umsatzsteuer</span></div><ul>{["Bis zu fünf Seiten mit Ihren vorhandenen Inhalten", "Modernes Design für Handy, Tablet und Desktop", "Eine Korrekturrunde vor dem Livegang", "Hosting, SSL, Backups und technische Pflege"].map(x=><li key={x}><Check /> {x}</li>)}</ul><p className="rf-price-small">Zusätzliche Seiten, Funktionen und spätere Inhaltsänderungen erhalten vorab einen eigenen Festpreis. Vertragslaufzeit und Wechselbedingungen vereinbaren wir im schriftlichen Angebot.</p></div></div></section>
        <section className="rf-section rf-wrap rf-about" id="felix"><div className="rf-about-photo rf-reveal"><Image src="/fun/ski.jpeg" width={560} height={700} sizes="(max-width: 760px) 80vw, 300px" alt="Felix beim Skifahren im Tiefschnee" /><span>Felix, abseits des Bildschirms.</span></div><div className="rf-about-copy rf-reveal"><p className="rf-eyebrow">05 / Über mich</p><h2>Ich bin Felix.<br /><em>Ihr Ansprechpartner.</em></h2><p>Ich entwickle Websites und Software. In meinem Blog schreibe ich über meine Projekte, E-Commerce und Automatisierung. Hier biete ich die Überarbeitung kleiner Unternehmenswebsites an.</p><p>Den Entwurf und die technische Umsetzung mache ich selbst. Wenn Sie eine Frage oder einen Änderungswunsch haben, schreiben Sie mir direkt.</p><div className="rf-about-links"><a href={MAIL} className="rf-text-link">felix@becker.so <Arrow /></a><Link href="/blog" className="rf-text-link">Zu meinen Projekten und Artikeln <Arrow /></Link></div></div></section>
        <section className="rf-section rf-wrap rf-faq"><div className="rf-reveal"><p className="rf-eyebrow">06 / Häufige Fragen</p><h2>Was Sie vielleicht<br /><em>noch wissen möchten.</em></h2></div><div className="rf-faq-list">{[["Muss ich neue Texte und Bilder liefern?", "In der Regel nicht. Wir verwenden Ihre vorhandenen Inhalte, soweit Sie die nötigen Nutzungsrechte haben. Falls etwas fehlt oder veraltet ist, klären wir das kurz per E-Mail."],["Bleiben meine Domain und E-Mail-Adressen?", "Ihre Domain kann bleiben. Bestehende E-Mail-Postfächer ziehen wir nicht automatisch um. Vor der Veröffentlichung klären wir genau, was technisch geändert werden muss und was bestehen bleibt."],["Was passiert mit meinen bestehenden Google-Links?", "Wir erfassen wichtige Seitenadressen und erhalten sie, wo es sinnvoll möglich ist. Wenn sich eine URL ändert, planen wir eine passende Weiterleitung. Eine bestimmte Rankingentwicklung kann niemand seriös garantieren."],["Wie lange dauert der Refresh?", "Das hängt vom Umfang und Ihren Rückmeldungen ab. Nach dem ersten Blick auf Ihre Website nenne ich einen realistischen Zeitplan. Den Termin halten wir im Angebot fest."],["Kann ich später etwas ändern lassen?", "Ja. Kleine Text- oder Bildänderungen und größere Erweiterungen bekommen vorab einen klaren Festpreis. Die monatliche Betreuung umfasst den technischen Betrieb, keine unbegrenzten Inhaltsänderungen."],["Ist ein Telefonat nötig?", "Nein. Anfrage, Abstimmung und Freigabe können komplett per E-Mail laufen. Wenn Sie lieber sprechen möchten, finden wir natürlich auch dafür einen Weg."],["Sind die gezeigten Websites echte Kundenprojekte?", "Die hier gezeigten Reinigungs- und Handwerksseiten sind freie Designkonzepte für fiktive Betriebe. Sie zeigen meine Gestaltungsrichtung und sind ausdrücklich keine Kundenreferenzen."],["Ist meine Website für das Paket geeignet?", "Das Paket passt zu überschaubaren Unternehmenswebsites mit bis zu fünf Seiten und vorhandenen Inhalten. Shops, komplexe Buchungssysteme und größere individuelle Funktionen benötigen ein eigenes Angebot."]].map(([q,a])=><details key={q} className="rf-reveal"><summary>{q}<span aria-hidden="true">+</span></summary><p>{a}</p></details>)}</div></section>
        <section className="rf-final"><div className="rf-wrap rf-reveal"><p className="rf-eyebrow">Ihre Website überarbeiten lassen</p><h2>Schicken Sie mir<br /><em>Ihre Website.</em></h2><p>Schicken Sie mir einfach den Link zu Ihrer Website.<br />Ich schaue sie mir an und sage Ihnen, was ich verbessern würde.</p><a className="rf-button" href={MAIL}>Website zeigen <Arrow /></a><span className="rf-final-mail">Oder direkt: <a href="mailto:felix@becker.so">felix@becker.so</a></span></div></section>
      </main>
      <footer className="rf-footer rf-wrap"><Link href="/" className="rf-footer-brand">Felix Becker<span>Webdesign & Entwicklung.</span></Link><div><Link href="/blog">Persönlicher Blog</Link><a href="mailto:felix@becker.so">Kontakt</a><a href="https://github.com/tfbecker" target="_blank" rel="noopener noreferrer">GitHub ↗</a><span>© {new Date().getFullYear()} Felix Becker</span></div><p>Konzeptfoto: <a href="https://unsplash.com/photos/window-cleaners-work-on-a-modern-glass-building-SBdgqsJfS7I" target="_blank" rel="noopener noreferrer">Unsplash</a>. Gezeigte Branchenbeispiele sind freie Designkonzepte.</p></footer>
    </div>
  )
}
