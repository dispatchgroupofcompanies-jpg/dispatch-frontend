import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Middleware to protect admin and user routes by checking a `token` cookie.
// Redirects to /login if token is missing. Adjust cookie name/paths if needed.

const PUBLIC_FILE = /\.(.*)$/;

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Allow next internals, public files, and API routes to pass through
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    PUBLIC_FILE.test(pathname) ||
    pathname === "/favicon.ico"
  ) {
    return NextResponse.next();
  }

  // Protect admin and user areas
  const requiresAuth =
    pathname.startsWith("/admin") || pathname.startsWith("/user");
  if (!requiresAuth) return NextResponse.next();

  const token = req.cookies.get("token")?.value;
  if (!token) {
    const loginUrl = req.nextUrl.clone();
    loginUrl.pathname = "/login";
    // optional: include redirect back to originally requested path
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Token exists — proceed. For additional checks, validate token on server side.
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/user/:path*"],
};
