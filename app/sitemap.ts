import { MetadataRoute } from 'next'
import { getAllPosts } from '@/lib/posts' // Assuming @ is configured for src path

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://felixbecker.xyz'; // Replace with your actual domain

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await getAllPosts();

  const postEntries: MetadataRoute.Sitemap = posts.map(({ id, date }) => ({
    url: `${BASE_URL}/posts/${id}`,
    lastModified: date, // Assuming date is in 'YYYY-MM-DD' format or compatible
    // changeFrequency: 'weekly', // Optional: Adjust as needed
    // priority: 0.8, // Optional: Adjust as needed
  }));

  return [
    {
      url: BASE_URL,
      lastModified: new Date().toISOString().split('T')[0], // Today's date
      // changeFrequency: 'monthly',
      // priority: 1,
    },
    // Add other static pages here if needed
    // {
    //   url: `${BASE_URL}/about`,
    //   lastModified: 'YYYY-MM-DD',
    // },
    ...postEntries,
  ];
} 