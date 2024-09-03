import { NextResponse } from "next/server";

export function middleware(request) {
  const url = new URL(request.url);
  const userAgent = request.headers.get("user-agent") || "";
  const isMobile = /mobile|android|iphone|ipad|tablet/i.test(userAgent);

  // Prevent redirect loop by excluding the /notallowed route
  if (isMobile && url.pathname !== "/notallowed") {
    return NextResponse.redirect(new URL("/notallowed", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/:path*", // Applies to all routes
};
