import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const isAuth = request.cookies.get("userCookie")?.value;
  const currentPath = request.nextUrl.pathname;

  // console.log("Middleware - Path:", currentPath, "Auth:", isAuth);

  const protectedRoutes = ["/cart", "/store"];
  const isProtected = protectedRoutes.some((route) =>
    currentPath.startsWith(route)
  );

  if (isProtected && !isAuth) {
    return NextResponse.redirect(new URL("/login", request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/cart/:path*", "/store/:path*"],
};
