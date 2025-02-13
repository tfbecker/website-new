"use client"

import Image from "next/image";

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
  title: "Unstuck: The Documentary",
  description:
    "A feature length documentary on industrial climate solutions that resonate with conservatives. Ongoing, but first time directing, producing, and editing my own large project! Basically a large research project documented on camera. Now know an abnormal amount about video codecs, permitting, and the ERCOT grid",
  videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
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

// Define the list of images from public/portfolio
const images = [
  "/portfolio/image1.jpg",
  "/portfolio/image2.jpg",
  "/portfolio/image3.jpg",
  "/portfolio/image4.jpg",
  "/portfolio/image5.jpg",
  // Add more images as needed
];

export function MediaSection() {
  return (
    <section className="relative min-h-screen bg-white pt-24">
      <div className="sticky top-0 flex items-baseline gap-4 bg-white px-6 py-8 md:px-16 z-10">
        <h2 className="text-6xl md:text-8xl font-serif">02</h2>
        <p className="text-xl md:text-2xl font-serif">Media</p>
      </div>

      <div className="px-6 md:px-16">
        <div className="mb-12 rounded-lg bg-gray-100 p-6 max-w-md">
          <p className="text-sm">This is not fleshed out yet - until i find time to add more stuff you can watch some YT favs of mine and cool photos from my brother's camera roll</p>
        </div>

        <div className="space-y-12">
          {/* Video Section with Side Text */}
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="lg:w-2/3">
              <div className="aspect-video w-full">
                <iframe
                  className="w-full h-full rounded-lg"
                  src={mediaContent.videoUrl}
                  title={mediaContent.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </div>
            <div className="lg:w-1/3 space-y-4">
              <p className="text-xs font-medium text-gray-500">{mediaContent.category}</p>
              <h3 className="text-4xl font-serif">{mediaContent.title}</h3>
              <p className="text-gray-600">{mediaContent.description}</p>
            </div>
          </div>

          {/* Image Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {mediaContent.images?.map((image, index) => (
              <div key={index} className="aspect-video relative overflow-hidden rounded-lg">
                <img
                  src={image || "/placeholder.svg"}
                  alt={`Behind the scenes ${index + 1}`}
                  className="object-cover w-full h-full"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

