import { getReadingContent } from "@/lib/reading"
import ReadingContentFilter from "@/components/reading-content-filter"

export default async function ReadingSection() {
  const reading = await getReadingContent()

  return (
    <section className="relative min-h-screen" style={{ background: 'linear-gradient(180deg, #b0e0e6 0%, #98d1d1 100%)' }}>
      {/* Underwater/Castle World Header */}
      <div className="brick-pattern sticky top-0 z-10 px-6 py-4 md:py-6 md:px-16">
        <div className="flex items-baseline gap-4">
          <div className="question-block w-16 h-16 md:w-20 md:h-20 text-2xl md:text-3xl flex-shrink-0" />
          <div>
            <h2 className="font-pixel text-xl md:text-2xl text-white drop-shadow-[2px_2px_0_rgba(0,0,0,0.5)]">
              WORLD 1-2
            </h2>
            <p className="font-pixel text-xs md:text-sm text-mario-gold mt-1">
              Reading
            </p>
          </div>
        </div>
      </div>

      <div className="px-6 md:px-16 py-8">
        <ReadingContentFilter books={reading.books} />
      </div>

      {/* Ground at bottom */}
      <div className="ground-pattern h-8" />
    </section>
  )
}
