import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { remark } from 'remark'
import html from 'remark-html'

export interface Post {
  id: string
  title: string
  date: string
  type: 'thought' | 'project'
  content: string
  summary: string
}

const postsDirectory = path.join(process.cwd(), 'content/posts')

export async function getAllPosts(): Promise<Post[]> {
  const thoughts = await getPostsByType('thoughts')
  const projects = await getPostsByType('projects')
  return [...thoughts, ...projects].sort((a, b) => (a.date < b.date ? 1 : -1))
}

export async function getPostsByType(type: 'thoughts' | 'projects'): Promise<Post[]> {
  const typeDirectory = path.join(postsDirectory, type)
  const fileNames = fs.readdirSync(typeDirectory)

  const allPosts = await Promise.all(
    fileNames.map(async (fileName) => {
      const id = fileName.replace(/\.md$/, '')
      const fullPath = path.join(typeDirectory, fileName)
      const fileContents = fs.readFileSync(fullPath, 'utf8')

      const matterResult = matter(fileContents)
      // Process content with remark but preserve HTML
      const processedContent = await remark()
        .use(html, { sanitize: false })
        .process(matterResult.content)
      const content = processedContent.toString()
      const endParagraphIndex = content.indexOf('</p>')
      const summary = endParagraphIndex !== -1 ? content.substring(0, endParagraphIndex + 4) : content.substring(0, 150) + '...'

      const post: Post = {
        id,
        type: type === 'thoughts' ? 'thought' : 'project',
        content,
        summary,
        ...(matterResult.data as { title: string; date: string }),
      }
      return post
    })
  )

  return allPosts.sort((a, b) => (a.date < b.date ? 1 : -1))
}

export async function getPostById(id: string): Promise<Post | null> {
  const types = ['thoughts', 'projects']
  for (const type of types) {
    const postsDirectory = path.join(process.cwd(), 'content', 'posts', type)
    const filePath = path.join(postsDirectory, `${id}.md`)
    if (fs.existsSync(filePath)) {
      const fileContents = fs.readFileSync(filePath, 'utf8')
      const matterResult = matter(fileContents)
      // Process content with remark but preserve HTML
      const processedContent = await remark()
        .use(html, { sanitize: false })
        .process(matterResult.content)
      const content = processedContent.toString()
      const endParagraphIndex = content.indexOf('</p>')
      const summary = endParagraphIndex !== -1 ? content.substring(0, endParagraphIndex + 4) : content.substring(0, 150) + '...'
      const post: Post = {
        id,
        type: type === 'thoughts' ? 'thought' : 'project',
        content,
        summary,
        ...(matterResult.data as { title: string; date: string }),
      }
      return post
    }
  }
  return null
} 