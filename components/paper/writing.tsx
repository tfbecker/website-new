import Link from "next/link"
import type { Post } from "@/lib/posts"
import { Robot } from "./stickers"

// Interactive explainers live outside /posts; their markdown stub only keeps them in the lists.
export const POST_HREF: Record<string, string> = { "raptor-full-flow": "/raptor" }
export const postHref = (p: Post) => POST_HREF[p.id] ?? `/posts/${p.id}`

// Hover previews: a real image where a post has one, otherwise a tinted card with the title.
const PREVIEW_IMG: Record<string, string> = {
  "raptor-full-flow": "/raptor/og.png",
  "ralph-wiggum-kills-process-mining": "/fun/ralph-wiggum.webp",
}
const TONES = ["sun", "sage", "lilac", "peach", "blue"]

export function kindOf(p: Post) {
  if (POST_HREF[p.id]) return "interactive"
  if (p.type === "rougher-thought") return "rough thought"
  if (p.type === "project") return "project"
  return "essay"
}

export function WritingList({ posts, heading = "latest writing", id = "writing", walker = true }: {
  posts: Post[]
  heading?: string
  id?: string
  walker?: boolean
}) {
  return (
    <section className="p-wrap p-section" id={id} data-tint="peach">
      <div className="p-section-head">
        <h2 className="p-h2 p-reveal">{heading}</h2>
        <a className="p-link p-mono-link" href="/feed.xml">rss →</a>
      </div>
      <div className="p-list-scene" data-scroll data-start="0.2" data-gain="1.8">
        {walker && (
          <div className="p-trail" aria-hidden="true">
            <span className="p-walker"><Robot label="" /></span>
          </div>
        )}
        <ol className="p-rows" data-stagger="45">
          {posts.map((p, i) => (
            <li key={p.id} className="p-reveal">
              <Link
                href={postHref(p)}
                className="p-row"
                data-preview-src={PREVIEW_IMG[p.id]}
                data-preview-title={PREVIEW_IMG[p.id] ? undefined : p.title.toLowerCase()}
                data-preview-tone={TONES[i % TONES.length]}
              >
                <span className="p-row-year">{p.date.slice(0, 4)}</span>
                <span className="p-row-title">{p.title.toLowerCase()}</span>
                <span className="p-row-kind">{kindOf(p)}</span>
              </Link>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
