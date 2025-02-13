'use client'

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Post } from "@/lib/posts"

interface PostListProps {
  thoughts: Post[]
  projects: Post[]
}

export function PostList({ thoughts, projects }: PostListProps) {
  const [activePost, setActivePost] = useState<Post | null>(null)
  const allPosts = [...thoughts, ...projects]

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
                      onMouseLeave={() => setActivePost(null)}
                    >
                      <span>{post.title}</span>
                      <span className="text-gray-400 group-hover:text-blue-600">{post.date}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="flex-1">
        <div className="hidden md:grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {allPosts.map((post) => (
            <div key={post.id} className="space-y-4">
              <h3 className="text-2xl font-serif">{post.title}</h3>
              <div 
                className="text-sm text-gray-600 prose prose-sm"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />
            </div>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {activePost && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="fixed left-64 top-0 h-screen w-96 border-r border-gray-200 bg-white p-8 overflow-y-auto"
          >
            <h3 className="mb-4 font-serif text-xl">{activePost.title}</h3>
            <div 
              className="prose prose-sm"
              dangerouslySetInnerHTML={{ __html: activePost.content.split('\n')[0] }} 
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
} 