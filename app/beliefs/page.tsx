import Link from "next/link";

export const metadata = {
  title: "Beliefs",
  description: "Personal beliefs and principles I live by",
};

export default function BeliefsPage() {
  return (
    <div className="min-h-screen bg-white font-calendas">
      {/* Header */}
      <div className="flex flex-row mx-10 pb-6 md:px-36 justify-between items-center md:pt-[1em]">
        <Link href="/" className="no-underline">
          <h1 className="text-[36px]">Felix&apos;s Notes</h1>
        </Link>
        <div className="flex items-center">
          <Link href="/">
            <svg xmlns="http://www.w3.org/2000/svg" height="36" viewBox="0 0 24 24">
              <path d="M4.441,8.1,12,3l7.559,5.1A1,1,0,0,1,20,8.931V20a1,1,0,0,1-1,1H5a1,1,0,0,1-1-1V8.931A1,1,0,0,1,4.441,8.1Z"></path>
            </svg>
          </Link>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="container">
        <div className="flex p-[2em] md:p-[6em] md:pt-[2em] lg:flex-row flex-col w-screen">

          {/* Sidebar Navigation */}
          <div className="bg-[#f2f7f4] inline-block p-10 w-full ml-0 h-full mb-20 lg:ml-20 lg:w-1/4 lg:sticky lg:top-10">
            <h3 className="pb-2">Navigation</h3>
            <div className="flex flex-col child:pt-1">
              <Link className="decoration-dotted hover:underline" href="/">Home</Link>
              <Link className="decoration-dotted hover:underline" href="/beliefs">Beliefs</Link>
            </div>
          </div>

          {/* Main Content */}
          <div className="inline-block text-left justify-start p-0 w-full lg:w-3/4 lg:p-10 lg:pt-0 bg-white">
            <h4 className="text-sm">Ongoing</h4>
            <h1 className="text-[42px] text-left mt-2">Beliefs</h1>
            <h5 className="text-[14px] pt-2 mb-5 text-left">Things I believe to be true</h5>
            <hr className="border-[#F2F4F2] mb-6"/>

            <div className="markdown space-y-3">
              <p>These are ever changing! I will try to keep them as updated as possible.</p>

              <h3 className="text-xl font-semibold mt-6 mb-3">Action</h3>

              <p>I always regret inaction. For example, not reaching out to someone because I want to craft the perfect outreach message or find the right channel. Then I never do it.</p>

              <p>I guess this is not really a novel thought, but like... inaction just hurts.</p>

              <h3 className="text-xl font-semibold mt-6 mb-3">Health & Commitment</h3>

              <p>I don&apos;t like people that are sick or, even worse, use sickness as a constant excuse for cancelling plans.</p>

              <p>It&apos;s bad enough that - if you do not have a chronic disease and you are my age - you&apos;re taking such bad care of your own health. But even worse that you&apos;re using it as an excuse for your bad time management and commitment.</p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <div className="w-full">
        <div className="border-t py-6 px-10 lg:px-20 flex flex-row text-xs justify-between">
          <div>
            <h5>© {new Date().getFullYear()}</h5>
          </div>
          <div className="text-right flex flex-row">
            <h5>Design inspired by ansonyu.me</h5>
          </div>
        </div>
      </div>
    </div>
  );
}
