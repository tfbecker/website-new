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
    <section className="relative min-h-screen bg-white pt-24 overflow-x-hidden">
      <div className="sticky top-0 flex items-baseline gap-4 bg-white px-6 py-8 md:px-16 z-10">
        <h2 className="text-6xl md:text-8xl font-serif">00</h2>
        <p className="text-xl md:text-2xl font-serif">Tinkering</p>
      </div>

      <div className="px-6 md:px-16">
        <div className="mb-12 rounded-lg bg-gray-100 p-6 max-w-md">
          <p className="text-sm">
          I am driven by bursts of energy. Sometimes I don&apos;t get a lot done, but then I get a lot done in a short amount of time. This is especially true when I work with great people.
          </p>
        </div>

        <PostList thoughts={thoughts} projects={projects} rougherThoughts={rougherThoughts} />
      </div>
    </section>
  )
}

