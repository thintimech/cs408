import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const res = NextResponse.next();

  const origin = request.headers.get("origin") ?? "";
  const host = request.headers.get("host") ?? "";

  if (origin && !origin.includes(host)) {
    return new NextResponse(null, { status: 403 });
  }

  res.headers.set("X-Content-Type-Options", "nosniff");
  res.headers.set("Cache-Control", "no-store");

  return res;
}

export const config = {
  matcher: "/api/:path*",
};
