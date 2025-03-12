'use client'

import { useState } from "react"
import { useRouter } from 'next/navigation'
import { Post } from "@/lib/posts"
import Link from 'next/link'
import Image from 'next/image'

interface PostListProps {
  thoughts: Post[]
  projects: Post[]
}

const projectLogos: { [key: string]: string } = {
  "Scraping Infra Tutorial": "/logos/windmill-dev.svg",
  "VC Sourcing Engine Pt2": "/logos/heartcore-capital.png",
  "Thesis on Cursor Movements": "/logos/frankfurt-school.png",
  "Adaptive Pricing Engine for FMCG": "/logos/flaschenpost.png",
  "VC Sourcing Engine": "/logos/globalfounderscapital.png"
};

export function PostList({ thoughts, projects }: PostListProps) {
  const [activePost, setActivePost] = useState<Post | null>(null)
  const allPosts = [...thoughts, ...projects]
  const router = useRouter()

  return (
    <div className="flex flex-col md:flex-row gap-12">
      <div className="w-full md:w-1/4">
        <div className="space-y-12">
          {[
            { type: 'THOUGHTS', posts: thoughts },
            { type: 'PROJECTS', posts: projects }
          ].map(({ type, posts }) => (
            <div key={type}>
              <h3 className="mb-4 text-xs font-medium text-gray-500">{type}</h3>
              <ul className="space-y-2">
                {posts.map((post) => (
                  <li key={post.id}>
                    <button
                      className="group flex w-full items-center justify-between py-1 text-left hover:text-blue-600"
                      onMouseEnter={() => setActivePost(post)}
                      onClick={() => router.push(`/posts/${post.id}`)}
                    >
                      <span>{post.title}</span>
                      {post.type === 'project' && projectLogos[post.title] ? (
                        <span className="flex items-center text-gray-400 group-hover:text-blue-600">
                          <Image src={projectLogos[post.title]} alt={`${post.title} logo`} width={24} height={24} className="w-6 h-6 mr-2" />
                          {post.date.split('-')[0]}
                        </span>
                      ) : (
                        <span className="text-gray-400 group-hover:text-blue-600">
                          {post.type === 'thought' ? post.date.split('-').slice(0, 2).join('-') : post.date.split('-')[0]}
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

      <div className="flex-1">
        {activePost ? (
          <div className="w-full p-8">
            <h3 className="text-3xl font-serif">{activePost.title}</h3>
            <div 
              className="mt-4 text-sm text-gray-600 prose prose-sm max-w-none"
              dangerouslySetInnerHTML={{ __html: activePost.content }} 
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {allPosts.map((post) => (
              <Link key={post.id} href={`/posts/${post.id}`}> 
                <div className="space-y-4 cursor-pointer">
                  <h3 className="text-2xl font-serif">{post.title}</h3>
                  <div 
                    className="text-sm text-gray-600 prose prose-sm"
                    dangerouslySetInnerHTML={{ __html: post.summary }}
                  />
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
} 