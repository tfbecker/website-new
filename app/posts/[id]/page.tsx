import { getPostById, getAllPosts } from '@/lib/posts';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { PostList } from '@/components/post-list';
import Link from 'next/link';

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
  void searchParams;
  
  const post = await getPostById(params.id);
  if (!post) {
    notFound();
  }

  const allPosts = await getAllPosts();
  const thoughts = allPosts.filter(p => p.type === 'thought');
  const projects = allPosts.filter(p => p.type === 'project');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link 
        href="/" 
        className="inline-flex items-center text-sm text-gray-500 hover:text-blue-600 mb-8"
      >
        ← Back to Home
      </Link>
      <div className="flex flex-col md:flex-row gap-12">
        <aside className="w-full md:w-64">
          <PostList thoughts={thoughts} projects={projects} hideContent={true} />
        </aside>
        <article className="flex-1">
          <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
          <p className="text-sm mb-8 text-gray-500">{post.date}</p>
          <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: post.content }} />
        </article>
      </div>
    </div>
  );
} 