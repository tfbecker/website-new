"use client"

import { useEffect } from "react"
import { usePathname } from "next/navigation"

// All the small motion on the paper design lives here, driven by data attributes in the
// server-rendered markup. Nothing here is needed to read the page: without JS (or with
// reduced motion) every element simply shows in its final state.

const $$ = <T extends Element = HTMLElement>(sel: string, root: ParentNode = document) =>
  [...root.querySelectorAll<T>(sel)] as T[]
const clamp = (v: number, lo = 0, hi = 1) => Math.max(lo, Math.min(hi, v))

// Section tints for the two blurred blobs behind the page.
const TINTS: Record<string, [string, string]> = {
  sun: ["rgba(240, 160, 90, .55)", "rgba(240, 196, 106, .42)"],
  peach: ["rgba(242, 160, 128, .50)", "rgba(240, 196, 106, .40)"],
  night: ["rgba(40, 70, 160, .55)", "rgba(232, 118, 43, .30)"],
  sage: ["rgba(150, 190, 132, .55)", "rgba(240, 196, 106, .35)"],
  lilac: ["rgba(170, 150, 230, .50)", "rgba(242, 160, 128, .38)"],
  blue: ["rgba(90, 140, 230, .48)", "rgba(150, 190, 132, .38)"],
  sky: ["rgba(120, 170, 230, .50)", "rgba(220, 230, 245, .45)"],
  dusk: ["rgba(150, 140, 190, .50)", "rgba(242, 160, 128, .38)"],
}

const GREETINGS: Record<string, string> = {
  de: "hallo", en: "hi", es: "hola", fr: "salut", it: "ciao", pt: "olá", nl: "hoi",
  sv: "hej", da: "hej", no: "hei", fi: "moi", pl: "cześć", tr: "merhaba", ko: "안녕",
}
const FLOATERS = ["hallo", "servus", "moin", "hi", "hola", "ciao", "salut", "hej", "grüezi", "안녕", "hoi", "olá"]
const STATUS = [
  { from: 0, to: 6, line: "definitely asleep" },
  { from: 6, to: 9, line: "coffee, then claude code" },
  { from: 9, to: 12, line: "probably in a meeting" },
  { from: 12, to: 13, line: "lunch, hopefully" },
  { from: 13, to: 18, line: "shipping something" },
  { from: 18, to: 22, line: "writing, or tinkering" },
  { from: 22, to: 24, line: "should be asleep" },
]
const PEEK_LINES = ["you made it to the end.", "still here? nice.", "that's all. danke!", "ok, now go outside :)"]

