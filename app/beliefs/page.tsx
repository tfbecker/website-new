import { Footer, Nav } from "@/components/paper/chrome";
import { EndMark } from "@/components/paper/stickers";

export const metadata = {
  title: "Beliefs",
  description: "Personal beliefs and principles I live by",
};

export default function BeliefsPage() {
  return (
    <>
      <Nav />
      <main className="p-page">
        <article className="p-wrap p-article" data-tint="sage">
          <header className="p-article-head">
            <p className="p-eyebrow">ongoing · things I believe to be true</p>
            <h1 className="p-post-title">beliefs</h1>
          </header>
          <div className="p-prose">
          <p>These are ever changing! I will try to keep them as updated as possible.</p>
          <h2>Action</h2>
          <p>I always regret inaction. For example, not reaching out to someone because I want to craft the perfect outreach message or find the right channel. Then I never do it.</p>
          <p>I guess this is not really a novel thought, but like... inaction just hurts.</p>
          <h2>Health & Commitment</h2>
          <p>I don&apos;t like people that are sick or, even worse, use sickness as a constant excuse for cancelling plans.</p>
          <p>It&apos;s bad enough that - if you do not have a chronic disease and you are my age - you&apos;re taking such bad care of your own health. But even worse that you&apos;re using it as an excuse for your bad time management and commitment.</p>
          <h2>80/20 Pareto Rule is Not Correct</h2>
          <p>This is an economic principle that is being misused by productivity gurus. Most of the time putting more effort in yields more outcome.</p>
          <p>See also <a href="https://www.linkedin.com/pulse/time-value-mike-speiser/" target="_blank" rel="noopener noreferrer" className="underline decoration-dotted">The time value of time</a>.</p>
          </div>
          <p className="p-article-end"><EndMark /> ever changing</p>
        </article>
      </main>
      <Footer />
    </>
  );
}
