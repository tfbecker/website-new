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
      {/* Grass World Header - mobile optimized */}
      <div className="brick-pattern sticky top-0 z-10 px-4 py-3 md:py-6 md:px-16">
        <div className="flex items-center gap-3 md:gap-4">
          <div className="question-block w-10 h-10 md:w-20 md:h-20 text-sm md:text-3xl flex-shrink-0" />
          <div>
            <h2 className="font-pixel text-[10px] md:text-2xl text-white drop-shadow-[1px_1px_0_rgba(0,0,0,0.5)]">
              BONUS STAGE
            </h2>
            <p className="font-pixel text-[8px] md:text-sm text-mario-gold mt-0.5 md:mt-1">
              Fun
            </p>
          </div>
        </div>
      </div>

      <div className="px-4 md:px-16 py-6 md:py-8 relative">
        {/* Floating decorations */}
        <div className="hidden md:block">
          <span className="absolute top-12 right-[15%] text-3xl super-star">⭐</span>
          <span className="absolute top-24 left-[10%] text-2xl mushroom-bounce">🍄</span>
          <span className="absolute bottom-32 right-[5%] text-2xl fireball">🔥</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {funCards.map((card, index) => (
            <div key={index} className="mario-card p-6 space-y-4 relative overflow-hidden group">
              {/* Category badge */}
              <div className="inline-block bg-mario-red px-3 py-1 border-2 border-red-800">
                <p className="font-pixel text-[8px] md:text-xs text-white">{card.category}</p>
              </div>
              <h3 className="font-pixel text-sm md:text-base text-mario-brown">{card.title}</h3>
              <p className="text-sm text-mario-brown/80">{card.description}</p>
              {card.media && (
                <div className="relative w-full h-64 border-4 border-mario-pipe overflow-hidden shadow-pixel">
                  {card.media.type === 'image' ? (
                    <Image
                      src={card.media.src}
                      alt={card.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
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
              {/* Power-up icon in corner */}
              <div className="absolute -bottom-2 -right-2 text-4xl opacity-20 group-hover:opacity-40 transition-opacity">
                {index === 0 ? '🏔️' : '🌊'}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Ground at bottom */}
      <div className="ground-pattern h-8" />
    </section>
  )
}
