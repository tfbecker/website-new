import ClientHeader from "@/components/client-header";
import { EngineeringSection } from "@/components/engineering-section";
import ReadingSection from "@/components/reading-section";
import { MediaSection } from "@/components/media-section";
import { FunSection } from "@/components/fun-section";
import { SiteFooter } from "@/components/site-footer";
import { MarioHUD } from "@/components/mario-hud";
import { getAllPosts } from "@/lib/posts";

export default async function Page() {
  const posts = await getAllPosts();

  return (
    <>
      <MarioHUD />
      <div className="pt-10 md:pt-12">
        <ClientHeader />
        <main>
          <EngineeringSection posts={posts} />
          <ReadingSection />
          <MediaSection />
          <FunSection />
          <SiteFooter />
        </main>
      </div>
    </>
  );
}
