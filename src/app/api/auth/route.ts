import { NextResponse, type NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  const sitePassword = process.env.SITE_PASSWORD ?? process.env.BASIC_AUTH_PASSWORD;

  // No password configured → always allow (local dev with no env set)
  if (!sitePassword) {
    return NextResponse.json({ ok: true });
  }

  let body: { password?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Bad request" }, { status: 400 });
  }

  if (body.password !== sitePassword) {
    return NextResponse.json({ error: "Incorrect password" }, { status: 401 });
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set("__sub_auth", sitePassword, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    // 30-day session
    maxAge: 60 * 60 * 24 * 30,
    secure: process.env.NODE_ENV === "production",
  });
  return res;
}
