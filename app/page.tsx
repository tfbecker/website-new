import ClientHeader from "@/components/client-header";
import { EngineeringSection } from "@/components/engineering-section";
import { MediaSection } from "@/components/media-section";
import { FunSection } from "@/components/fun-section";
import { SiteFooter } from "@/components/site-footer";
import { getAllPosts } from "@/lib/posts";

export default async function Page() {
  const posts = await getAllPosts();

  return (
    <>
      <ClientHeader />
      <main>
        <EngineeringSection posts={posts} />
        <MediaSection />
        <FunSection />
        <SiteFooter />
      </main>
    </>
  );
}
