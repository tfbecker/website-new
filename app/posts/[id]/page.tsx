import { getPostById, getAllPosts } from '@/lib/posts';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';

interface PageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export async function generateMetadata({ 
  params,
  searchParams: _searchParams
}: { 
  params: Promise<{ id: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}): Promise<Metadata> {
  void _searchParams;
  const resolvedParams = await params;
  const post = await getPostById(resolvedParams.id);
  
  if (!post) {
    return {
      title: 'Post Not Found',
    };
  }

  return {
    title: post.title,
    description: post.summary,
  };
}

export async function generateStaticParams() {
  const posts = await getAllPosts();
  return posts.map((post) => ({
    id: post.id,
  }));
}

export default async function PostPage(props: PageProps) {
  const params = await props.params;
  const searchParams = await props.searchParams;
  void searchParams; // We're not using searchParams but we'll keep it for future use
  
  const post = await getPostById(params.id);
  if (!post) {
    notFound();
  }

  return (
    <article className="max-w-3xl mx-auto p-8">
      <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
      <p className="text-sm mb-8 text-gray-500">{post.date}</p>
      <div className="prose" dangerouslySetInnerHTML={{ __html: post.content }} />
    </article>
  );
} 