import { getPostById } from '@/lib/posts';
import { notFound } from 'next/navigation';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default async function PostPage(props: any) {
  const { params, searchParams } = props;
  void searchParams;
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