"use client"
import { useEffect, useState } from "react"
export function RefreshEffects() {
  useEffect(() => {
    const elements = document.querySelectorAll(".rf-reveal")
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || !("IntersectionObserver" in window)) return
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add("rf-visible"); observer.unobserve(entry.target) }
    }), { threshold: .1 })
    elements.forEach(el => { el.classList.add("rf-will-reveal"); observer.observe(el) })
    return () => { observer.disconnect(); elements.forEach(el => el.classList.remove("rf-will-reveal")) }
  }, [])
  return null
}
export function Comparison() {
  const [position, setPosition] = useState(58)
  return <div className="rf-compare rf-reveal">
    <div className="rf-browser-top"><span className="rf-dots"><i /><i /><i /></span><span>Ein Betrieb. Zwei Gestaltungsideen.</span><span>Konzept</span></div>
    <div className="rf-compare-stage">
      <div className="rf-before" aria-hidden="true"><div className="rf-before-title">KLARWERK Gebäudereinigung</div><div className="rf-before-nav">Startseite | Über uns | Leistungen | Kontakt</div><div className="rf-before-main"><h3>Herzlich Willkommen auf unserer Homepage!</h3><div className="rf-before-row"><div><h4>Ihr Partner für Sauberkeit</h4><p>Wir bieten Ihnen professionelle Reinigung für Ihr Büro, Ihre Glasflächen und Ihr Treppenhaus.</p><p>Informieren Sie sich auf den folgenden Seiten über unsere Leistungen.</p><u>Zu unseren Leistungen &gt;&gt;</u></div><div className="rf-before-image" /></div><p>+++ Büroreinigung +++ Glasreinigung +++ Treppenhausreinigung +++</p><div className="rf-before-contact">Kontaktieren Sie uns für Ihr persönliches Angebot.</div></div></div>
      <div className="rf-after" style={{ clipPath: `inset(0 ${100-position}% 0 0)` }} aria-hidden="true"><div className="rf-after-nav"><b>KLARWERK ▰</b><span>Leistungen &nbsp; Über uns &nbsp; Kontakt ↗</span></div><div className="rf-after-copy"><span>GEBÄUDEREINIGUNG</span><h3>SAUBER.<br /><em>BIS INS DETAIL.</em></h3><p>Büro, Glas und Treppenhaus.<br />Professionelle Reinigung, persönlich abgestimmt.</p><i>Unverbindlich anfragen ↗</i></div><div className="rf-after-photo" /><div className="rf-after-bottom"><span>01 &nbsp; Büroreinigung</span><span>02 &nbsp; Glasreinigung</span><span>03 &nbsp; Treppenhaus</span></div></div>
      <div className="rf-compare-line" style={{ left: `${position}%` }}><span>↔</span></div>
      <span className="rf-compare-badge rf-badge-after">Frisch gedacht</span><span className="rf-compare-badge rf-badge-before">Bisherige Gestaltung</span>
      <input aria-label="Vorher-/Nachher-Vergleich verschieben" aria-valuetext={`${position} Prozent der neuen Gestaltung sichtbar`} type="range" min="0" max="100" value={position} onChange={e => setPosition(Number(e.target.value))} />
    </div>
    <div className="rf-compare-controls"><button type="button" onClick={()=>setPosition(0)} aria-pressed={position===0}>Vorher</button><span>Regler ziehen oder Pfeiltasten nutzen</span><button type="button" onClick={()=>setPosition(100)} aria-pressed={position===100}>Nachher</button></div>
  </div>
}

/** Illustration only: both mock pages are local DOM, not a network benchmark. */
export function SpeedComparison() {
  const [elapsed, setElapsed] = useState(0)
  const [run, setRun] = useState(0)
  const [started, setStarted] = useState(false)
  const [reduced, setReduced] = useState(false)
  useEffect(() => {
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)")
    const update = () => setReduced(motion.matches)
    update()
    motion.addEventListener("change", update)
    const section = document.querySelector("[data-speed-demo]")
    if (!("IntersectionObserver" in window)) { setStarted(true); return () => motion.removeEventListener("change", update) }
    const observer = new IntersectionObserver(entries => {
      if (entries.some(entry => entry.isIntersecting)) { setStarted(true); observer.disconnect() }
    }, { threshold: .25 })
    if (section) observer.observe(section)
    return () => { motion.removeEventListener("change", update); observer.disconnect() }
  }, [])
  useEffect(() => {
    if (!started || reduced) return
    setElapsed(0)
    const start = performance.now()
    const timer = window.setInterval(() => {
      const time = Math.min(4500, performance.now() - start)
      setElapsed(time)
      if (time >= 4500) window.clearInterval(timer)
    }, 80)
    return () => window.clearInterval(timer)
  }, [started, reduced, run])
  const time = reduced ? 4500 : elapsed
  const finished = time >= 4500
  return <div className="rf-speed-demo" data-speed-demo data-demo-state={finished ? "complete" : "playing"}>
    <div className="rf-speed-toolbar"><span><i aria-hidden="true" /> Gleicher Inhalt. Unterschiedliches Tempo.</span><button type="button" onClick={() => { setElapsed(0); setStarted(true); setRun(value => value + 1) }} disabled={reduced}>Noch einmal <span aria-hidden="true">↻</span></button></div>
    <div className="rf-speed-grid">
      {([{ label: "Langsam", duration: 4500, variant: "slow" }, { label: "Schnell", duration: 800, variant: "fast" }] as const).map(({ label, duration, variant }) => {
        const done = time >= duration
        const progress = Math.min(1, time / duration)
        return <div key={variant} className={`rf-speed-card rf-speed-${variant} ${done ? "is-ready" : "is-loading"}`} data-speed={variant}>
          <div className="rf-speed-card-top"><span>{label}</span><strong>{(Math.min(time, duration) / 1000).toFixed(1).replace(".", ",")} <small>s</small></strong></div>
          <div className="rf-speed-window" aria-hidden="true">
            <div className="rf-speed-chrome"><span /><span /><span /><i>ihr-betrieb.de</i></div>
            <div className="rf-speed-progress"><i style={{ width: `${progress * 100}%` }} /></div>
            <div className="rf-speed-mock">
              <div className="rf-speed-mock-nav"><b>Ihr Betrieb<span>✳</span></b><span>Leistungen &nbsp; Kontakt</span></div>
              <div className="rf-speed-mock-content" style={{ opacity: done ? 1 : .2 }}><span className="rf-speed-mock-eyebrow">FÜR SIE VOR ORT</span><strong>Gute Arbeit.<br /><em>Direkt anfragen.</em></strong><div className="rf-speed-mock-lines"><i /><i /></div><span className="rf-speed-mock-button">Anfrage senden ↗</span><div className="rf-speed-mock-picture"><i /><i /><i /></div></div>
              {!done && <div className="rf-speed-loading"><span className="rf-speed-spinner" /><span>Wird geladen …</span></div>}
            </div>
          </div>
          <p className="rf-speed-result"><span aria-hidden="true">{done ? "✓" : "◷"}</span> {done ? (variant === "fast" ? "Bereit für die erste Anfrage." : "Jetzt erst bereit.") : "Ihr Kunde wartet noch."}</p>
        </div>
      })}
    </div>
    <p className="rf-speed-caption">Animierte Demo: 4,5 s vs. 0,8 s. Keine Messung einer Kundenwebsite.</p>
  </div>
}
