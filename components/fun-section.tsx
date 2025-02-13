"use client"

import Image from 'next/image'

interface FunCard {
  category: string
  title: string
  description: string
  media?: {
    type: 'image' | 'video'
    src: string
  }
}

const funCards: FunCard[] = [
  {
    category: "HOBBY",
    title: "Skiing",
    description:
      "I learned skiing quite young and till this day its my favorite hobby.",
    media: {
      type: 'image',
      src: '/fun/ski.jpeg'
    }
  },
  {
    category: "HOBBY", 
    title: "Kite-Surfing",
    description:
      "My friends don't belief me that i can surf because i always leave for a vacation to go surfing but then i have no pictures to show for it (pretty hard to hold a handle bar, balance on a board and to take a video...) My 2024 goal was to be able to surf independently and to do turns. I also convinced a friendly guy on the beach to take a video of me! Yay",
    media: {
      type: 'video',
      src: '/fun/surf.mp4'
    }
  },
  {
    category: "HOBBY",
    title: "Junk Journaling",
    description: "Have not started this one yet but i really want to try it!",
  },
]

export function FunSection() {
  return (
    <section className="relative min-h-screen bg-white pt-24">
      <div className="sticky top-0 flex items-baseline gap-4 bg-white px-16 py-8 z-10">
        <h2 className="font-meursault text-8xl">03</h2>
        <p className="font-meursault text-2xl">Fun</p>
      </div>

      <div className="px-16">
        <div className="flex flex-col md:flex-row gap-12">
          <div className="w-full md:w-1/4">
            <div className="rounded-lg bg-gray-100 p-6">
              <p className="text-sm">This is not fleshed out yet - until i find time to add more stuff you can watch some YT favs of mine and cool photos from my brother&apos;s camera roll</p>
            </div>
          </div>
          <div className="flex-1">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
              {funCards.map((card, index) => (
                <div key={index} className="space-y-4">
                  <p className="text-xs font-medium text-gray-500">{card.category}</p>
                  <h3 className="font-meursault text-2xl">{card.title}</h3>
                  <p className="text-sm text-gray-600">{card.description}</p>
                  {card.media && (
                    <div className="relative w-full h-64 rounded-lg overflow-hidden">
                      {card.media.type === 'image' ? (
                        <Image
                          src={card.media.src}
                          alt={card.title}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <video 
                          src={card.media.src}
                          className="w-full h-full object-cover"
                          controls
                        />
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
