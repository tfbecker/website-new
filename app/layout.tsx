import type { Metadata } from "next";
import { Bricolage_Grotesque, Fraunces, IBM_Plex_Mono, Source_Serif_4 } from "next/font/google";
import "./globals.css";
import "./paper.css";
import Script from "next/script";
import { PaperEffects } from "@/components/paper/effects";
import { WobbleDefs } from "@/components/paper/stickers";

// Display grotesk, a soft wonky italic for accents, a reading serif and a mono for small labels.
const display = Bricolage_Grotesque({ subsets: ["latin"], variable: "--font-display", axes: ["opsz", "wdth"] });
const accent = Fraunces({ subsets: ["latin"], style: ["italic"], variable: "--font-accent", axes: ["SOFT", "WONK", "opsz"] });
const text = Source_Serif_4({ subsets: ["latin"], style: ["normal", "italic"], variable: "--font-text", axes: ["opsz"] });
const mono = IBM_Plex_Mono({ subsets: ["latin"], weight: ["400", "500"], variable: "--font-mono" });

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://becker.so';
// Preview builds (e.g. new.becker.so) set NEXT_PUBLIC_NOINDEX=1 as a build arg: no indexing,
// no analytics. Production leaves it unset.
const NOINDEX = process.env.NEXT_PUBLIC_NOINDEX === "1";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "Felix Becker – Thoughts on AI, Automation & Building",
    template: "%s | Felix Becker",
  },
  description: "Writing about AI productivity, Claude Code workflows, automation, and building software. Personal blog of Felix Becker.",
  keywords: ["Claude Code", "AI automation", "productivity hacks", "software development", "AI tools"],
  authors: [{ name: "Felix Becker" }],
  creator: "Felix Becker",
  icons: { icon: "/favicon.svg" },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: BASE_URL,
    siteName: "Felix Becker",
    title: "Felix Becker – Thoughts on AI, Automation & Building",
    description: "Writing about AI productivity, Claude Code workflows, automation, and building software.",
  },
  twitter: {
    card: "summary",
    title: "Felix Becker – Thoughts on AI, Automation & Building",
    description: "Writing about AI productivity, Claude Code workflows, automation, and building software.",
  },
  robots: NOINDEX
    ? { index: false, follow: false }
    : {
        index: true,
        follow: true,
        googleBot: {
          index: true,
          follow: true,
          "max-video-preview": -1,
          "max-image-preview": "large",
          "max-snippet": -1,
        },
      },
};

// Runs before first paint: a saved dark/light choice never flashes the other theme, and
// scroll-reveal elements start hidden instead of popping out and back in once JS runs.
const THEME_INIT = `try{var d=document.documentElement,t=localStorage.getItem("p-theme");if(t)d.dataset.theme=t;if(!matchMedia("(prefers-reduced-motion: reduce)").matches)d.classList.add("js-reveal")}catch(e){}`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${display.variable} ${accent.variable} ${text.variable} ${mono.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT }} />
        {!NOINDEX && (
          <>
            <Script
              defer
              data-domain="becker.so"
              src="https://plausible-n0ks0g8ccksksswgsgkow8c0.becker.im/js/script.js"
              strategy="afterInteractive"
            />
            <Script id="plausible-init" strategy="afterInteractive">
              {`window.plausible = window.plausible || function() { (window.plausible.q = window.plausible.q || []).push(arguments) }`}
            </Script>
          </>
        )}
      </head>
      <body className="p-body-root antialiased">
        <WobbleDefs />
        <div className="p-ambient" aria-hidden="true"><i className="a1" /><i className="a2" /></div>
        <div className="p-grain" aria-hidden="true" />
        <div className="p-root">{children}</div>
        <PaperEffects />
      </body>
    </html>
  );
}
