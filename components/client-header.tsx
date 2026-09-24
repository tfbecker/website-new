"use client";
import dynamic from "next/dynamic";
import { Header as ClassicHeader } from "@/components/ui/header-classic";

// ── Hero switch ──────────────────────────────────────────────────────────────
// Which hero renders on the homepage:
//   "classic" → original "Hi, I'm Felix" hero with the PixelTrail circles
//               (components/ui/header-classic.tsx)
//   "torus"   → interactive 3D ASCII text-torus  (components/ui/header.tsx)
//
// Flip the default below, or override per-environment with NEXT_PUBLIC_HERO_VARIANT.
const HERO_VARIANT =
  (process.env.NEXT_PUBLIC_HERO_VARIANT as "classic" | "torus" | undefined) ?? "classic";
// ─────────────────────────────────────────────────────────────────────────────

// The classic hero is server-rendered so its text is in the first HTML and nothing
// below it moves; only its circle animation loads later (see header-classic.tsx).
// The torus is canvas-only, so it stays client-side behind a same-size placeholder.
const TorusHeader = dynamic(
  () => import("@/components/ui/header").then((mod) => mod.Header),
  {
    ssr: false,
    loading: () => <div className="w-full h-[85vh] md:h-[90vh] bg-[#dcddd7]" />,
  }
);

export default function Header() {
  return HERO_VARIANT === "torus" ? <TorusHeader /> : <ClassicHeader />;
}
