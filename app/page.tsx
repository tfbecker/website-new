import type { Metadata } from "next"
import { Footer, Nav } from "@/components/paper/chrome"
import { Hero } from "@/components/paper/hero"
import { Features, Fun, Photos, Projects, RoughThoughts, Shelf } from "@/components/paper/sections"
import { WritingList, postHref } from "@/components/paper/writing"
import { getAllPosts } from "@/lib/posts"
import { getReadingContent } from "@/lib/reading"

export const metadata: Metadata = {
  title: { absolute: "Felix Becker: Thoughts on AI, Automation & Building" },
  description: "Writing about AI productivity, automation and building software. Personal blog of Felix Becker.",
  alternates: { canonical: "https://becker.so" },
  openGraph: { title: "Felix Becker: Thoughts on AI, Automation & Building", description: "Writing about AI productivity, automation and building software.", locale: "en_US", url: "https://becker.so" },
}

export default async function Page() {
  const posts = await getAllPosts()
  const reading = await getReadingContent()
  const writing = posts.filter((p) => p.type !== "project")
  const essays = writing.filter((p) => p.type !== "rougher-thought")
  const rough = writing.filter((p) => p.type === "rougher-thought")
  const projects = posts.filter((p) => p.type === "project")

  return (
    <>
      <Nav />
      <main className="p-page">
        <Hero latestHref={writing[0] ? postHref(writing[0]) : "#writing"} />
        <WritingList posts={essays} />
        <RoughThoughts posts={rough} />
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
