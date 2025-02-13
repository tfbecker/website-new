"use client"

interface FunCard {
  category: string
  title: string
  description: string
}

const funCards: FunCard[] = [
  {
    category: "HOBBY",
    title: "Beekeeping",
    description:
      "I grew up on a blueberry farm and spent a lot of time in the field. I learned how to beekeep and livestreamed a run wearing 621-shirts to fund equipment",
  },
  {
    category: "HOBBY",
    title: "Writing",
    description:
      "Sometimes I will overanalyze things and people like to read it. My friend says that I was 'cursed with the ability to write for the internet'",
  },
  {
    category: "SHENANIGAN",
    title: "Mehran's Steakhouse",
    description: "The best first NYT mention",
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
        <div className="mb-12 rounded-lg bg-gray-100 p-6 max-w-md">
          <p className="text-sm">What&apos;s life without a bit of whimsy!</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {funCards.map((card, index) => (
            <div key={index} className="space-y-4">
              <p className="text-xs font-medium text-gray-500">{card.category}</p>
              <h3 className="font-meursault text-2xl">{card.title}</h3>
              <p className="text-sm text-gray-600">{card.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

