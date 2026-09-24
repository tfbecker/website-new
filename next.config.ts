import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Optimized images are keyed by source path + width; keep them a week in browser/CDN caches
    // instead of the default 60 s, which forced a revalidation on nearly every visit.
    minimumCacheTTL: 604800,
  },
  // Interactive explainers are self-contained static pages in public/<name>/index.html.
  async rewrites() {
    return [{ source: "/raptor", destination: "/raptor/index.html" }];
  },
  // Their markdown stub keeps them in the post list, sitemap and RSS; the stub URL forwards to the page.
  async redirects() {
    return [{ source: "/posts/raptor-full-flow", destination: "/raptor", permanent: false }];
  },
  // public/ files are served with max-age=0 by default, so every visit revalidated every file.
  async headers() {
    const week = "public, max-age=86400, stale-while-revalidate=604800";
    return [
      // esbuild chunks carry a content hash in their name (engine3d-HVJPB44O.js): safe to cache forever.
      // main.js and style.css keep their fixed names, so they stay on revalidation.
      {
        source: "/raptor/js/:file(.+-[A-Z0-9]{8}\\.js)",
        headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
      },
      // Browsers always revalidate the page; a CDN in front may keep it for 5 minutes.
      {
        source: "/raptor",
        headers: [{ key: "Cache-Control", value: "public, max-age=0, s-maxage=300, stale-while-revalidate=86400" }],
      },
      { source: "/raptor/og.png", headers: [{ key: "Cache-Control", value: week }] },
      { source: "/portfolio/:path*", headers: [{ key: "Cache-Control", value: week }] },
      { source: "/books/:path*", headers: [{ key: "Cache-Control", value: week }] },
      { source: "/fun/:path*", headers: [{ key: "Cache-Control", value: week }] },
      { source: "/logos/:path*", headers: [{ key: "Cache-Control", value: week }] },
    ];
  },
};

export default nextConfig;
