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
      <div className="rf-after" style={{ clipPath: `inset(0 ${100-position}% 0 0)` }} aria-hidden="true"><div className="rf-after-nav"><b>klarwerk✳</b><span>Leistungen &nbsp; Über uns &nbsp; Kontakt ↗</span></div><div className="rf-after-copy"><span>RÄUME. IN GUTEN HÄNDEN.</span><h3>Saubere Räume.<br /><em>Gutes Gefühl.</em></h3><p>Büro, Glas und Treppenhaus.<br />Professionelle Reinigung, persönlich abgestimmt.</p><i>Unverbindlich anfragen ↗</i></div><div className="rf-after-photo" /><div className="rf-after-bottom"><span>01 &nbsp; Büroreinigung</span><span>02 &nbsp; Glasreinigung</span><span>03 &nbsp; Treppenhaus</span></div></div>
      <div className="rf-compare-line" style={{ left: `${position}%` }}><span>↔</span></div>
      <span className="rf-compare-badge rf-badge-after">Frisch gedacht</span><span className="rf-compare-badge rf-badge-before">Bisherige Gestaltung</span>
      <input aria-label="Vorher-/Nachher-Vergleich verschieben" aria-valuetext={`${position} Prozent der neuen Gestaltung sichtbar`} type="range" min="0" max="100" value={position} onChange={e => setPosition(Number(e.target.value))} />
    </div>
    <div className="rf-compare-controls"><button type="button" onClick={()=>setPosition(0)} aria-pressed={position===0}>Vorher</button><span>Regler ziehen oder Pfeiltasten nutzen</span><button type="button" onClick={()=>setPosition(100)} aria-pressed={position===100}>Nachher</button></div>
  </div>
}
