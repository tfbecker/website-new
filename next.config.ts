import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Interactive explainers are self-contained static pages in public/<name>/index.html.
  async rewrites() {
    return [{ source: "/raptor", destination: "/raptor/index.html" }];
  },
  // Their markdown stub keeps them in the post list, sitemap and RSS; the stub URL forwards to the page.
  async redirects() {
    return [{ source: "/posts/raptor-full-flow", destination: "/raptor", permanent: false }];
  },
};

export default nextConfig;
