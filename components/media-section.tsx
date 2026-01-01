"use client"

import { useState } from 'react';
import Image from 'next/image'

interface MediaContent {
  type: "video" | "image"
  title: string
  category: string
  description: string
  videoUrl?: string
  images?: string[]
}

const mediaContent: MediaContent = {
  type: "video",
  category: "FILM",
  title: "Keith Rabois – How to Operate",
  description: "This one is timeless and I don't know how many times I need to watch it to apply it myself.",
  videoUrl: "https://www.youtube.com/embed/6fQHLK1aIBs",
  images: [
    "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-01-21%20at%2008.43.12-XhssN4kiwzyGUKin6ESQtBFTSwodbY.png",
    "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-01-21%20at%2008.43.12-XhssN4kiwzyGUKin6ESQtBFTSwodbY.png",
    "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-01-21%20at%2008.43.12-XhssN4kiwzyGUKin6ESQtBFTSwodbY.png",
    "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-01-21%20at%2008.43.12-XhssN4kiwzyGUKin6ESQtBFTSwodbY.png",
    "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-01-21%20at%2008.43.12-XhssN4kiwzyGUKin6ESQtBFTSwodbY.png",
    "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-01-21%20at%2008.43.12-XhssN4kiwzyGUKin6ESQtBFTSwodbY.png",
    "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-01-21%20at%2008.43.12-XhssN4kiwzyGUKin6ESQtBFTSwodbY.png",
    "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-01-21%20at%2008.43.12-XhssN4kiwzyGUKin6ESQtBFTSwodbY.png",
    "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-01-21%20at%2008.43.12-XhssN4kiwzyGUKin6ESQtBFTSwodbY.png",
  ],
}

// Define the list of images from public/portfolio using actual files
const images = [
  "/portfolio/5Q7A3475.JPG",
  "/portfolio/5Q7A3619.JPG",
  "/portfolio/5Q7A6486.JPG",
  "/portfolio/5Q7A6697.JPG",
  "/portfolio/5Q7A7389.JPG",
  "/portfolio/5Q7A7516.JPG",
  "/portfolio/5Q7A7925.JPG",
  "/portfolio/5Q7A9196.JPG",
  "/portfolio/5Q7A9269.JPG",
  "/portfolio/5Q7A9962-2.JPG",
  "/portfolio/_W4A0409.JPG",
  "/portfolio/_W4A7071.JPG",
  "/portfolio/_W4A8758.JPG",
  "/portfolio/_W4A9678-Bearbeitet.JPG",
];

export function MediaSection() {
  const [showMore, setShowMore] = useState(false);
  const IMAGE_COUNT = 6;

  return (
    <section className="relative min-h-screen" style={{ background: 'linear-gradient(180deg, #ffd9a0 0%, #ffcc80 100%)' }}>
      {/* Desert World Header - mobile optimized */}
      <div className="brick-pattern sticky top-0 z-10 px-4 py-3 md:py-6 md:px-16">
        <div className="flex items-center gap-3 md:gap-4">
          <div className="question-block w-10 h-10 md:w-20 md:h-20 text-sm md:text-3xl flex-shrink-0" />
          <div>
            <h2 className="font-pixel text-[10px] md:text-2xl text-white drop-shadow-[1px_1px_0_rgba(0,0,0,0.5)]">
              WORLD 2-1
            </h2>
            <p className="font-pixel text-[8px] md:text-sm text-mario-gold mt-0.5 md:mt-1">
              Media
            </p>
          </div>
        </div>
      </div>

      <div className="px-4 md:px-16 py-6 md:py-8 relative">
        {/* Desert decorations */}
        <div className="hidden md:block">
          <span className="absolute top-8 right-[10%] text-2xl goomba-walk" style={{ transform: 'scaleX(-1)' }}>🏜️</span>
          <span className="absolute top-16 left-[5%] text-3xl float-animation">☀️</span>
        </div>

        <div className="space-y-12">
            {/* Video Section with Side Text */}
            <div className="flex flex-col lg:flex-row gap-8">
              <div className="lg:w-[66%]">
                <div className="w-full aspect-video overflow-hidden border-4 border-mario-brown shadow-pixel">
                  <iframe
                    className="w-full h-full"
                    src={mediaContent.videoUrl}
                    title={mediaContent.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              </div>
              <div className="lg:w-[34%] mario-card p-4 space-y-4">
                <div className="inline-block bg-mario-blue px-3 py-1 border-2 border-blue-800">
                  <p className="font-pixel text-[8px] md:text-xs text-white">{mediaContent.category}</p>
                </div>
                <h3 className="font-pixel text-sm md:text-base text-mario-brown">{mediaContent.title}</h3>
                <p className="text-sm text-mario-brown/80">{mediaContent.description}</p>
              </div>
            </div>

            {/* Portfolio Images Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {(showMore ? images : images.slice(0, IMAGE_COUNT)).map((image, index) => (
                <div key={index} className="border-4 border-mario-pipe overflow-hidden shadow-pixel hover:scale-[1.02] transition-transform">
                  <Image
                    src={image}
                    alt={`Portfolio image ${index + 1}`}
                    width={600}
                    height={400}
                    className="object-contain"
                  />
                </div>
              ))}
            </div>
            {/* Toggle Button */}
            {images.length > IMAGE_COUNT && (
              <button
                className="mario-btn px-4 py-2 text-xs"
                onClick={() => setShowMore(!showMore)}
              >
                {showMore ? 'SHOW LESS' : 'SHOW MORE'}
              </button>
            )}
        </div>
      </div>

      {/* Ground at bottom */}
      <div className="ground-pattern h-8" />
    </section>
  )
}
