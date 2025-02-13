import { getReadingContent } from "@/lib/reading"
import ReadingContentFilter from "@/components/reading-content-filter"

export default async function ReadingSection() {
  const reading = await getReadingContent()

  return (
    <section className="relative min-h-screen bg-white pt-24">
      <div className="sticky top-0 flex items-baseline gap-4 bg-white px-6 py-8 md:px-16 z-10">
        <h2 className="text-6xl md:text-8xl font-serif">01</h2>
        <p className="text-xl md:text-2xl font-serif">Reading</p>
      </div>
      <ReadingContentFilter books={reading.books} />
    </section>
  )
} 