import { NextResponse, type NextRequest } from "next/server";

/**
 * Simple HTTP Basic Auth gate for the entire site.
 *
 * Enabled when BOTH BASIC_AUTH_USER and BASIC_AUTH_PASSWORD env vars are set.
 * If either is unset (e.g. in local dev), the middleware is a no-op.
 */
export function middleware(req: NextRequest) {
  const expectedUser = process.env.BASIC_AUTH_USER;
  const expectedPass = process.env.BASIC_AUTH_PASSWORD;

  // Not configured → let everything through.
  if (!expectedUser || !expectedPass) return NextResponse.next();

  const header = req.headers.get("authorization") ?? "";
  if (header.toLowerCase().startsWith("basic ")) {
    const encoded = header.slice(6).trim();
    try {
      const decoded = atob(encoded);
      const sepIndex = decoded.indexOf(":");
      if (sepIndex !== -1) {
        const user = decoded.slice(0, sepIndex);
        const pass = decoded.slice(sepIndex + 1);
        if (user === expectedUser && pass === expectedPass) {
          return NextResponse.next();
        }
      }
    } catch {
      // fall through to 401
    }
  }

  return new NextResponse("Authentication required", {
    status: 401,
    headers: { "WWW-Authenticate": 'Basic realm="SUB", charset="UTF-8"' },
  });
}

export const config = {
  // Protect everything except Next internals and static assets.
  matcher: ["/((?!_next/static|_next/image|favicon.ico|patterns/).*)"],
};
