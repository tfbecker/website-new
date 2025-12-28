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
    <section className="relative min-h-screen bg-white overflow-x-hidden">
      <div className="sticky top-0 flex items-baseline gap-4 bg-white px-6 py-4 md:py-6 md:px-16 z-10">
        <h2 className="text-6xl md:text-8xl font-serif">00</h2>
        <p className="text-xl md:text-2xl font-serif">Tinkering</p>
      </div>

      <div className="px-6 md:px-16">
        <PostList thoughts={thoughts} projects={projects} rougherThoughts={rougherThoughts} />
      </div>
    </section>
  )
}

