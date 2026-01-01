import { Post } from "@/lib/posts"
import { PostList } from "./post-list"

interface EngineeringSectionProps {
  posts: Post[]
}

// Floating Coin Component
const FloatingCoin = ({ left, top, delay }: { left: string; top: string; delay: number }) => (
  <div
    className="absolute w-5 h-6 coin pointer-events-none opacity-70"
    style={{ left, top, animationDelay: `${delay}s` }}
  />
)

// 1-UP Mushroom Component
const OneUpMushroom = ({ left, top }: { left: string; top: string }) => (
  <div
    className="absolute text-2xl mushroom-bounce pointer-events-none"
    style={{ left, top }}
  >
    🍄
  </div>
)

export function EngineeringSection({ posts }: EngineeringSectionProps) {
  const thoughts = posts.filter((post) => post.type === 'thought')
  const projects = posts.filter((post) => post.type === 'project')
  const rougherThoughts = posts.filter((post) => post.type === 'rougher-thought')

  return (
    <section className="relative min-h-screen overflow-x-hidden">
      {/* Brick Pattern Header - mobile optimized */}
      <div className="brick-pattern sticky top-0 z-10 px-4 py-3 md:py-6 md:px-16">
        <div className="flex items-center gap-3 md:gap-4">
          <div className="question-block w-10 h-10 md:w-20 md:h-20 text-sm md:text-3xl flex-shrink-0" />
          <div>
            <h2 className="font-pixel text-[10px] md:text-2xl text-white drop-shadow-[1px_1px_0_rgba(0,0,0,0.5)] md:drop-shadow-[2px_2px_0_rgba(0,0,0,0.5)]">
              WORLD 1-1
            </h2>
            <p className="font-pixel text-[8px] md:text-sm text-mario-gold mt-0.5 md:mt-1">
              Tinkering
            </p>
          </div>
        </div>
      </div>

      {/* Sky background content area */}
      <div
        className="px-4 md:px-16 py-6 md:py-12 relative"
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

        {/* Floating coins decoration */}
        <div className="hidden md:block">
          <FloatingCoin left="85%" top="10%" delay={0} />
          <FloatingCoin left="90%" top="30%" delay={0.5} />
          <FloatingCoin left="88%" top="50%" delay={1} />
          <OneUpMushroom left="92%" top="70%" />
        </div>

        <PostList thoughts={thoughts} projects={projects} rougherThoughts={rougherThoughts} />
      </div>

      {/* Ground pattern at bottom with Goombas */}
      <div className="ground-pattern h-8 relative">
        {/* Walking Goombas */}
        <span className="absolute bottom-full left-[20%] text-2xl goomba-walk">🍄</span>
        <span className="absolute bottom-full left-[60%] text-2xl goomba-walk" style={{ animationDelay: '1s' }}>🍄</span>
        {/* Super Star */}
        <span className="absolute bottom-full right-[10%] text-2xl super-star">⭐</span>
      </div>
    </section>
  )
}
