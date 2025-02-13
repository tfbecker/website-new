import { getReadingContent } from "@/lib/reading"
import ReadingBookList from "@/components/reading-book-list"

export default async function ReadingSection() {
  const reading = await getReadingContent()

  return (
    <section className="relative min-h-screen bg-white pt-24">
      <div className="sticky top-0 flex items-baseline gap-4 bg-white px-6 py-8 md:px-16 z-10">
        <h2 className="text-6xl md:text-8xl font-serif">01</h2>
        <p className="text-xl md:text-2xl font-serif">Reading</p>
      </div>
      <div className="px-6 md:px-16 flex flex-col md:flex-row">
         <div className="w-full md:w-1/4">
            <div className="mb-12 rounded-lg bg-gray-100 p-6">
              <p className="text-sm">
                This section contains my reading journal with cover images, star ratings, and short reviews. Hover or click on a review to see the full text.
              </p>
            </div>
         </div>
         <div className="w-full md:w-3/4">
           <ReadingBookList books={reading.books} />
         </div>
      </div>
    </section>
  )
} 