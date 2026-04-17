import { NextResponse, type NextRequest } from "next/server";

/**
 * Password-only site gate.
 *
 * Enabled when SITE_PASSWORD (or BASIC_AUTH_PASSWORD) env var is set.
 * On first visit the user is shown /auth — a single-field password page.
 * On correct submission, /api/auth sets a __sub_auth cookie and the
 * middleware lets every subsequent request through.
 */
export function middleware(req: NextRequest) {
  const sitePassword = process.env.SITE_PASSWORD ?? process.env.BASIC_AUTH_PASSWORD;

  // Not configured → let everything through (local dev without env vars).
  if (!sitePassword) return NextResponse.next();

  const cookie = req.cookies.get("__sub_auth")?.value;
  if (cookie === sitePassword) return NextResponse.next();

  // Not authenticated — redirect to the password page.
  const url = req.nextUrl.clone();
  url.pathname = "/auth";
  return NextResponse.redirect(url);
}

export const config = {
  matcher: [
    // Protect everything except the auth page itself, Next internals, and static assets.
    "/((?!auth|api/auth|_next/static|_next/image|favicon.ico|patterns/).*)",
  ],
};
