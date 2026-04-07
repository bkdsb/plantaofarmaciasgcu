import { NextResponse, type NextRequest } from "next/server";

const ADMIN_PREFIX = "/admin";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const hasSbAccessToken = request.cookies.getAll().some((cookie) => cookie.name.includes("sb-") && cookie.name.includes("auth-token"));

  if (pathname.startsWith(ADMIN_PREFIX) && !hasSbAccessToken) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"]
};
