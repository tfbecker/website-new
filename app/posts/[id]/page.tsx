import { getPostById, getAllPosts } from '@/lib/posts';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { PostList } from '@/components/post-list';
import { FootnotePopovers } from '@/components/footnote-popovers';
import Link from 'next/link';
import Script from 'next/script';

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

  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://becker.so';
  const postUrl = `${BASE_URL}/posts/${resolvedParams.id}`;
  const imageUrl = `${BASE_URL}/favicon.svg`;

  // Strip HTML from summary for meta description
  const plainTextSummary = post.summary.replace(/<[^>]*>/g, '');

  return {
    title: post.title,
    description: plainTextSummary,
    openGraph: {
      title: post.title,
      description: plainTextSummary,
      url: postUrl,
      type: 'article',
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: plainTextSummary,
      images: [imageUrl],
    },
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

  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://becker.so';
  const plainTextSummary = post.summary.replace(/<[^>]*>/g, '');

  // JSON-LD structured data for SEO
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: plainTextSummary,
    datePublished: post.date,
    dateModified: post.date,
    author: {
      '@type': 'Person',
      name: 'Felix Becker',
      url: BASE_URL,
    },
    publisher: {
      '@type': 'Person',
      name: 'Felix Becker',
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${BASE_URL}/posts/${params.id}`,
    },
  };

  return (
    <>
      <Script
        id="json-ld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link
          href="/"
          className="inline-flex items-center text-sm text-gray-500 hover:text-blue-600 mb-8"
        >
          ← Back to Home
        </Link>
        <div className="flex flex-col md:flex-row gap-12">
          <article className="flex-1 order-1 md:order-2">
            <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
            <p className="text-sm mb-8 text-gray-500">{post.date}</p>
            <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: post.content }} suppressHydrationWarning />
          </article>
          <aside className="w-full md:w-64 order-2 md:order-1 mt-12 md:mt-0">
            <PostList thoughts={thoughts} projects={projects} hideContent={true} />
          </aside>
        </div>
        <FootnotePopovers />
      </div>
    </>
  );
} 