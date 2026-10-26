import type { Metadata } from "next"
export const metadata: Metadata = {
  title: { absolute: "Felix Becker: Thoughts on AI, Automation & Building" },
  description: "Writing about AI productivity, automation and building software. Personal blog of Felix Becker.",
  alternates: { canonical: "https://becker.so/blog" },
  openGraph: { title: "Felix Becker: Thoughts on AI, Automation & Building", description: "Writing about AI productivity, automation and building software.", locale: "en_US", url: "https://becker.so/blog" },
}
export default function BlogLayout({children}:{children:React.ReactNode}) { return <div lang="en">{children}</div> }
