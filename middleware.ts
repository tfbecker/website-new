import { NextRequest, NextResponse } from "next/server"

// One app serves two sites: becker.im is the web agency (app/agentur), every other host
// (becker.so, blog/f.becker.im, localhost) is the personal blog.
const AGENCY_HOSTS = new Set(["becker.im", "www.becker.im"])
const AGENCY = "https://becker.im"
const BLOG = "https://becker.so"

// Agency pages; everything else on becker.im forwards to the blog.
const isAgencyPath = (path: string) => path === "/" || path.startsWith("/konzepte")

export function middleware(req: NextRequest) {
  const host = (req.headers.get("x-forwarded-host") || req.headers.get("host") || "").split(":")[0].toLowerCase()
  const { pathname, search } = req.nextUrl

  if (AGENCY_HOSTS.has(host)) {
    if (pathname === "/") return NextResponse.rewrite(new URL("/agentur", req.url))
    if (pathname === "/agentur") return NextResponse.redirect(`${AGENCY}/`, 308)
    if (!isAgencyPath(pathname)) return NextResponse.redirect(`${BLOG}${pathname}${search}`, 308)
    return NextResponse.next()
  }

  // Blog hosts: the agency lives on becker.im, the blog index is the homepage again.
  if (host.endsWith("becker.so") || host.endsWith("becker.im")) {
    if (pathname === "/agentur") return NextResponse.redirect(`${AGENCY}/`, 308)
    if (pathname.startsWith("/konzepte")) return NextResponse.redirect(`${AGENCY}${pathname}${search}`, 308)
  }
  if (pathname === "/blog") {
    // Behind the proxy req.url carries the container address, so build the target from the public host.
    const origin = host.endsWith("becker.so") || host.endsWith("becker.im") ? `https://${host}` : req.nextUrl.origin
    return NextResponse.redirect(`${origin}/${search}`, 308)
  }
  return NextResponse.next()
}

// Skip Next internals and static files (anything with an extension), so assets load on both hosts.
export const config = { matcher: ["/((?!_next/|.*\\.[a-zA-Z0-9]+$).*)"] }
