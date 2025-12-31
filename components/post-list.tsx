'use client'

import { useState } from "react"
import { useRouter } from 'next/navigation'
import { Post } from "@/lib/posts"
import Link from 'next/link'
import Image from 'next/image'

interface PostListProps {
  thoughts: Post[]
  projects: Post[]
  rougherThoughts?: Post[]
  hideContent?: boolean
}
const projectLogos: { [key: string]: string } = {
  "Scraping Infra Tutorial": "/logos/windmill-dev.svg",
  "VC Sourcing Engine Pt2": "/logos/heartcore-capital.png",
  "Thesis on Cursor Movements": "/logos/frankfurt-school.png",
  "Adaptive Pricing Engine for FMCG": "/logos/flaschenpost.png",
  "VC Sourcing Engine": "/logos/globalfounderscapital.png",
  "Polymarket Arbitrage Bot": "/logos/polymarket.ico",
  "AI Recruiting Bot": "/logos/li.avif",
  "Memecoin Trader": "/logos/pump.webp",
  "Bundesanzeiger Bot": "/logos/ba-cropped.svg",
  "Vocab App": "/logos/vocab.svg"
};

export function PostList({ thoughts, projects, rougherThoughts = [], hideContent = false }: PostListProps) {
  const [activePost, setActivePost] = useState<Post | null>(null)
  const allPosts = [...thoughts, ...projects, ...rougherThoughts]
  const router = useRouter()

  const sections = [
    { type: 'THOUGHTS', posts: thoughts },
    { type: 'ROUGHER THOUGHTS', posts: rougherThoughts },
    { type: 'PROJECTS', posts: projects }
  ].filter(section => section.posts.length > 0)

  return (
    <div className={hideContent ? "" : "flex flex-col md:flex-row gap-6 md:gap-12"}>
      <div className={hideContent ? "w-full" : "w-full md:w-1/4"}>
        <div className="space-y-8 md:space-y-12">
          {sections.map(({ type, posts }) => (
            <div key={type}>
              <h3 className="mb-3 md:mb-4 text-xs font-medium text-gray-500">{type}</h3>
              <ul className="space-y-0.5 md:space-y-1">
                {posts.map((post) => (
                  <li key={post.id}>
                    <button
                      className="group flex w-full items-start py-0.5 text-left hover:text-blue-600 text-xs md:text-sm"
                      onMouseEnter={() => !hideContent && setActivePost(post)}
                      onClick={() => router.push(`/posts/${post.id}`)}
                    >
                      <span className="shrink-0 max-w-[24ch]">{post.title}</span>
                      <span className="flex-grow mx-1.5 border-b border-dotted border-gray-300 group-hover:border-blue-400 mt-[0.65em]"></span>
                      {post.type === 'project' ? (
                        <span className="flex items-center shrink-0 text-gray-400 group-hover:text-blue-600">
                          {projectLogos[post.title] && (
                            <Image src={projectLogos[post.title]} alt={`${post.title} logo`} width={20} height={20} className="w-4 h-4 md:w-5 md:h-5 mr-1" />
                          )}
                          {post.date.split('-')[0]}
                        </span>
                      ) : (
                        <span className="shrink-0 text-gray-400 group-hover:text-blue-600">
                          {post.type === 'thought' || post.type === 'rougher-thought' ? post.date.split('-').slice(0, 2).join('-') : post.date}
                        </span>
                      )}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {!hideContent && (
        <div className="hidden md:block flex-1">
          {activePost ? (
            <div className="w-full p-8">
              <h3 className="text-3xl font-serif">{activePost.title}</h3>
              <div
                className="mt-4 text-lg text-gray-600 prose prose-lg max-w-none"
                dangerouslySetInnerHTML={{ __html: activePost.content }}
                suppressHydrationWarning
              />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {allPosts.map((post) => (
                <Link key={post.id} href={`/posts/${post.id}`}>
                  <div className="space-y-4 cursor-pointer">
                    <h3 className="text-2xl font-serif">{post.title}</h3>
                    <div
                      className="text-lg text-gray-600 prose prose-lg"
                      dangerouslySetInnerHTML={{ __html: post.summary }}
                      suppressHydrationWarning
                    />
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