export function PaperEffects() {
  const pathname = usePathname()

  useEffect(() => {
    const root = document.documentElement
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches
    const cleanups: (() => void)[] = []
    const on = <K extends keyof WindowEventMap>(t: K, fn: (e: WindowEventMap[K]) => void, opts?: AddEventListenerOptions) => {
      window.addEventListener(t, fn, opts)
      cleanups.push(() => window.removeEventListener(t, fn))
    }

    // ── toast ────────────────────────────────────────────────────────────────
    let toast: HTMLDivElement | null = null
    let toastTimer: number | undefined
    const showToast = (text: string) => {
      if (!toast) {
        toast = document.createElement("div")
        toast.className = "p-toast"
        toast.setAttribute("role", "status")
        document.body.appendChild(toast)
      }
      toast.textContent = text
      toast.classList.add("is-on")
      window.clearTimeout(toastTimer)
      toastTimer = window.setTimeout(() => toast?.classList.remove("is-on"), 2200)
    }
    cleanups.push(() => { window.clearTimeout(toastTimer); toast?.remove() })

    // ── theme toggle ─────────────────────────────────────────────────────────
    const currentTheme = () =>
      root.dataset.theme || (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light")
    $$("[data-theme-toggle]").forEach((btn) => {
      const click = () => {
        const next = currentTheme() === "dark" ? "light" : "dark"
        root.dataset.theme = next
        try { localStorage.setItem("p-theme", next) } catch {}
        btn.classList.toggle("is-turning")
      }
      btn.addEventListener("click", click)
      cleanups.push(() => btn.removeEventListener("click", click))
    })

    // ── reveal on scroll (fade + rise, drawn underlines) ─────────────────────
    const revealEls = $$(".p-reveal, .p-under:not(.is-static):not(.is-auto), .p-swash:not(.is-static)")
    root.classList.add("fx-ready")
    cleanups.push(() => root.classList.remove("fx-ready"))
    if (reduced || !("IntersectionObserver" in window)) {
      revealEls.forEach((el) => el.classList.add("is-in"))
    } else {
      root.classList.add("js-reveal")
      $$("[data-stagger]").forEach((group) =>
        $$(":scope > .p-reveal", group).forEach((el, i) =>
          el.style.setProperty("--delay", `${i * (Number(group.dataset.stagger) || 70)}ms`)))
      const io = new IntersectionObserver((entries) => entries.forEach((e) => {
        if (e.isIntersecting) { e.target.classList.add("is-in"); io.unobserve(e.target) }
      }), { rootMargin: "0px 0px -8% 0px", threshold: 0.12 })
      revealEls.forEach((el) => io.observe(el))
      cleanups.push(() => io.disconnect())
    }

    // ── ambient blobs: tint follows the section in view, drift follows the scroll ──
    const tinted = $$("[data-tint]")
    const setTint = (name?: string) => {
      const t = name ? TINTS[name] : undefined
      if (!t) return
      root.style.setProperty("--amb-1", t[0])
      root.style.setProperty("--amb-2", t[1])
    }
    if (tinted[0]) setTint(tinted[0].dataset.tint)
    if (tinted.length && "IntersectionObserver" in window) {
      const io = new IntersectionObserver((entries) => entries.forEach((e) => {
        if (e.isIntersecting) setTint((e.target as HTMLElement).dataset.tint)
      }), { rootMargin: "-40% 0px -55% 0px" })
      tinted.forEach((el) => io.observe(el))
      cleanups.push(() => io.disconnect())
    }

    // ── scroll-driven scenes ─────────────────────────────────────────────────
    // [data-scroll]: --p = 0 when the element enters at the bottom, 1 when it leaves at the top;
    //                --q = the same, remapped with data-start/data-gain (the "story" progress).
    // [data-draw]:   every path inside is drawn as its box scrolls up into view.
    // [data-ride]:   one route (.ride-path) is drawn with the scroll, .ride-tip rides its end,
    //                stations with data-at light up once the tip has passed them.
    // [data-count]:  a number that counts with --q of its scene.
    const scenes = $$("[data-scroll], [data-drift], [data-spin]")
    scenes.forEach((el) => {
      if (el.dataset.drift) el.style.setProperty("--drift", el.dataset.drift)
      if (el.dataset.spin) el.style.setProperty("--spin", el.dataset.spin)
    })
    const drawSets = $$("[data-draw]").map((el) => ({
      el,
      paths: $$<SVGGeometryElement>("path, line, polyline, circle[data-draw-line]", el)
        .filter((p) => !p.closest("defs, [data-draw-skip]"))
        .map((p) => {
          let len = 1200
          try { len = p.getTotalLength() || len } catch {}
          p.style.strokeDasharray = `${len}`
          p.style.strokeDashoffset = `${len}`
          return { p, len }
        }),
    }))
    const rides = $$("[data-ride]").map((el) => {
      const path = el.querySelector<SVGPathElement>(".ride-path")
      const len = path ? path.getTotalLength() : 0
      const traces = $$<SVGPathElement>(".ride-trace", el)
      traces.forEach((t) => { t.style.strokeDasharray = `${len}`; t.style.strokeDashoffset = `${len}` })
      return { el, path, len, traces, tip: el.querySelector<SVGGElement>(".ride-tip"), stations: $$("[data-at]", el) }
    })
    const walker = document.querySelector<HTMLElement>(".p-walker")
    let lastY = window.scrollY
    let idle: number | undefined

    if (reduced) {
      // final states, no motion
      scenes.forEach((el) => { el.style.setProperty("--p", "0.5"); el.style.setProperty("--q", "1") })
      drawSets.forEach(({ paths }) => paths.forEach(({ p }) => (p.style.strokeDashoffset = "0")))
      rides.forEach(({ traces, tip, path, len, stations }) => {
        traces.forEach((t) => (t.style.strokeDashoffset = "0"))
        if (tip && path) { const pt = path.getPointAtLength(len); tip.setAttribute("transform", `translate(${pt.x} ${pt.y})`) }
        stations.forEach((s) => s.classList.add("is-hit"))
      })
      $$("[data-count]").forEach((c) => (c.textContent = `${c.dataset.max ?? "100"}${c.dataset.suffix ?? ""}`))
    } else {
      root.classList.add("js-draw")
      let ticking = false
      const update = () => {
        ticking = false
        const vh = window.innerHeight
        for (const el of scenes) {
          const r = el.getBoundingClientRect()
          if (r.bottom < -vh || r.top > vh * 2) continue
          const p = clamp((vh - r.top) / (vh + r.height))
          el.style.setProperty("--p", p.toFixed(3))
          const q = clamp((p - Number(el.dataset.start ?? 0.25)) * Number(el.dataset.gain ?? 2.2))
          el.style.setProperty("--q", q.toFixed(3))
          $$("[data-count]", el).forEach((c) => {
            const min = Number(c.dataset.min ?? 0), max = Number(c.dataset.max ?? 100)
            c.textContent = `${Math.round(min + (max - min) * q)}${c.dataset.suffix ?? ""}`
          })
        }
        for (const { el, paths } of drawSets) {
          const r = el.getBoundingClientRect()
          const a = clamp((vh * 0.9 - r.top) / (vh * 0.45 + r.height * 0.5))
          for (const { p, len } of paths) p.style.strokeDashoffset = `${len * (1 - a)}`
          el.style.setProperty("--done", a > 0.97 ? "1" : "0")
        }
        for (const { el, path, len, traces, tip, stations } of rides) {
          if (!path) continue
          const r = el.getBoundingClientRect()
          const q = clamp((vh * 0.95 - r.top) / (vh * 0.8))
          traces.forEach((t) => (t.style.strokeDashoffset = `${len * (1 - q)}`))
          if (tip) {
            const pt = path.getPointAtLength(Math.max(0.01, q) * len)
            tip.setAttribute("transform", `translate(${pt.x.toFixed(1)} ${pt.y.toFixed(1)})`)
          }
          stations.forEach((s) => s.classList.toggle("is-hit", q >= Number(s.dataset.at)))
        }
        if (walker) {
          const y = window.scrollY
          if (y !== lastY) walker.classList.toggle("is-back", y < lastY)
          lastY = y
          walker.classList.add("is-moving")
          window.clearTimeout(idle)
          idle = window.setTimeout(() => walker.classList.remove("is-moving"), 180)
        }
        const max = root.scrollHeight - vh
        root.style.setProperty("--amb-sp", (max > 0 ? window.scrollY / max : 0).toFixed(3))
      }
      const schedule = () => { if (!ticking) { ticking = true; requestAnimationFrame(update) } }
      on("scroll", schedule, { passive: true })
      on("resize", schedule)
      update()
      walker?.classList.remove("is-moving")
      cleanups.push(() => window.clearTimeout(idle))
      on("beforeprint", () => {
        drawSets.forEach(({ paths }) => paths.forEach(({ p }) => (p.style.strokeDashoffset = "0")))
        rides.forEach(({ traces }) => traces.forEach((t) => (t.style.strokeDashoffset = "0")))
      })
    }

    // ── reading progress on posts ────────────────────────────────────────────
    const bar = document.querySelector<HTMLElement>("[data-progress]")
    const article = document.querySelector<HTMLElement>("[data-article]")
    if (bar && article) {
      const tick = () => {
        const r = article.getBoundingClientRect()
        const q = clamp(-r.top / Math.max(1, r.height - window.innerHeight))
        bar.style.setProperty("--read", q.toFixed(4))
        bar.classList.toggle("is-done", q > 0.995)
      }
      on("scroll", tick, { passive: true })
      tick()
    }

    // ── cursor-following preview on list rows ────────────────────────────────
    const previewRows = $$("[data-preview-src], [data-preview-title]")
    if (previewRows.length && !matchMedia("(hover: none)").matches) {
      const card = document.createElement("div")
      card.className = "p-preview"
      card.setAttribute("aria-hidden", "true")
      document.body.appendChild(card)
      let x = 0, y = 0, tx = 0, ty = 0
      let raf = 0
      const loop = () => {
        x += (tx - x) * 0.18
        y += (ty - y) * 0.18
        card.style.transform = `translate(${x + 24}px, ${y - 130}px)`
        raf = requestAnimationFrame(loop)
      }
      previewRows.forEach((row) => {
        const enter = (e: MouseEvent) => {
          const src = row.dataset.previewSrc
          card.innerHTML = ""
          if (src) {
            const img = document.createElement("img")
            img.src = src
            img.alt = ""
            card.appendChild(img)
          } else {
            const ph = document.createElement("div")
            ph.className = "p-ph"
            ph.dataset.tone = row.dataset.previewTone || "sun"
            ph.textContent = row.dataset.previewTitle || ""
            card.appendChild(ph)
          }
          tx = x = e.clientX
          ty = y = e.clientY
          card.classList.add("is-on")
          if (reduced) card.style.transform = `translate(${tx + 24}px, ${ty - 130}px)`
          else if (!raf) loop()
        }
        const move = (e: MouseEvent) => {
          tx = e.clientX
          ty = e.clientY
          if (reduced) card.style.transform = `translate(${tx + 24}px, ${ty - 130}px)`
        }
        const leave = () => { card.classList.remove("is-on"); cancelAnimationFrame(raf); raf = 0 }
        row.addEventListener("mouseenter", enter)
        row.addEventListener("mousemove", move)
        row.addEventListener("mouseleave", leave)
        cleanups.push(() => {
          row.removeEventListener("mouseenter", enter)
          row.removeEventListener("mousemove", move)
          row.removeEventListener("mouseleave", leave)
        })
      })
      cleanups.push(() => { cancelAnimationFrame(raf); card.remove() })
    }

    // ── polaroid flip ────────────────────────────────────────────────────────
    $$(".p-flip-card").forEach((btn) => {
      const back = btn.querySelector(".p-flip-back")
      const click = () => {
        const turned = btn.getAttribute("aria-pressed") !== "true"
        btn.setAttribute("aria-pressed", String(turned))
        btn.setAttribute("aria-label", turned ? "turn the photo back" : "turn the photo over")
        back?.setAttribute("aria-hidden", String(!turned))
      }
      btn.addEventListener("click", click)
      cleanups.push(() => btn.removeEventListener("click", click))
    })

    // ── book shelf: the note card shows whichever book you point at ─────────
    $$("[data-shelf]").forEach((shelf) => {
      const books = $$("[data-book]", shelf)
      const notes = $$("[data-note]", shelf)
      const box = shelf.querySelector<HTMLElement>("[data-notes]")
      const show = (i: string) => {
        books.forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.book === i)))
        notes.forEach((n) => { n.hidden = n.dataset.note !== i })
        // slide the note card under the chosen book, kept inside the shelf
        const book = books.find((b) => b.dataset.book === i)
        if (box && book) {
          const wrap = shelf.getBoundingClientRect(), r = book.getBoundingClientRect()
          const x = r.left + r.width / 2 - wrap.left - box.offsetWidth / 2
          box.style.setProperty("--note-x", `${clamp(x, 0, Math.max(0, wrap.width - box.offsetWidth)).toFixed(0)}px`)
          box.style.setProperty("--tip-x", `${(r.left + r.width / 2 - wrap.left).toFixed(0)}px`)
        }
      }
      const active = books.find((b) => b.getAttribute("aria-pressed") === "true")
      if (active) requestAnimationFrame(() => show(active.dataset.book!))
      books.forEach((b) => {
        const fn = () => show(b.dataset.book!)
        b.addEventListener("mouseenter", fn)
        b.addEventListener("focus", fn)
        b.addEventListener("click", fn)
        cleanups.push(() => {
          b.removeEventListener("mouseenter", fn)
          b.removeEventListener("focus", fn)
          b.removeEventListener("click", fn)
        })
      })
    })

    // ── lightbox for photos and the surf video ───────────────────────────────
    const boxLinks = $$<HTMLAnchorElement>("[data-lightbox]")
    if (boxLinks.length) {
      const dlg = document.createElement("dialog")
      dlg.className = "p-lightbox"
      document.body.appendChild(dlg)
      const close = () => dlg.close()
      dlg.addEventListener("click", close)
      dlg.addEventListener("close", () => (dlg.innerHTML = ""))
      boxLinks.forEach((a) => {
        const click = (e: MouseEvent) => {
          if (e.metaKey || e.ctrlKey) return
          e.preventDefault()
          dlg.innerHTML = ""
          if (a.dataset.lightbox === "video") {
            const v = document.createElement("video")
            v.src = a.href
            v.controls = true
            v.autoplay = true
            v.playsInline = true
            if (a.dataset.poster) v.poster = a.dataset.poster
            v.addEventListener("click", (ev) => ev.stopPropagation())
            dlg.appendChild(v)
          } else {
            const img = document.createElement("img")
            img.src = a.dataset.full || a.href
            img.alt = a.getAttribute("aria-label") || ""
            dlg.appendChild(img)
          }
          const hint = document.createElement("p")
          hint.textContent = "click anywhere or press esc to close"
          dlg.appendChild(hint)
          dlg.showModal()
        }
        a.addEventListener("click", click)
        cleanups.push(() => a.removeEventListener("click", click))
      })
      cleanups.push(() => dlg.remove())
    }

    // ── email: assembled in the browser, copied on click ────────────────────
    $$<HTMLAnchorElement>("[data-email]").forEach((a) => {
      const addr = [a.dataset.user, "becker.so"].join(String.fromCharCode(64))
      a.href = `mailto:${addr}`
      const click = () => {
        navigator.clipboard?.writeText(addr).then(() => showToast(`copied ${addr}`), () => {})
      }
      a.addEventListener("click", click)
      cleanups.push(() => a.removeEventListener("click", click))
    })

    // ── "hallo · 14:32 in frankfurt · probably in a meeting" ────────────────
    const hellos = $$("[data-hello]")
    if (hellos.length) {
      const paint = () => {
        const now = new Date()
        const time = now.toLocaleTimeString("en-GB", { timeZone: "Europe/Berlin", hour: "2-digit", minute: "2-digit" })
        const hour = Number(now.toLocaleString("en-GB", { timeZone: "Europe/Berlin", hour: "2-digit", hour12: false })) % 24
        const greet = GREETINGS[(navigator.language || "de").slice(0, 2).toLowerCase()] ?? "hallo"
        const status = STATUS.find((s) => hour >= s.from && hour < s.to)?.line ?? ""
        hellos.forEach((h) => {
          h.classList.toggle("is-night", hour < 7 || hour >= 20)
          const t = h.querySelector(".t")
          if (t) t.textContent = `${greet} · ${time} in frankfurt · ${status}`
        })
      }
      paint()
      const id = window.setInterval(paint, 20000)
      cleanups.push(() => window.clearInterval(id))
    }

    // ── the robot peeks up when you reach the footer (once per visit) ───────
    const peek = document.querySelector<HTMLElement>("[data-peek]")
    const footer = document.querySelector(".p-footer")
    let seen = false
    try { seen = !!sessionStorage.getItem("p-peeked") } catch {}
    if (peek && footer && !seen && "IntersectionObserver" in window) {
      const line = peek.querySelector("[data-peek-line]")
      const timers: number[] = []
      const leave = () => {
        peek.classList.add("is-leaving")
        timers.push(window.setTimeout(() => peek.classList.remove("is-on", "is-leaving"), 500))
      }
      const io = new IntersectionObserver((entries, obs) => {
        if (!entries.some((e) => e.isIntersecting)) return
        obs.disconnect()
        try { sessionStorage.setItem("p-peeked", "1") } catch {}
        if (line) line.textContent = PEEK_LINES[Math.floor(Math.random() * PEEK_LINES.length)]
        timers.push(window.setTimeout(() => peek.classList.add("is-on"), 400))
        timers.push(window.setTimeout(leave, 5600))
      }, { threshold: 0.6 })
      io.observe(footer)
      peek.addEventListener("click", leave)
      cleanups.push(() => { io.disconnect(); timers.forEach((t) => window.clearTimeout(t)); peek.removeEventListener("click", leave) })
    }

    // ── easter egg: type "hallo" anywhere ────────────────────────────────────
    let typed = ""
    on("keydown", (e) => {
      const target = e.target as HTMLElement | null
      if (target?.closest("input, textarea, [contenteditable]") || e.metaKey || e.ctrlKey || e.key.length !== 1) return
      typed = (typed + e.key.toLowerCase()).slice(-5)
      if (typed !== "hallo") return
      typed = ""
      if (reduced) { showToast("hallo :)"); return }
      FLOATERS.forEach((word, i) => {
        const s = document.createElement("span")
        s.className = "p-float" + (i % 3 === 1 ? " is-accent" : "")
        s.textContent = word
        s.style.left = `${4 + Math.random() * 84}vw`
        s.style.setProperty("--r", `${(Math.random() * 16 - 8).toFixed(1)}deg`)
        s.style.setProperty("--h", `${60 + Math.random() * 45}vh`)
        s.style.animationDelay = `${i * 90}ms`
        document.body.appendChild(s)
        window.setTimeout(() => s.remove(), 3000 + i * 90)
      })
    })

    return () => cleanups.forEach((fn) => fn())
  }, [pathname])

  useEffect(() => {
    console.log(
      "%challo, curious one. this page is hand-made with next.js, paper grain and a lot of svg. the code: github.com/tfbecker/website-new · type “hallo” somewhere.",
      "font: italic 14px Georgia, serif; padding: 6px 0;",
    )
  }, [])

  return null
}
