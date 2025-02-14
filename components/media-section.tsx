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
    <section className="relative min-h-screen bg-white pt-24">
      <div className="sticky top-0 flex items-baseline gap-4 bg-white px-6 py-16 md:px-16 z-10">
        <h2 className="text-6xl md:text-8xl font-serif">02</h2>
        <p className="text-xl md:text-2xl font-serif">Media</p>
      </div>

      <div className="px-6 md:px-16">
        <div className="flex flex-col md:flex-row gap-12">
          <div className="w-full md:w-1/4">
            <div className="rounded-lg bg-gray-100 p-6">
              <p className="text-sm">This is not fleshed out yet - until i find time to add more stuff you can watch some YT favs of mine and cool photos from my brother&apos;s camera roll</p>
            </div>
          </div>
          <div className="flex-1 space-y-12">
            {/* Video Section with Side Text */}
            <div className="flex flex-col lg:flex-row gap-8">
              <div className="lg:w-[66%]">
                <div className="w-full aspect-video rounded-lg overflow-hidden">
                  <iframe
                    className="w-full h-full"
                    src={mediaContent.videoUrl}
                    title={mediaContent.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
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
                className="mt-4 inline-flex items-center text-blue-600 hover:underline"
                onClick={() => setShowMore(!showMore)}
              >
                {showMore ? 'Show less ▲' : 'Show more ▼'}
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
