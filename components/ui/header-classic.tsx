"use client";

import { useRef, useState, useMemo, useEffect } from "react";
import dynamic from "next/dynamic";
import { useScreenSize } from "@/components/hooks/use-screen-size"

// The circles are decoration: their code (framer-motion) loads in its own chunk and
// only after the page has painted. They sit in an absolute layer, so nothing shifts.
const PixelTrail = dynamic(
  () => import("@/components/ui/pixel-trail").then((mod) => mod.PixelTrail),
  { ssr: false }
)

// Mount the trail once the page has loaded and the main thread is idle,
// or after 2.5 s at the latest on slow connections.
function useAfterFirstPaint() {
  const [ready, setReady] = useState(false)
  useEffect(() => {
    let done = false
    let idleId: number | undefined
    const start = () => {
      if (done) return
      done = true
      if ("requestIdleCallback" in window) {
        idleId = window.requestIdleCallback(() => setReady(true), { timeout: 1000 })
      } else {
        setReady(true)
      }
    }
    const fallback = window.setTimeout(start, 2500)
    if (document.readyState === "complete") start()
    else window.addEventListener("load", start, { once: true })
    return () => {
      window.clearTimeout(fallback)
      window.removeEventListener("load", start)
      if (idleId !== undefined) window.cancelIdleCallback(idleId)
    }
  }, [])
  return ready
}

const Header: React.FC = () => {
  const screenSize = useScreenSize()
  const isMobile = screenSize.lessThan('md')
  const containerRef = useRef<HTMLDivElement>(null);
  const [showEmail, setShowEmail] = useState(false);
  const [copied, setCopied] = useState(false);
  const showTrail = useAfterFirstPaint()

  const addr = useMemo(() => {
    const p = [102,101,108,105,120];
    const d = [98,101,99,107,101,114];
    const t = [115,111];
    return p.map(c=>String.fromCharCode(c)).join('') + String.fromCharCode(64) + d.map(c=>String.fromCharCode(c)).join('') + String.fromCharCode(46) + t.map(c=>String.fromCharCode(c)).join('');
  }, []);

  return (
    <div 
      ref={containerRef}
      className="relative w-full h-full min-h-[250px] md:min-h-[500px] bg-[#dcddd7] text-black flex flex-col font-calendas"
    >
      <div className="absolute inset-0 z-0">
        {showTrail && (
          <PixelTrail
            pixelSize={isMobile ? 40 : 80}
            fadeDuration={0}
            delay={1200}
            pixelClassName="rounded-full bg-[#ffa04f]"
            enableAutoAnimation={true}
          />
        )}
      </div>

      <div className="justify-center items-center flex flex-col w-full h-full z-10 pointer-events-none space-y-2 md:space-y-8 pt-8 md:pt-24 pb-8 md:pb-20">
        <h2 className="text-3xl cursor-pointer sm:text-5xl md:text-7xl tracking-tight">
          Hi ✽ I&apos;m Felix{" "}
        </h2>
        <div className="text-xs md:text-xl max-w-3xl text-center px-4 sm:px-8 md:px-12">
          Currently: Vibe coding and scaling an eCommerce company. <br /> <br /> Before: Associate at Heartcore Capital, where I focused on deep tech areas (think: dev tooling, infrastructure, and robotics). <br />
        </div>
      </div>

      <div className="absolute bottom-4 w-full px-4 flex justify-between items-end z-10">
        {/* Mobile tip */}
        <div className="sm:hidden">
          <p className="text-[10px] text-gray-500 animate-pulse">
            tap to control the circles
          </p>
        </div>
        
        <div className="ml-auto">
          <p className="text-xs md:text-base pointer-events-none flex flex-col items-end">
            <a href="https://github.com/tfbecker" target="_blank" rel="noopener noreferrer" className="pointer-events-auto">
              GitHub
            </a>
            <a href="https://www.linkedin.com/in/felix-becker-2ba413140/" target="_blank" rel="noopener noreferrer" className="pointer-events-auto">
              LinkedIn
            </a>
            <a href="https://x.com/fffbecker" target="_blank" rel="noopener noreferrer" className="pointer-events-auto">
              Twitter
            </a>
            <a href="/feed.xml" target="_blank" rel="noopener noreferrer" className="pointer-events-auto">
              RSS
            </a>
            <a href="#" onClick={(e) => { e.preventDefault(); setShowEmail(true); setCopied(false); }} className="pointer-events-auto cursor-pointer">
              Email me
            </a>
          </p>
        </div>
      </div>

      {showEmail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" onClick={() => setShowEmail(false)}>
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
          <div className="relative bg-[#dcddd7] text-black px-8 py-6 shadow-lg max-w-sm w-full mx-4" onClick={e => e.stopPropagation()}>
            <button onClick={() => setShowEmail(false)} className="absolute top-3 right-4 text-xl leading-none hover:opacity-60">&times;</button>
            <p className="text-sm mb-3 font-calendas">Reach me at</p>
            <p className="text-lg md:text-xl font-calendas select-all break-all">{addr}</p>
            <button
              onClick={() => { navigator.clipboard.writeText(addr); setCopied(true); }}
              className="mt-4 text-sm underline underline-offset-2 hover:opacity-60 font-calendas"
            >
              {copied ? "Copied!" : "Copy to clipboard"}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export { Header }