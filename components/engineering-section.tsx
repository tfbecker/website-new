import { Post } from "@/lib/posts"
import { PostList } from "./post-list"

interface EngineeringSectionProps {
  posts: Post[]
}

export function EngineeringSection({ posts }: EngineeringSectionProps) {
  const thoughts = posts.filter((post) => post.type === 'thought')
  const projects = posts.filter((post) => post.type === 'project')
  const rougherThoughts = posts.filter((post) => post.type === 'rougher-thought')

  return (
    <section className="relative min-h-screen overflow-x-hidden">
      {/* Brick Pattern Header */}
      <div className="brick-pattern sticky top-0 z-10 px-6 py-4 md:py-6 md:px-16">
        <div className="flex items-baseline gap-4">
          <div className="question-block w-16 h-16 md:w-20 md:h-20 text-2xl md:text-3xl flex-shrink-0" />
          <div>
            <h2 className="font-pixel text-xl md:text-2xl text-white drop-shadow-[2px_2px_0_rgba(0,0,0,0.5)]">
              WORLD 1-1
            </h2>
            <p className="font-pixel text-xs md:text-sm text-mario-gold mt-1">
              Tinkering
            </p>
          </div>
        </div>
      </div>

      {/* Sky background content area */}
      <div
        className="px-6 md:px-16 py-8 md:py-12"
        style={{
          background: 'linear-gradient(180deg, #87ceeb 0%, #b0e0e6 100%)',
        }}
      >
        {/* Decorative clouds in background */}
        <div className="absolute top-32 left-[10%] opacity-50">
          <div className="w-20 h-8 bg-white rounded-full" />
        </div>
        <div className="absolute top-48 right-[15%] opacity-50">
          <div className="w-16 h-6 bg-white rounded-full" />
        </div>

        <PostList thoughts={thoughts} projects={projects} rougherThoughts={rougherThoughts} />
      </div>

      {/* Ground pattern at bottom */}
      <div className="ground-pattern h-8" />
    </section>
  )
}
