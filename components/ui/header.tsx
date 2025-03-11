"use client";

import { useScreenSize } from "@/components/hooks/use-screen-size"
import { PixelTrail } from "@/components/ui/pixel-trail"

const Header: React.FC = () => {
  const screenSize = useScreenSize()

  return (
    <div className="relative w-full h-full min-h-[500px] bg-[#dcddd7] text-black flex flex-col font-calendas">
      <div className="absolute inset-0 z-0">
        <PixelTrail
          pixelSize={screenSize.lessThan(`md`) ? 48 : 80}
          fadeDuration={0}
          delay={1200}
          pixelClassName="rounded-full bg-[#ffa04f]"
        />
      </div>

      <div className="justify-center items-center flex flex-col w-full h-full z-10 pointer-events-none space-y-2 md:space-y-8">
        <h2 className="text-3xl cursor-pointer sm:text-5xl md:text-7xl tracking-tight">
          Hi ✽ I&apos;m Felix{" "}
        </h2>
        <div className="text-xs md:text-xl max-w-3xl text-center px-4 sm:px-8 md:px-12">
          Currently working on automating eCommerce operations with LLMs. <br /> <br /> Before, I worked as an Associate at Heartcore Capital, where I focused on deep tech areas (think: dev tooling, infrastructure, and robotics) — shoutout to Quesma (Google Translate for databases) and FlexAI (Nvidia CUDA for Intel and AMD chips). <br /> <br /> Before that, I worked with the founders of Flaschenpost on launching the e-grocery business. <br /> <br /> I learned some PHP, JS, and Ruby in school, and after taking a detour in Finance, I am to improving my skills on the weekends.
        </div>
      </div>

      <div className="absolute bottom-4 w-full px-4 flex justify-between items-end z-10">
        {/* Mobile tip - only shows on small screens */}
        <div className="sm:hidden">
          <p className="text-[10px] text-gray-500 animate-pulse">
            press anywhere to see something cool
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
          </p>
        </div>
      </div>
    </div>
  )
}

export { Header }