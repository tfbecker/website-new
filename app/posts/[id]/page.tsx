import { getPostById, getAllPosts } from '@/lib/posts';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { FootnotePopovers } from '@/components/footnote-popovers';
import Script from 'next/script';
import { Footer, Nav } from '@/components/paper/chrome';
import { EndMark } from '@/components/paper/stickers';
import { WritingList, kindOf } from '@/components/paper/writing';

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
    alternates: { canonical: postUrl },
    ...(post.draft && { robots: { index: false, follow: false } }),
    openGraph: {
      title: post.title,
      description: plainTextSummary,
      url: postUrl,
      type: 'article',
      locale: 'en_US',
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
  // "keep reading": the newest pieces of the same kind (writing or projects), without this one
  const sameKind = (p: typeof post) => (p.type === 'project') === (post.type === 'project');
  const more = allPosts.filter((p) => p.id !== post.id && sameKind(p)).slice(0, 5);

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
      <Nav />
      <div className="p-progress" data-progress aria-hidden="true" />
      <main className="p-page">
        <article className="p-wrap p-article" data-article data-tint="sun">
          <header className="p-article-head">
            <p className="p-eyebrow">
              {kindOf(post)} · {post.date}
              {post.draft && <span className="p-draft">draft</span>}
            </p>
            <h1 className="p-post-title">{post.title}</h1>
          </header>
          <div className="p-prose" dangerouslySetInnerHTML={{ __html: post.content }} suppressHydrationWarning />
          <p className="p-article-end"><EndMark /> thanks for reading</p>
        </article>
        <WritingList posts={more} heading="keep reading" id="more" walker={false} />
        <FootnotePopovers />
      </main>
      <Footer />
    </>
  );
}
