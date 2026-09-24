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

// Images from public/portfolio with their real pixel size, so each placeholder has the right
// aspect ratio and nothing below jumps when a portrait photo loads.
const images = [
  { src: "/portfolio/5Q7A3475.JPG", width: 2303, height: 1536 },
  { src: "/portfolio/5Q7A3619.JPG", width: 2303, height: 1536 },
  { src: "/portfolio/5Q7A6486.JPG", width: 2303, height: 1536 },
  { src: "/portfolio/5Q7A6697.JPG", width: 1536, height: 2303 },
  { src: "/portfolio/5Q7A7389.JPG", width: 1536, height: 2303 },
  { src: "/portfolio/5Q7A7516.JPG", width: 1536, height: 2303 },
  { src: "/portfolio/5Q7A7925.JPG", width: 1536, height: 2303 },
  { src: "/portfolio/5Q7A9196.JPG", width: 1536, height: 2303 },
  { src: "/portfolio/5Q7A9269.JPG", width: 2303, height: 1536 },
  { src: "/portfolio/5Q7A9962-2.JPG", width: 1536, height: 2303 },
  { src: "/portfolio/_W4A0409.JPG", width: 1537, height: 2305 },
  { src: "/portfolio/_W4A7071.JPG", width: 2305, height: 1537 },
  { src: "/portfolio/_W4A8758.JPG", width: 2305, height: 1537 },
  { src: "/portfolio/_W4A9678-Bearbeitet.JPG", width: 2305, height: 1537 },
];

export function MediaSection() {
  const [showMore, setShowMore] = useState(false);
  const [playVideo, setPlayVideo] = useState(false);
  const videoId = mediaContent.videoUrl?.split('/embed/')[1];
  const IMAGE_COUNT = 6;
  
  return (
    <section className="relative min-h-screen bg-white">
      <div className="sticky top-0 flex items-baseline gap-4 bg-white px-6 py-4 md:py-6 md:px-16 z-10">
        <h2 className="text-6xl md:text-8xl font-serif">02</h2>
        <p className="text-xl md:text-2xl font-serif">Media</p>
      </div>

      <div className="px-6 md:px-16">
        <div className="space-y-12">
            {/* Video Section with Side Text */}
            <div className="flex flex-col lg:flex-row gap-8">
              <div className="lg:w-[66%]">
                <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-black">
                  {/* The YouTube player is ~1 MB of script; load it only when someone presses play. */}
                  {playVideo ? (
                    <iframe
                      className="w-full h-full"
                      src={`${mediaContent.videoUrl}?autoplay=1`}
                      title={mediaContent.title}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  ) : (
                    <button
                      type="button"
                      onClick={() => setPlayVideo(true)}
                      aria-label={`Play video: ${mediaContent.title}`}
                      className="group absolute inset-0 w-full h-full"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={`https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`}
                        alt=""
                        loading="lazy"
                        decoding="async"
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                      <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center w-16 h-11 rounded-xl bg-[#ff0033] opacity-90 group-hover:opacity-100 transition-opacity">
                        <svg viewBox="0 0 24 24" className="w-6 h-6 fill-white" aria-hidden="true"><path d="M8 5v14l11-7z" /></svg>
                      </span>
                    </button>
                  )}
                </div>
              </div>
              <div className="lg:w-[34%] space-y-4">
                <p className="text-xs font-medium text-gray-500">{mediaContent.category}</p>
                <h3 className="text-3xl font-serif">{mediaContent.title}</h3>
                <p className="text-sm text-gray-600">{mediaContent.description}</p>
              </div>
            </div>

            {/* Portfolio Images Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {(showMore ? images : images.slice(0, IMAGE_COUNT)).map((image, index) => (
                <div key={index}>
                  <Image
                    src={image.src}
                    alt={`Portfolio image ${index + 1}`}
                    width={image.width}
                    height={image.height}
                    sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                    className="w-full h-auto"
                  />
                </div>
              ))}
            </div>
            {/* Toggle Button */}
            {images.length > IMAGE_COUNT && (
              <button
                className="mt-4 inline-flex items-center text-blue-600 hover:underline"
                onClick={() => setShowMore(!showMore)}
              >
                {showMore ? 'Show less ▲' : 'Show more ▼'}
              </button>
            )}
        </div>
      </div>
    </section>
  )
}
