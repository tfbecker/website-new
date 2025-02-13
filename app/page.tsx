"use client";

// Removed old header import
// import { Header } from "@/components/ui/header";

import { Header } from "@/components/ui/header";
import { EngineeringSection } from "@/components/engineering-section";
import { MediaSection } from "@/components/media-section";
import { FunSection } from "@/components/fun-section";
import { SiteFooter } from "@/components/site-footer";


export default function Page() {
  return (
    <>
      <Header />
      <main>
        <EngineeringSection />
        <MediaSection />
        <FunSection />
        <SiteFooter />
      </main>
    </>
  );
}
