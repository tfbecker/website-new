import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

export interface ReadingContent {
  title: string;
  books: {
    title: string;
    cover: string;
    rating: number;
    review: string;
  }[];
}

export async function getReadingContent(): Promise<ReadingContent> {
  const fullPath = path.join(process.cwd(), 'content', 'reading.md');
  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const matterResult = matter(fileContents);
  return matterResult.data as ReadingContent;
} 