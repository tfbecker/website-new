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
    category: "POWER-UP",
    title: "Skiing",
    description:
      "I learned skiing quite young and till this day its my favorite hobby.",
    media: {
      type: 'image',
      src: '/fun/ski.jpeg'
    }
  },
  {
    category: "STAR MODE",
    title: "Kite-Surfing",
    description:
      "My friends don't belief me that i can surf because i always leave for a vacation to go surfing but then i have no pictures to show for it (pretty hard to hold a handle bar, balance on a board and to take a video...) My 2024 goal was to be able to surf independently and to do turns. I also convinced a friendly guy on the beach to take a video of me! Yay",
    media: {
      type: 'video',
      src: '/fun/surf.mp4'
    }
  },
]

export function FunSection() {
  return (
    <section className="relative min-h-screen" style={{ background: 'linear-gradient(180deg, #98e698 0%, #7bc67b 100%)' }}>
      {/* Grass World Header */}
      <div className="brick-pattern sticky top-0 z-10 px-6 py-4 md:py-6 md:px-16">
        <div className="flex items-baseline gap-4">
          <div className="question-block w-16 h-16 md:w-20 md:h-20 text-2xl md:text-3xl flex-shrink-0" />
          <div>
            <h2 className="font-pixel text-xl md:text-2xl text-white drop-shadow-[2px_2px_0_rgba(0,0,0,0.5)]">
              BONUS STAGE
            </h2>
            <p className="font-pixel text-xs md:text-sm text-mario-gold mt-1">
              Fun
            </p>
          </div>
        </div>
      </div>

      <div className="px-6 md:px-16 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {funCards.map((card, index) => (
            <div key={index} className="bg-white/90 p-6 border-4 border-mario-brown shadow-pixel space-y-4">
              <p className="font-pixel text-xs text-mario-red">{card.category}</p>
              <h3 className="font-pixel text-sm md:text-base text-mario-brown">{card.title}</h3>
              <p className="text-sm text-mario-brown/80">{card.description}</p>
              {card.media && (
                <div className="relative w-full h-64 border-4 border-mario-brown overflow-hidden">
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

      {/* Ground at bottom */}
      <div className="ground-pattern h-8" />
    </section>
  )
}
