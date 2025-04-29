"use client";

import { useRef } from "react";
import { useScreenSize } from "@/components/hooks/use-screen-size"
import { PixelTrail } from "@/components/ui/pixel-trail"

const Header: React.FC = () => {
  const screenSize = useScreenSize()
  const isMobile = screenSize.lessThan('md')
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div 
      ref={containerRef}
      className="relative w-full h-full min-h-[300px] md:min-h-[500px] bg-[#dcddd7] text-black flex flex-col font-calendas"
    >
      <div className="absolute inset-0 z-0">
        <PixelTrail
          pixelSize={isMobile ? 40 : 80}
          fadeDuration={0}
          delay={1200}
          pixelClassName="rounded-full bg-[#ffa04f]"
          enableAutoAnimation={true}
        />
      </div>

      <div className="justify-center items-center flex flex-col w-full h-full z-10 pointer-events-none space-y-2 md:space-y-8 pt-8 md:pt-24 pb-8 md:pb-20">
        <h2 className="text-3xl cursor-pointer sm:text-5xl md:text-7xl tracking-tight">
          Hi ✽ I&apos;m Felix{" "}
        </h2>
        <div className="text-xs md:text-xl max-w-3xl text-center px-4 sm:px-8 md:px-12">
          Currently: Vibe coding and automating mundane tasks in eCommerce. <br /> <br /> Before: Associate at Heartcore Capital, where I focused on deep tech areas (think: dev tooling, infrastructure, and robotics) - eg. <a href="https://quesma.com/" target="_blank" rel="noopener noreferrer" className="pointer-events-auto">Quesma</a> (Google Translate for databases) and <a href="https://www.flex.ai/" target="_blank" rel="noopener noreferrer" className="pointer-events-auto">FlexAI</a>. <br />
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
          </p>
        </div>
      </div>
    </div>
  )
}

export { Header }