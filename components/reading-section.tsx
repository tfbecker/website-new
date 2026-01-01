import { getReadingContent } from "@/lib/reading"
import ReadingContentFilter from "@/components/reading-content-filter"

export default async function ReadingSection() {
  const reading = await getReadingContent()

  return (
    <section className="relative min-h-screen" style={{ background: 'linear-gradient(180deg, #b0e0e6 0%, #98d1d1 100%)' }}>
      {/* Underwater/Castle World Header - mobile optimized */}
      <div className="brick-pattern sticky top-0 z-10 px-4 py-3 md:py-6 md:px-16">
        <div className="flex items-center gap-3 md:gap-4">
          <div className="question-block w-10 h-10 md:w-20 md:h-20 text-sm md:text-3xl flex-shrink-0" />
          <div>
            <h2 className="font-pixel text-[10px] md:text-2xl text-white drop-shadow-[1px_1px_0_rgba(0,0,0,0.5)]">
              WORLD 1-2
            </h2>
            <p className="font-pixel text-[8px] md:text-sm text-mario-gold mt-0.5 md:mt-1">
              Reading
            </p>
          </div>
        </div>
      </div>

      <div className="px-4 md:px-16 py-6 md:py-8">
        <ReadingContentFilter books={reading.books} />
      </div>

      {/* Ground at bottom */}
      <div className="ground-pattern h-8" />
    </section>
  )
}
