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
    { type: 'POWER-UPS', posts: thoughts, icon: '🍄', iconClass: 'mushroom-bounce' },
    { type: 'WARP ZONES', posts: rougherThoughts, icon: '⭐', iconClass: 'powerup-icon' },
    { type: 'BOSS BATTLES', posts: projects, icon: '🔥', iconClass: 'fire-flower' }
  ].filter(section => section.posts.length > 0)

  return (
    <div className={hideContent ? "" : "flex flex-col md:flex-row gap-6 md:gap-12"}>
      <div className={hideContent ? "w-full" : "w-full md:w-1/4"}>
        <div className="space-y-8 md:space-y-12">
          {sections.map(({ type, posts, icon, iconClass }) => (
            <div key={type} className="mario-card p-4">
              <h3 className="mb-3 md:mb-4 font-pixel text-xs text-mario-red flex items-center gap-2">
                <span className={iconClass}>{icon}</span>{type}
              </h3>
              <ul className="space-y-1 md:space-y-1">
                {posts.map((post) => (
                  <li key={post.id}>
                    <button
                      className="group flex w-full items-center min-h-[44px] py-2 px-2 text-left active:bg-mario-gold/30 hover:bg-mario-gold/20 active:text-mario-red hover:text-mario-red border-2 border-transparent active:border-mario-gold hover:border-mario-gold transition-colors text-xs md:text-sm rounded"
                      onMouseEnter={() => !hideContent && setActivePost(post)}
                      onClick={() => router.push(`/posts/${post.id}`)}
                    >
                      <span className="shrink-0 max-w-[18ch] md:max-w-[24ch] text-mario-brown font-medium leading-tight">{post.title}</span>
                      <span className="flex-grow mx-1 md:mx-1.5 border-b-2 border-dotted border-mario-brown/30 group-hover:border-mario-gold group-active:border-mario-gold"></span>
                      {post.type === 'project' ? (
                        <span className="flex items-center shrink-0 text-mario-brown/70 group-hover:text-mario-red text-[10px] md:text-xs">
                          {projectLogos[post.title] && (
                            <Image src={projectLogos[post.title]} alt={`${post.title} logo`} width={20} height={20} className="w-4 h-4 mr-1" />
                          )}
                          {post.date.split('-')[0]}
                        </span>
                      ) : (
                        <span className="shrink-0 text-mario-brown/70 group-hover:text-mario-red text-[10px]">
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
            <div className="bg-white/95 backdrop-blur p-6 md:p-8 border-4 border-mario-pipe shadow-pixel-lg">
              <h3 className="font-pixel text-lg md:text-xl text-mario-red mb-4">{activePost.title}</h3>
              <div
                className="mt-4 text-base text-mario-brown prose prose-lg max-w-none prose-headings:font-pixel prose-headings:text-mario-red prose-a:text-mario-blue"
                dangerouslySetInnerHTML={{ __html: activePost.content }}
                suppressHydrationWarning
              />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {allPosts.map((post) => (
                <Link key={post.id} href={`/posts/${post.id}`}>
                  <div className="question-block !after:content-none p-4 cursor-pointer hover:scale-[1.02] transition-transform min-h-[120px]">
                    <div className="bg-white/90 p-3 h-full">
                      <h3 className="font-pixel text-xs text-mario-brown mb-2">{post.title}</h3>
                      <div
                        className="text-xs text-mario-brown/80 line-clamp-3"
                        dangerouslySetInnerHTML={{ __html: post.summary }}
                        suppressHydrationWarning
                      />
                    </div>
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
