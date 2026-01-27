import Link from "next/link";

export const metadata = {
  title: "Beliefs",
  description: "Personal beliefs and principles I live by",
};

export default function BeliefsPage() {
  return (
    <div className="min-h-screen bg-[#dcddd7] font-calendas">
      <div className="max-w-3xl mx-auto px-4 py-12">
        {/* Back button */}
        <Link
          href="/"
          className="inline-block mb-8 text-sm hover:underline"
        >
          ← Back to home
        </Link>

        {/* Title */}
        <h1 className="text-4xl md:text-6xl font-bold mb-12 tracking-tight">
          Beliefs
        </h1>

        {/* Beliefs */}
        <div className="space-y-8">
          {/* Belief 1: Regret Inaction */}
          <div className="bg-white/80 backdrop-blur p-6 border border-gray-200">
            <h2 className="text-2xl font-semibold mb-4">
              I. Regret Inaction
            </h2>
            <p className="text-gray-700 leading-relaxed mb-3">
              I always regret inaction. For example, not reaching out to someone because I want to craft the perfect outreach message or find the right channel. Then I never do it.
            </p>
            <p className="text-gray-700 leading-relaxed">
              I guess this is not really a novel thought, but like... inaction just hurts.
            </p>
          </div>

          {/* Belief 2: Sickness as Excuse */}
          <div className="bg-white/80 backdrop-blur p-6 border border-gray-200">
            <h2 className="text-2xl font-semibold mb-4">
              II. Sickness as Excuse
            </h2>
            <p className="text-gray-700 leading-relaxed mb-3">
              I don&apos;t like people that are sick or, even worse, use sickness as a constant excuse for cancelling plans.
            </p>
            <p className="text-gray-700 leading-relaxed">
              It&apos;s bad enough that - if you do not have a chronic disease and you are my age - you&apos;re taking such bad care of your own health. But even worse that you&apos;re using it as an excuse for your bad time management and commitment.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
