import RSS from 'rss';
import { getAllPosts } from '@/lib/posts';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://becker.so';

export async function GET() {
  const feed = new RSS({
    title: "Felix Becker's Blog", // Replace with your site title
    description: "Thoughts and projects by Felix Becker", // Replace with your site description
    feed_url: `${BASE_URL}/feed.xml`,
    site_url: BASE_URL,
    language: 'en', // Optional: Adjust language
    pubDate: new Date(), // Optional: Set publication date
    // Optional: Add image URL
    // image_url: `${BASE_URL}/icon.png`,
  });

  const posts = await getAllPosts();

  posts.forEach(post => {
    feed.item({
      title: post.title,
      description: post.summary, // Use summary or full content
      url: `${BASE_URL}/posts/${post.id}`,
      guid: `${BASE_URL}/posts/${post.id}`, // Unique identifier for the item
      date: new Date(post.date), // Ensure date is a Date object
      // Optional: Add author
      // author: "Your Name",
      // Optional: Add full content if desired
      // custom_elements: [
      //   {'content:encoded': post.content}
      // ]
    });
  });

  const xml = feed.xml({ indent: true });

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
    },
  });
} 