import { Post } from "@/lib/posts"
import { PostList } from "./post-list"

interface EngineeringSectionProps {
  posts: Post[]
}

export function EngineeringSection({ posts }: EngineeringSectionProps) {
  const thoughts = posts.filter((post) => post.type === 'thought')
  const projects = posts.filter((post) => post.type === 'project')

  return (
    <section className="relative min-h-screen bg-white pt-24">
      <div className="sticky top-0 flex items-baseline gap-4 bg-white px-6 py-8 md:px-16 z-10">
        <h2 className="text-6xl md:text-8xl font-serif">00</h2>
        <p className="text-xl md:text-2xl font-serif">Tinkering</p>
      </div>

      <div className="px-6 md:px-16">
        <div className="mb-12 rounded-lg bg-gray-100 p-6 max-w-md">
          <p className="text-sm">
            I particularly enjoy prototyping strange ideas quickly!
          </p>
        </div>

        <PostList thoughts={thoughts} projects={projects} />
      </div>
    </section>
  )
}

