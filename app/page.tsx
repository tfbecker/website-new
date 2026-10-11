import { Footer, Nav } from "@/components/paper/chrome"
import { Hero } from "@/components/paper/hero"
import { Features, Fun, Photos, Projects, Shelf } from "@/components/paper/sections"
import { WritingList, postHref } from "@/components/paper/writing"
import { getAllPosts } from "@/lib/posts"
import { getReadingContent } from "@/lib/reading"

export default async function Page() {
  const posts = await getAllPosts()
  const reading = await getReadingContent()
  const writing = posts.filter((p) => p.type !== "project")
  const projects = posts.filter((p) => p.type === "project")

  return (
    <>
      <Nav />
      <main className="p-page">
        <Hero latestHref={writing[0] ? postHref(writing[0]) : "#writing"} />
        <WritingList posts={writing} />
        <Features />
        <Projects projects={projects} />
        <Photos />
        <Shelf books={reading.books} />
        <Fun />
      </main>
      <Footer />
    </>
  )
}
