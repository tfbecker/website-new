"use client";
import dynamic from "next/dynamic";

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

const Header = dynamic(
  () =>
    HERO_VARIANT === "torus"
      ? import("@/components/ui/header").then((mod) => mod.Header)
      : import("@/components/ui/header-classic").then((mod) => mod.Header),
  { ssr: false }
);

export default Header;
