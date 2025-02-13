import Link from "next/link"

export function SiteHeader() {
  return (
    <header className="bg-[#1B3B35] px-6 py-12 text-white md:px-16 md:py-16">
      <div className="relative min-h-[80vh] flex flex-col">
        <div className="flex-1">
          <h1 className="text-4xl md:text-6xl mb-12 font-serif">I&apos;m Anson!</h1>

          <div className="space-y-8 max-w-3xl">
            <div className="space-y-4">
              <p>I&apos;m currently...</p>
              <ul className="list-disc pl-5 space-y-2">
                <li>studying systems design engineering at Waterloo</li>
                <li>on our varsity rowing team as coxie</li>
                <li>building hardware for cheap clean energy</li>
                <li>
                  raising Socratica, a collective of engineers, artists, ++ that work on / demo their passion projects
                </li>
                <li>
                  making a feature length documentary on a cautiously pro-growth, resilient, pragmatic, optimistic, and
                  bipartisan approach to climate change (a mouthful!)
                </li>
              </ul>
            </div>

            <div className="space-y-4">
              <p>I&apos;m excited about ...</p>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  the climate cinematic universe, electrification and resilience (history, energy policy, batteries,
                  etc)
                </li>
                <li>the weird and silly</li>
                <li>
                  cultivating the potential of people, throwing life-changing events, match-making, raising baby ideas
                </li>
                <li>engineering that makes your heart flutter</li>
                <li>telling the history of technology, theories of civilizational prosperity, institution design</li>
              </ul>
            </div>

            <p>If any of those resonate, please reach out!</p>

            <p>
              I&apos;m always looking to befriend people who are as kind as they are ambitious, and as thoughtful as
              they are optimistic.
            </p>
          </div>
        </div>

        <nav className="absolute bottom-0 right-0 text-right space-y-2">
          <Link href="#" className="block hover:underline">
            Github
          </Link>
          <Link href="#" className="block hover:underline">
            LinkedIn
          </Link>
          <Link href="#" className="block hover:underline">
            Twitter
          </Link>
          <Link href="#" className="block hover:underline">
            Curius
          </Link>
          <Link href="#" className="block hover:underline">
            Substack
          </Link>
        </nav>
      </div>
    </header>
  )
}

