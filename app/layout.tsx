import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import DelayedScrollBuddy from "@/components/delayed-scroll-buddy";
import Script from "next/script";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://becker.so';

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
  robots: {
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <Script
          defer
          data-domain="becker.so"
          src="https://plausible-n0ks0g8ccksksswgsgkow8c0.becker.im/js/script.js"
          strategy="afterInteractive"
        />
        <Script id="plausible-init" strategy="afterInteractive">
          {`window.plausible = window.plausible || function() { (window.plausible.q = window.plausible.q || []).push(arguments) }`}
        </Script>
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <DelayedScrollBuddy />
      </body>
    </html>
  );
}
